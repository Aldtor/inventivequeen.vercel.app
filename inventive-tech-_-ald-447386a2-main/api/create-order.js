import Razorpay from "razorpay";

function sendJson(res, statusCode, body) {
  res.status(statusCode).json(body);
}

function getErrorStatus(error) {
  return error?.statusCode ?? error?.error?.status_code ?? error?.response?.status;
}

function getErrorMessage(error) {
  return error?.error?.description ?? error?.message ?? "Razorpay order creation failed.";
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

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    const order = await razorpay.orders.create({
      amount: parsedAmount,
      currency: currency.trim().toUpperCase(),
      receipt: typeof receipt === "string" ? receipt.slice(0, 40) : undefined,
    });

    return sendJson(res, 200, {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const status = getErrorStatus(error);
    const statusCode = status === 401 ? 401 : 500;
    return sendJson(res, statusCode, { error: getErrorMessage(error) });
  }
}
