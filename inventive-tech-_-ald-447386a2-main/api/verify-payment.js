import crypto from "node:crypto";

function sendJson(res, statusCode, body) {
  res.status(statusCode).json(body);
}

function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) return false;

  return crypto.timingSafeEqual(left, right);
}

function readBody(req) {
  if (typeof req.body !== "string") return req.body ?? {};

  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return sendJson(res, 500, { error: "Razorpay secret is not configured." });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = readBody(req);

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return sendJson(res, 400, { error: "Missing payment verification fields." });
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (!safeEqual(generatedSignature, String(razorpay_signature))) {
    return sendJson(res, 400, { error: "Payment signature verification failed." });
  }

  return sendJson(res, 200, { success: true });
}
