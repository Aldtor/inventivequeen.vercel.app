/**
 * Inventive Queen Security & Validation Utility
 *
 * Centralized security functions for input sanitization, safe redirects,
 * cryptographic verification, and format validation.
 */

/**
 * Sanitizes generic user text input to neutralize HTML injection, XSS, and control characters.
 */
export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    return "";
  }

  // 1. Remove NULL bytes and low ASCII control characters (preserving tab, newline, carriage return)
  let clean = "";
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if ((code >= 32 && code !== 127) || code === 9 || code === 10 || code === 13) {
      clean += input[i];
    }
  }

  // 2. Strip full <script>...</script> and <style>...</style> blocks with content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 3. Strip all remaining HTML tags
  clean = clean.replace(/<[^>]*>?/gm, "");

  // 4. Neutralize active scripting/protocol injections
  clean = clean.replace(/^(?:javascript|vbscript|data):.*$/gi, "");
  clean = clean.replace(/(?:javascript|vbscript|data):/gi, "");

  // 5. Trim whitespace and enforce length boundary
  return clean.trim().slice(0, maxLength);
}

/**
 * Recursively sanitizes strings in an object or array.
 */
export function sanitizeObject<T>(input: T, maxStringLength = 1000): T {
  if (typeof input === "string") {
    return sanitizeText(input, maxStringLength) as unknown as T;
  }
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeObject(item, maxStringLength)) as unknown as T;
  }
  if (input !== null && typeof input === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      output[key] = sanitizeObject(value, maxStringLength);
    }
    return output as T;
  }
  return input;
}

/**
 * Validates a 10-digit Indian mobile number.
 */
export function validatePhone(phone: unknown): boolean {
  if (typeof phone !== "string") return false;
  const digits = phone.replace(/[^\d]/g, "");
  // Indian mobile numbers typically have 10 digits and start with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(digits.slice(-10));
}

/**
 * Validates a 6-digit Indian PIN code.
 */
export function validatePincode(pincode: unknown): boolean {
  if (typeof pincode !== "string") return false;
  const clean = pincode.replace(/[^\d]/g, "");
  return /^[1-9]\d{5}$/.test(clean);
}

/**
 * Validates that a redirect URL is strictly an internal, relative path.
 * Prevents Open Redirect phishing attacks (e.g., /login?redirect=https://attacker.com).
 */
export function getSafeRedirectUrl(url: unknown, defaultUrl: string = "/checkout"): string {
  if (typeof url !== "string" || !url) {
    return defaultUrl;
  }

  const trimmed = url.trim();

  // Must start with a single slash, not double slash // (protocol relative) or /\ (backslash bypass)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return defaultUrl;
  }

  // Reject anything containing colon before slash (e.g., "javascript:", "data:", "http:")
  const firstSlashIndex = trimmed.indexOf("/");
  const firstColonIndex = trimmed.indexOf(":");
  if (firstColonIndex !== -1 && firstColonIndex < firstSlashIndex) {
    return defaultUrl;
  }

  // Reject known pseudo-protocols or external patterns
  if (/(?:javascript|data|vbscript):/i.test(trimmed)) {
    return defaultUrl;
  }

  return trimmed;
}

/**
 * Timing-safe buffer comparison to prevent timing attacks during HMAC signature verification.
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Cryptographic HMAC-SHA256 signature verification for Razorpay payments.
 * Compatible with Node.js crypto and Web Crypto environments.
 */
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }

  try {
    const data = `${orderId}|${paymentId}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(data);

    const subtle = globalThis.crypto?.subtle;
    if (!subtle) {
      console.error("Web Crypto API is not available in this environment.");
      return false;
    }

    const cryptoKey = await subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const signatureBuffer = await subtle.sign("HMAC", cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return timingSafeEqualStrings(expectedSignature.toLowerCase(), signature.toLowerCase());
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

/**
 * Validates password strength against modern OWASP criteria:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 numeric digit
 * - At least 1 special character
 */
export function validatePasswordStrength(password: unknown): {
  isValid: boolean;
  message?: string;
} {
  if (typeof password !== "string" || !password) {
    return { isValid: false, message: "Password is required." };
  }

  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }

  if (password.length > 128) {
    return { isValid: false, message: "Password cannot exceed 128 characters." };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter (a-z).",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter (A-Z).",
    };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: "Password must contain at least one number (0-9)." };
  }

  if (!/[[\]!@#$%^&*()_+\-={};':"\\|,.<>/?~`]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (e.g. !@#$%^&*).",
    };
  }

  return { isValid: true };
}
