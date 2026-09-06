/**
 * 👑 Inventive Queen Secure Server API Handlers
 *
 * Implements server-side Razorpay order generation and cryptographic HMAC
 * payment signature verification.
 */

import { verifyRazorpaySignature, sanitizeText } from "../lib/security";

const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

function getEnv(name: string, env?: any): string {
  if (env && typeof env[name] === "string" && env[name]) {
    return env[name];
  }
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name]!;
  }
  return "";
}

function jsonResponse(body: any, status = 200): Response {
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
  env?: any
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const keyId = getEnv("RAZORPAY_KEY_ID", env) || getEnv("VITE_RAZORPAY_KEY_ID", env);
  const keySecret = getEnv("RAZORPAY_KEY_SECRET", env);

  if (!keyId || !keySecret) {
    return jsonResponse({ error: "Razorpay credentials are not configured on server." }, 500);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const { amount, currency = "INR", receipt, order_id } = body || {};
  let parsedAmount = Math.round(Number(amount));

  // 🛡️ Integrity check: Cross-validate amount against Supabase database order record
  if (order_id) {
    const supabaseUrl = getEnv("VITE_SUPABASE_URL", env);
    const supabaseKey =
      getEnv("SUPABASE_SERVICE_ROLE_KEY", env) ||
      getEnv("VITE_SUPABASE_ANON_KEY", env);

    if (supabaseUrl && supabaseKey) {
      try {
        const orderCheckRes = await fetch(
          `${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(order_id)}&select=id,amount_total,payment_status`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );

        if (orderCheckRes.ok) {
          const rows: any = await orderCheckRes.json();
          if (rows && rows.length > 0) {
            const dbOrder = rows[0];
            if (dbOrder.payment_status === "paid") {
              return jsonResponse({ error: "Order has already been paid and finalized." }, 400);
            }
            const expectedPaise = Math.round(Number(dbOrder.amount_total) * 100);
            if (expectedPaise > 0 && Math.abs(expectedPaise - parsedAmount) > 1) {
              console.warn(
                `[SECURITY ALERT] Order amount tampering detected! Client sent: ${parsedAmount}, Database requires: ${expectedPaise}`
              );
              return jsonResponse({ error: "Order price discrepancy detected. Integrity check failed." }, 400);
            }
            parsedAmount = expectedPaise;
          }
        }
      } catch (dbErr) {
        console.warn("Could not cross-check order price from DB, falling back to validated payload:", dbErr);
      }
    }
  }

  if (!Number.isInteger(parsedAmount) || parsedAmount < 100) {
    return jsonResponse({ error: "Amount must be at least ₹1 (100 paise)." }, 400);
  }

  const cleanCurrency = String(currency).trim().toUpperCase();
  if (cleanCurrency.length !== 3) {
    return jsonResponse({ error: "Currency must be a 3-letter code." }, 400);
  }

  const safeReceipt = sanitizeText(receipt, 40);

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
        receipt: safeReceipt || undefined,
      }),
    });

    const data: any = await rzpRes.json();

    if (!rzpRes.ok) {
      console.error("Razorpay API error:", data);
      const errMsg = data?.error?.description || data?.error?.message || "Failed to create Razorpay order";
      return jsonResponse({ error: errMsg }, rzpRes.status === 401 ? 401 : 500);
    }

    return jsonResponse({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (err: any) {
    console.error("Failed to connect to Razorpay:", err);
    return jsonResponse({ error: "Network error connecting to payment gateway" }, 502);
  }
}

/**
 * Handles POST /api/verify-payment
 */
export async function handleVerifyPayment(
  request: Request,
  env?: any
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const keySecret = getEnv("RAZORPAY_KEY_SECRET", env);
  if (!keySecret) {
    return jsonResponse({ error: "Razorpay secret is not configured." }, 500);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON payload" }, 400);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body || {};

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return jsonResponse({ error: "Missing required payment verification tokens." }, 400);
  }

  // Cryptographically verify HMAC-SHA256 signature
  const isValid = await verifyRazorpaySignature(
    String(razorpay_order_id).trim(),
    String(razorpay_payment_id).trim(),
    String(razorpay_signature).trim(),
    keySecret
  );

  if (!isValid) {
    console.warn(`[SECURITY ALERT] Payment signature verification failed for payment: ${razorpay_payment_id}`);
    return jsonResponse({ error: "Cryptographic signature verification failed. Untrusted payment payload." }, 400);
  }

  // If order_id was provided, update Supabase order record
  if (order_id) {
    const supabaseUrl = getEnv("VITE_SUPABASE_URL", env);
    const supabaseKey =
      getEnv("SUPABASE_SERVICE_ROLE_KEY", env) ||
      getEnv("VITE_SUPABASE_ANON_KEY", env);

    if (supabaseUrl && supabaseKey) {
      try {
        const updateRes = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${encodeURIComponent(order_id)}`, {
          method: "PATCH",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            payment_status: "paid",
            status: "confirmed",
            payment_id: String(razorpay_payment_id).trim(),
          }),
        });

        if (!updateRes.ok) {
          const errText = await updateRes.text();
          console.error("Failed to update order status in Supabase:", errText);
        }
      } catch (dbErr) {
        console.error("Database connection error during payment confirmation:", dbErr);
      }
    }
  }

  return jsonResponse({
    success: true,
    message: "Payment successfully verified and confirmed.",
    payment_id: razorpay_payment_id,
  });
}
