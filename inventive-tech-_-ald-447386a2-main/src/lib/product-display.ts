import type { Product } from "@/lib/products";

export function parsePriceValue(price: string | number | null | undefined): number {
  if (typeof price === "number") return Number.isFinite(price) ? price : 0;
  if (!price) return 0;
  return Number(String(price).replace(/[^\d]/g, "")) || 0;
}

export function formatPrice(value: string | number | null | undefined) {
  if (typeof value === "string" && value.trim().startsWith("Rs.")) return value.trim();
  const amount = parsePriceValue(value);
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

export function calculateDiscountPercent(originalPrice: string | number, sellingPrice: string | number) {
  const original = parsePriceValue(originalPrice);
  const selling = parsePriceValue(sellingPrice);
  if (original <= 0 || selling <= 0 || selling >= original) return 0;
  return Math.round(((original - selling) / original) * 100);
}

export function getProductPricing(product: Product) {
  const sellingPrice = product.sellingPrice || product.price;
  const originalPrice = product.originalPrice;
  const discountPercent =
    product.discountPercent ??
    (originalPrice ? calculateDiscountPercent(originalPrice, sellingPrice) : 0);

  return {
    sellingPrice: formatPrice(sellingPrice),
    originalPrice: originalPrice ? formatPrice(originalPrice) : "",
    discountPercent,
    hasDiscount: Boolean(originalPrice && discountPercent > 0),
  };
}

export function isNewArrival(product: Product, now = new Date()) {
  if (!product.isNewArrival) return false;
  const days = product.newArrivalDays ?? 30;
  const startedAt = product.newArrivalStartedAt ? new Date(product.newArrivalStartedAt) : null;
  if (!startedAt || Number.isNaN(startedAt.getTime())) return true;
  const ageMs = now.getTime() - startedAt.getTime();
  return ageMs <= days * 24 * 60 * 60 * 1000;
}
