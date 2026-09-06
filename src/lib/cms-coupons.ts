import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface Coupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  expiryDate?: string;
  createdAt?: string;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    code: "ROYAL10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 999,
    description: "10% off handcrafted creations on orders above ₹999",
    isActive: true,
  },
  {
    code: "QUEEN200",
    discountType: "flat",
    discountValue: 200,
    minOrderValue: 1499,
    description: "Flat ₹200 royal blessing on orders above ₹1,499",
    isActive: true,
  },
  {
    code: "ATELIER15",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 2499,
    description: "15% off bespoke bouquets & dolls above ₹2,499",
    isActive: true,
  },
];

const STORAGE_KEY = "inventive_queen_coupons_cms";
const COUPONS_EVENT = "inventive_queen_coupons_updated";

export function getCoupons(): Coupon[] {
  if (typeof window === "undefined") {
    return DEFAULT_COUPONS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_COUPONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_COUPONS;
  } catch {
    return DEFAULT_COUPONS;
  }
}

export function saveCoupons(coupons: Coupon[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new CustomEvent(COUPONS_EVENT, { detail: coupons }));

    if (isSupabaseConfigured) {
      supabase
        .from("site_settings")
        .upsert({ id: "coupons_cms", settings: coupons, updated_at: new Date().toISOString() })
        .then(() => {}, () => {});
    }
  } catch (err) {
    console.error("Failed to save coupons to storage:", err);
  }
}

export function calculateCouponDiscount(
  coupon: Coupon,
  cartTotal: number
): { valid: boolean; discountAmount: number; finalTotal: number; message: string } {
  if (!coupon.isActive) {
    return { valid: false, discountAmount: 0, finalTotal: cartTotal, message: "This coupon code is currently inactive." };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, discountAmount: 0, finalTotal: cartTotal, message: "This coupon code has expired." };
  }

  if (cartTotal < coupon.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: cartTotal,
      message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString("en-IN")} required for this code.`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
  } else {
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed total
  discountAmount = Math.min(discountAmount, cartTotal);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  return {
    valid: true,
    discountAmount,
    finalTotal,
    message: `Coupon "${coupon.code}" applied! You saved ₹${discountAmount.toLocaleString("en-IN")}.`,
  };
}

export function useCoupons(): {
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  resetCoupons: () => void;
  validateAndApply: (code: string, cartTotal: number) => {
    valid: boolean;
    discountAmount: number;
    finalTotal: number;
    message: string;
    coupon?: Coupon;
  };
} {
  const [coupons, setCoupons] = useState<Coupon[]>(() => getCoupons());

  useEffect(() => {
    setCoupons(getCoupons());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Coupon[]>;
      if (customEvent.detail) {
        setCoupons(customEvent.detail);
      } else {
        setCoupons(getCoupons());
      }
    };

    window.addEventListener(COUPONS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    if (isSupabaseConfigured) {
      supabase
        .from("site_settings")
        .select("settings")
        .eq("id", "coupons_cms")
        .single()
        .then(({ data, error }) => {
          if (!error && Array.isArray(data?.settings) && data.settings.length > 0) {
            setCoupons(data.settings);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.settings));
          }
        })
        .then(() => {}, () => {});
    }

    return () => {
      window.removeEventListener(COUPONS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const addCoupon = (coupon: Coupon) => {
    const formattedCode = coupon.code.trim().toUpperCase();
    const existingIndex = coupons.findIndex((c) => c.code === formattedCode);
    let next: Coupon[];
    if (existingIndex >= 0) {
      next = [...coupons];
      next[existingIndex] = { ...coupon, code: formattedCode };
    } else {
      next = [{ ...coupon, code: formattedCode }, ...coupons];
    }
    setCoupons(next);
    saveCoupons(next);
  };

  const updateCoupon = (code: string, patch: Partial<Coupon>) => {
    const next = coupons.map((c) => (c.code === code ? { ...c, ...patch } : c));
    setCoupons(next);
    saveCoupons(next);
  };

  const deleteCoupon = (code: string) => {
    const next = coupons.filter((c) => c.code !== code);
    setCoupons(next);
    saveCoupons(next);
  };

  const resetCoupons = () => {
    setCoupons(DEFAULT_COUPONS);
    saveCoupons(DEFAULT_COUPONS);
  };

  const validateAndApply = (inputCode: string, cartTotal: number) => {
    const clean = inputCode.trim().toUpperCase();
    const match = coupons.find((c) => c.code === clean);
    if (!match) {
      return {
        valid: false,
        discountAmount: 0,
        finalTotal: cartTotal,
        message: `Coupon code "${inputCode}" is invalid.`,
      };
    }

    const res = calculateCouponDiscount(match, cartTotal);
    return { ...res, coupon: match };
  };

  return {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    resetCoupons,
    validateAndApply,
  };
}
