const RAZORPAY_ORDERS_URL = "https://api.razorpay.com/v1/orders";

function sendJson(res, statusCode, body) {
  res.status(statusCode).json(body);
}

function readBody(req) {
  if (typeof req.body !== "string") return req.body ?? {};

  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

function getRazorpayErrorMessage(payload) {
  if (typeof payload?.error?.description === "string") {
    return payload.error.description;
  }

  if (typeof payload?.error === "string") {
    return payload.error;
  }

  return "Razorpay order creation failed.";
}

async function readRazorpayPayload(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return sendJson(res, 500, { error: "Razorpay credentials are not configured." });
  }

  const { amount, currency = "INR", receipt } = readBody(req);
  const parsedAmount = Number(amount);

  if (!Number.isInteger(parsedAmount) || parsedAmount < 100) {
    return sendJson(res, 400, { error: "Amount must be at least 100 paise." });
  }

  if (typeof currency !== "string" || currency.trim().length !== 3) {
    return sendJson(res, 400, { error: "Currency must be a 3-letter code." });
  }

  const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  try {
    const response = await fetch(RAZORPAY_ORDERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: parsedAmount,
        currency: currency.trim().toUpperCase(),
        receipt: typeof receipt === "string" ? receipt.slice(0, 40) : undefined,
      }),
    });

    const payload = await readRazorpayPayload(response);

    if (!response.ok) {
      const statusCode = response.status === 401 ? 401 : 500;
      return sendJson(res, statusCode, { error: getRazorpayErrorMessage(payload) });
    }

    return sendJson(res, 200, {
      order_id: payload.id,
      amount: payload.amount,
      currency: payload.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    return sendJson(res, 500, { error: "Razorpay order creation failed." });
  }
};
