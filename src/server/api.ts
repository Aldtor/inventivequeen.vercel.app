/**
 * Inventive Queen Secure Server API Handlers
 *
 * Implements server-side Razorpay order generation and cryptographic HMAC
 * payment signature verification with Supabase RPC confirmation.
 */

import { verifyRazorpaySignature, sanitizeText } from "../lib/security";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

interface CreateOrderPayload {
  amount?: number | string;
  currency?: string;
  receipt?: string;
  order_id?: string;
}

interface VerifyPaymentPayload {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  order_id?: string;
}

interface RazorpayOrderResponse {
  id?: string;
  amount?: number;
  currency?: string;
  error?: {
    description?: string;
    message?: string;
  };
}

interface DbOrderRow {
  id: string;
  amount_total: number;
  payment_status: string;
}

const DEFAULT_SERVER_ENV_FALLBACKS: Record<string, string> = {
  VITE_SUPABASE_URL: "https://fsttdvcntqlhnjdhogic.supabase.co",
  VITE_SUPABASE_ANON_KEY:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdHRkdmNudHFsaG5qZGhvZ2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMzM3NDEsImV4cCI6MjA4OTgwOTc0MX0.x_TD4obU3gD4gpMUXhvYOxrbkUix_z5LVjt1vQq8tW4",
  VITE_RAZORPAY_KEY_ID: "rzp_live_TYUEKLyErpyGRl",
  RAZORPAY_KEY_ID: "rzp_live_TYUEKLyErpyGRl",
  RAZORPAY_KEY_SECRET: "NM1DhHxwAPDodXV1wVQ6CRHW",
};

function getEnv(name: string, env?: unknown): string {
  if (env && typeof env === "object" && name in env) {
    const val = (env as Record<string, unknown>)[name];
    if (typeof val === "string" && val) return val;
  }
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name]!;
  }
  return DEFAULT_SERVER_ENV_FALLBACKS[name] || "";
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    },
  });
}

/**
 * Handles POST /api/create-razorpay-order
 */
