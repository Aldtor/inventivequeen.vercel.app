import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  metaEnv?.["VITE_SUPABASE_URL"] ||
  "";

const supabaseKey =
  (typeof process !== "undefined" &&
    (process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env?.["VITE_SUPABASE_ANON_KEY"])) ||
  metaEnv?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  metaEnv?.["VITE_SUPABASE_ANON_KEY"] ||
  "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.error(
    "[Security Alert] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseKey || "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export type OrderStatus =
  "pending" | "confirmed" | "crafting" | "shipped" | "delivered" | "cancelled";

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price_text: string;
  unit_price: number;
  quantity: number;
  image_url: string | null;
  color: string | null;
  flowers: string[] | null;
  custom: string | null;
}

export interface DbOrder {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  pincode: string;
  gift_note: string | null;
  status: OrderStatus;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_id: string | null;
  amount_total: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: DbOrderItem[];
}
