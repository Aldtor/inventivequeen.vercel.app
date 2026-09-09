import { createClient } from "@supabase/supabase-js";

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;

const FALLBACK_SUPABASE_URL = "https://fsttdvcntqlhnjdhogic.supabase.co";
const FALLBACK_SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdHRkdmNudHFsaG5qZGhvZ2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMzM3NDEsImV4cCI6MjA4OTgwOTc0MX0.x_TD4obU3gD4gpMUXhvYOxrbkUix_z5LVjt1vQq8tW4";

const supabaseUrl =
  (typeof process !== "undefined" && process.env?.["VITE_SUPABASE_URL"]) ||
  metaEnv?.["VITE_SUPABASE_URL"] ||
  FALLBACK_SUPABASE_URL;

const supabaseKey =
  (typeof process !== "undefined" &&
    (process.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] || process.env?.["VITE_SUPABASE_ANON_KEY"])) ||
  metaEnv?.["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  metaEnv?.["VITE_SUPABASE_ANON_KEY"] ||
  FALLBACK_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
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