export async function handleCreateRazorpayOrder(
  request: Request,
  env?: unknown,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const keyId = getEnv("RAZORPAY_KEY_ID", env) || getEnv("VITE_RAZORPAY_KEY_ID", env);
  const keySecret = getEnv("RAZORPAY_KEY_SECRET", env);

  if (!keyId || !keySecret) {
    return jsonResponse({ error: "Razorpay credentials are not configured on server." }, 500);
  }

  let body: CreateOrderPayload;
  try {
    body = (await request.json()) as CreateOrderPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const { amount, currency = "INR", receipt, order_id } = body || {};
  let parsedAmount = Math.round(Number(amount));

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return jsonResponse({ error: "Invalid order amount specified." }, 400);
  }
  if (parsedAmount > 10_000_000) {
    return jsonResponse({ error: "Order amount exceeds maximum transaction threshold." }, 400);
  }

  const cleanCurrency = sanitizeText(currency || "INR", 3).toUpperCase();
  if (cleanCurrency !== "INR") {
    return jsonResponse({ error: "Only INR currency is supported." }, 400);
  }

  const cleanReceipt = sanitizeText(receipt, 40);
  const cleanOrderId = sanitizeText(order_id, 40);

  // Integrity check: Cross-validate amount against Supabase database order record
  if (cleanOrderId) {
    const supabaseUrl = getEnv("VITE_SUPABASE_URL", env);
    const supabaseKey =
      getEnv("SUPABASE_SERVICE_ROLE_KEY", env) || getEnv("VITE_SUPABASE_ANON_KEY", env);

    if (supabaseUrl && supabaseKey) {
      try {
        const orderCheckRes = await fetch(
          `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(cleanOrderId)}&select=id,amount_total,payment_status`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          },
        );

        if (orderCheckRes.ok) {
          const rows = (await orderCheckRes.json()) as DbOrderRow[];
          if (rows && rows.length > 0 && rows[0]) {
            const dbOrder = rows[0];
            if (dbOrder.payment_status === "paid") {
              return jsonResponse({ error: "Order has already been paid and finalized." }, 400);
            }
            const expectedPaise = Math.round(Number(dbOrder.amount_total) * 100);
            if (expectedPaise > 0 && Math.abs(expectedPaise - parsedAmount) > 1) {
              console.warn(
                `[SECURITY ALERT] Order amount tampering detected! Client sent: ${parsedAmount}, Database requires: ${expectedPaise}`,
              );
              return jsonResponse(
                { error: "Order price discrepancy detected. Integrity check failed." },
                400,
              );
            }
            parsedAmount = expectedPaise;
          }
        }
      } catch (dbErr) {
        console.warn(
          "Could not cross-check order price from DB, falling back to validated payload:",
          dbErr,
        );
      }
    }
  }

  if (!Number.isInteger(parsedAmount) || parsedAmount < 100) {
    return jsonResponse({ error: "Amount must be at least ₹1 (100 paise)." }, 400);
  }

  // Encode Basic Auth for Razorpay API
  let authHeader = "";
  if (typeof Buffer !== "undefined") {
    authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  } else {
    authHeader = btoa(`${keyId}:${keySecret}`);
  }

  try {
    const rzpRes = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parsedAmount,
        currency: cleanCurrency,
        receipt: cleanReceipt || undefined,
      }),
    });

    const data = (await rzpRes.json()) as RazorpayOrderResponse;

    if (!rzpRes.ok) {
      console.error("Razorpay API error:", data);
      const errMsg =
        data?.error?.description || data?.error?.message || "Failed to create Razorpay order";
      return jsonResponse({ error: errMsg }, rzpRes.status === 401 ? 401 : 500);
    }

    return jsonResponse({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (err) {
    console.error("Failed to connect to Razorpay:", err);
    return jsonResponse({ error: "Network error connecting to payment gateway" }, 502);
  }
}

/**
 * Handles POST /api/verify-payment
 */
export async function handleVerifyPayment(request: Request, env?: unknown): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const keySecret = getEnv("RAZORPAY_KEY_SECRET", env);
  if (!keySecret) {
    return jsonResponse({ error: "Razorpay secret is not configured." }, 500);
  }

  let body: VerifyPaymentPayload;
  try {
    body = (await request.json()) as VerifyPaymentPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id, user_id } =
    body || {};

  const cleanRazorpayOrderId = sanitizeText(razorpay_order_id, 80);
  const cleanRazorpayPaymentId = sanitizeText(razorpay_payment_id, 80);
  const cleanRazorpaySignature = sanitizeText(razorpay_signature, 128);
  const cleanOrderId = sanitizeText(order_id, 40);
  const cleanUserId = sanitizeText(user_id, 40);

  if (!cleanRazorpayOrderId || !cleanRazorpayPaymentId || !cleanRazorpaySignature) {
    return jsonResponse({ error: "Missing or malformed payment verification tokens." }, 400);
  }

  // Cryptographically verify HMAC-SHA256 signature
  const isValid = await verifyRazorpaySignature(
    cleanRazorpayOrderId,
    cleanRazorpayPaymentId,
    cleanRazorpaySignature,
    keySecret,
  );

  if (!isValid) {
    console.warn(
      `[SECURITY ALERT] Payment signature verification failed for payment: ${razorpay_payment_id}`,
    );
    return jsonResponse(
      { error: "Cryptographic signature verification failed. Untrusted payment payload." },
      400,
    );
  }

  let dbUpdated = false;

  // If order_id was provided, update Supabase order record via atomic confirm_order_payment RPC
  if (cleanOrderId) {
    const supabaseUrl = getEnv("VITE_SUPABASE_URL", env);
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY", env);
    const anonKey = getEnv("VITE_SUPABASE_ANON_KEY", env);
    const incomingAuth = request.headers.get("Authorization");

    // Prefer service role key, else forward caller's authenticated user bearer token
    const authBearer = serviceRoleKey
      ? `Bearer ${serviceRoleKey}`
      : incomingAuth || (anonKey ? `Bearer ${anonKey}` : "");

    const apiKey = anonKey || serviceRoleKey || "";

    if (supabaseUrl && apiKey) {
      try {
        // Priority 1: Call confirm_order_payment RPC (SECURITY DEFINER with trigger override)
        const rpcRes = await fetch(`${supabaseUrl}/rest/v1/rpc/confirm_order_payment`, {
          method: "POST",
          headers: {
            apikey: apiKey,
            Authorization: authBearer,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_order_id: cleanOrderId,
            p_payment_id: cleanRazorpayPaymentId,
            p_user_id: cleanUserId || null,
          }),
        });

        if (rpcRes.ok) {
          dbUpdated = true;
        } else {
          const rpcErr = await rpcRes.text();
          console.warn("confirm_order_payment RPC returned non-200:", rpcRes.status, rpcErr);

          // Priority 2: Fallback to direct PATCH if service role key or user auth is active
          const updateRes = await fetch(
            `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(cleanOrderId)}`,
            {
              method: "PATCH",
              headers: {
                apikey: apiKey,
                Authorization: authBearer,
                "Content-Type": "application/json",
                Prefer: "return=representation",
              },
              body: JSON.stringify({
                payment_status: "paid",
                status: "confirmed",
                payment_id: cleanRazorpayPaymentId,
              }),
            },
          );

          if (updateRes.ok) {
            const updatedRows = (await updateRes.json()) as unknown[];
            if (Array.isArray(updatedRows) && updatedRows.length > 0) {
              dbUpdated = true;
            }
          } else {
            const errText = await updateRes.text();
            console.error("Failed to update order status in Supabase fallback:", errText);
          }
        }
      } catch (dbErr) {
        console.error("Database connection error during payment confirmation:", dbErr);
      }
    }
  }

  return jsonResponse({
    success: true,
    verified: true,
    db_updated: dbUpdated,
    message: dbUpdated
      ? "Payment successfully verified and confirmed in database."
      : "Payment cryptographically verified. Client finalization required.",
    payment_id: cleanRazorpayPaymentId,
  });
}
