import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://tbyewrliurrtkqocqumc.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRieWV3cmxpdXJydGtxb2NxdW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NjgxNzMsImV4cCI6MjEwMDE0NDE3M30.Z1FZ_ZP0c-gVHL-XVj7tHaTIkYCHAIGV-_t02uch8V0";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey || "missing-key", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "crafting"
  | "shipped"
  | "delivered"
  | "cancelled";

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
