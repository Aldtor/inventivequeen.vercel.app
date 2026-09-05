import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  Crown,
  Heart,
  Package,
  Sparkles,
  Truck,
  ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase, type DbOrder } from "@/lib/supabase";

export const Route = createFileRoute("/success")({
  component: SuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) || "",
    orderNumber: (search.orderNumber as string) || "",
  }),
  head: () => ({
    meta: [
      { title: "Order Placed! — Inventive Queen" },
      { name: "description", content: "Your handmade crochet order has been placed successfully." },
    ],
  }),
});

function SuccessPage() {
  const search = useSearch({ from: "/success" });
  const { orderId, orderNumber } = search;

  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", orderId)
          .maybeSingle();

        if (error) throw error;
        setOrder(data);
      } catch (e) {
        console.error("Could not fetch order confirmation:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center">
        <div className="liquid-glass relative overflow-hidden rounded-4xl p-8 sm:p-12 shadow-2xl border border-white/60">
          <div className="blob absolute -top-16 -right-16 size-48 bg-emerald-300/40 pointer-events-none" />
          <div className="blob absolute -bottom-16 -left-16 size-48 bg-primary/30 pointer-events-none" />

          {/* Success Icon */}
          <div className="relative inline-flex size-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-white shadow-lg mb-6">
            <CheckCircle className="size-10 text-emerald-950" />
          </div>

          <span className="liquid-glass relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-700 mb-3">
            <Sparkles className="size-3" /> Payment Verified via Razorpay
          </span>

          <h1 className="sheen-text relative font-display text-3xl sm:text-4xl font-extrabold text-lilac-deep">
            Order Placed Successfully!
          </h1>
          <p className="relative mt-2 text-sm text-muted-foreground">
            Thank you for shopping with Inventive Queen. Your order is confirmed and has entered our hand-crafting schedule.
          </p>

          {/* Order Reference Box */}
          <div className="relative mt-8 rounded-2xl bg-white/70 p-5 border border-white/80 shadow-sm text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/60">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Order Number
              </span>
              <span className="font-mono text-sm font-black text-lilac-deep">
                {orderNumber || order?.order_number || "IQ-CONFIRMED"}
              </span>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-muted-foreground">Payment Status:</span>
                <p className="font-bold text-emerald-600 mt-0.5">Paid (Razorpay)</p>
              </div>
              <div>
                <span className="text-muted-foreground">Crafting Time:</span>
                <p className="font-bold text-foreground mt-0.5">1–2 Weeks Handcrafted</p>
              </div>
            </div>

            {order?.address && (
              <div className="mt-3 pt-3 border-t border-white/60 text-xs">
                <span className="text-muted-foreground">Delivering To:</span>
                <p className="font-bold text-foreground mt-0.5">{order.customer_name} · {order.address}, {order.pincode}</p>
              </div>
            )}
          </div>

          {/* Tracking steps preview */}
          <div className="relative mt-8 grid grid-cols-4 gap-2 text-center">
            <div className="p-2">
              <div className="size-8 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                ✓
              </div>
              <p className="text-[11px] font-bold text-lilac-deep">Placed</p>
            </div>
            <div className="p-2">
              <div className="size-8 mx-auto rounded-full bg-lilac-deep text-white flex items-center justify-center text-xs font-bold mb-1 shadow-sm">
                2
              </div>
              <p className="text-[11px] font-bold text-lilac-deep">Crafting</p>
            </div>
            <div className="p-2 opacity-60">
              <div className="size-8 mx-auto rounded-full bg-white/70 text-muted-foreground flex items-center justify-center text-xs font-bold mb-1">
                3
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground">Dispatched</p>
            </div>
            <div className="p-2 opacity-60">
              <div className="size-8 mx-auto rounded-full bg-white/70 text-muted-foreground flex items-center justify-center text-xs font-bold mb-1">
                4
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground">Delivered</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/orders"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold shadow-xl hover:scale-102 transition-transform"
            >
              <Truck className="size-4" /> Track Order in My Orders <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to="/dolls"
              className="clay inline-flex items-center rounded-full px-6 py-3.5 text-sm font-bold text-lilac-deep hover:bg-white/40"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
