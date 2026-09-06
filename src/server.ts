import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { handleCreateRazorpayOrder, handleVerifyPayment } from "./server/api";
import { checkRateLimit, getClientIp } from "./server/rate-limiter";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

/**
 * Injects robust HTTP security headers to protect against clickjacking,
 * MIME-sniffing, XSS, and unauthorized framing.
 */
function applySecurityHeaders(res: Response): Response {
  const headers = new Headers(res.headers);

  // Core Security Headers
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("X-XSS-Protection", "1; mode=block");

  // Content-Security-Policy for HTML pages
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://api.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://fsttdvcntqlhnjdhogic.supabase.co https://*.supabase.co https://images.unsplash.com https://*.razorpay.com",
      "connect-src 'self' https://fsttdvcntqlhnjdhogic.supabase.co https://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com",
      "frame-src 'self' https://api.razorpay.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");

    headers.set("Content-Security-Policy", cspDirectives);
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const url = new URL(request.url);

    // 1. Secure Server-side API Routing & Defenses
    if (url.pathname.startsWith("/api/")) {
      // A. Sliding-Window Rate Limiting Protection (20 req / minute per IP)
      const clientIp = getClientIp(request);
      const rateLimit = checkRateLimit(clientIp, 20, 60_000);

      if (!rateLimit.allowed) {
        console.warn(`[SECURITY ALERT] Rate limit exceeded for IP: ${clientIp} on endpoint ${url.pathname}`);
        const rateLimitResponse = new Response(
          JSON.stringify({
            error: "Too many requests. For security reasons, please wait before trying again.",
            retryAfter: rateLimit.retryAfterSeconds,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(rateLimit.retryAfterSeconds),
              "X-RateLimit-Limit": String(rateLimit.limit),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
        return applySecurityHeaders(rateLimitResponse);
      }

      // B. CSRF & Same-Origin Verification for state-changing requests
      if (request.method === "POST") {
        const origin = request.headers.get("origin");
        if (origin) {
          try {
            const originHost = new URL(origin).host;
            const requestHost = url.host;
            if (
              originHost !== requestHost &&
              !originHost.includes("localhost") &&
              !originHost.includes("127.0.0.1")
            ) {
              console.warn(`[SECURITY ALERT] Cross-origin API request blocked from: ${origin}`);
              const forbiddenResponse = new Response(
                JSON.stringify({ error: "Access Denied: Cross-Origin request blocked." }),
                {
                  status: 403,
                  headers: { "Content-Type": "application/json" },
                }
              );
              return applySecurityHeaders(forbiddenResponse);
            }
          } catch {
            // Malformed origin URL
          }
        }
      }

      // C. Endpoint Routing
      if (url.pathname === "/api/create-razorpay-order" || url.pathname === "/api/create-order") {
        const res = await handleCreateRazorpayOrder(request, env);
        return applySecurityHeaders(res);
      }

      if (url.pathname === "/api/verify-payment") {
        const res = await handleVerifyPayment(request, env);
        return applySecurityHeaders(res);
      }
    }

    // 2. Application and SSR Routing with Security Headers
    try {
      const handler = await getServerEntry();
      const rawResponse = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(rawResponse);
      return applySecurityHeaders(normalizedResponse);
    } catch (error) {
      console.error("SSR Handler Error:", error);
      const errorResponse = new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
      return applySecurityHeaders(errorResponse);
    }
  },
};
