import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Heart,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Truck,
  User as UserIcon,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { getOrderItemImageUrl } from "@/lib/order-utils";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "My Royal Orders & Tracking — Inventive Queen" },
      {
        name: "description",
        content: "Track your handmade crochet doll and flower orders in real-time.",
      },
    ],
  }),
});

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "confirmed", label: "Order Placed", desc: "Payment verified via Razorpay" },
  { status: "crafting", label: "Hand-Crafting", desc: "Crocheting stitch-by-stitch" },
  { status: "shipped", label: "Dispatched", desc: "Packed safely with tracking" },
  { status: "delivered", label: "Delivered", desc: "Arrived at your doorstep" },
];

function getStepIndex(status: OrderStatus): number {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "crafting":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    default:
      return 1;
  }
}

function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, fetchOrders]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/60 pb-6 mb-8">
          <div>
            <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-lilac-deep">
              <Sparkles className="size-3" /> Live Parcel Tracking
            </span>
            <h1 className="sheen-text mt-2 font-display text-3xl sm:text-4xl font-extrabold text-lilac-deep">
              My Royal Orders
            </h1>
          </div>

          {user && (
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="clay inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-lilac-deep hover:bg-white/40 active:scale-95 transition-all"
            >
              <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh Status
            </button>
          )}
        </div>

        {/* Not Logged In State */}
        {!user && !authLoading && (
          <div className="liquid-glass mx-auto max-w-lg rounded-3xl p-8 sm:p-12 text-center my-10 shadow-xl border border-white/60">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm mb-4">
              <Crown className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-lilac-deep">
              Sign In to View Orders
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in with your Inventive Queen royal account to view and track your handmade
              crochet orders.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/login"
                search={{ redirect: "/orders" }}
                className="clay-primary liquid-btn rounded-full px-7 py-3 text-sm font-bold shadow-md"
              >
                Sign In to Account
              </Link>
              <Link
                to="/dolls"
                className="clay rounded-full px-6 py-3 text-sm font-bold text-lilac-deep hover:bg-white/40"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {authLoading || (loading && user) ? (
          <div className="py-20 text-center text-muted-foreground">
            <RefreshCw className="size-8 animate-spin mx-auto text-lilac-deep mb-3" />
            <p className="text-sm font-semibold">Loading your royal orders...</p>
          </div>
        ) : null}

        {/* Empty Orders State */}
        {user && !loading && orders.length === 0 && (
          <div className="liquid-glass mx-auto max-w-lg rounded-3xl p-8 sm:p-12 text-center my-10 shadow-xl border border-white/60">
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-lilac/30 text-lilac-deep mb-4">
              <Package className="size-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-lilac-deep">No Orders Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't placed any orders yet. Explore our amigurumi dolls, cute keychains, and
              everlasting bouquets!
            </p>
            <div className="mt-6">
              <Link
                to="/dolls"
                className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold shadow-md"
              >
                <ShoppingBag className="size-4" /> Start Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Orders List */}
        {user && !loading && orders.length > 0 && (
          <div className="space-y-8">
            {orders.map((order) => {
              const activeIndex = getStepIndex(order.status);
              const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <article
                  key={order.id}
                  className="liquid-glass relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60"
                >
                  {/* Top Bar: Order # + Date + Total */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center font-black">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-semibold">
                          Order Number
                        </span>
                        <h3 className="font-mono text-base font-extrabold text-lilac-deep">
                          {order.order_number}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="font-extrabold text-foreground">
                        Total:{" "}
                        <span className="text-base text-lilac-deep">
                          ₹{order.amount_total?.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Paid (Razorpay)
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Tracking Stepper */}
                  <div className="my-8">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone = activeIndex >= idx + 1;
                        const isCurrent = activeIndex === idx + 1;

                        return (
                          <div
                            key={step.status}
                            className={`rounded-2xl p-3 border transition-all ${
                              isDone
                                ? "bg-white/80 border-emerald-300 shadow-sm"
                                : "bg-white/40 border-white/50 opacity-60"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className={`flex size-6 items-center justify-center rounded-full text-xs font-black ${
                                  isDone
                                    ? "bg-emerald-500 text-white"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {isDone ? "✓" : idx + 1}
                              </span>
                              <span
                                className={`text-xs font-bold ${
                                  isDone ? "text-emerald-800" : "text-muted-foreground"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-tight">
                              {step.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items & Shipping Details */}
                  <div className="grid gap-6 sm:grid-cols-12 border-t border-white/50 pt-5">
                    {/* Items */}
                    <div className="sm:col-span-7 space-y-3">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Handmade Items Ordered ({order.order_items?.length || 1})
                      </h4>
                      <div className="divide-y divide-white/40">
                        {order.order_items?.map((item) => {
                          const itemImage = getOrderItemImageUrl(item);
                          return (
                            <div key={item.id} className="py-2.5 flex items-center gap-3">
                              <div className="size-12 rounded-xl bg-white shadow-xs border border-purple-100/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                                <img
                                  src={itemImage}
                                  alt={item.product_name}
                                  className="size-full rounded-lg object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = logo;
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-display text-sm font-bold text-lilac-deep truncate">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} × ₹{item.unit_price?.toLocaleString("en-IN")}
                                </p>
                              </div>
                              <span className="text-xs font-black text-foreground">
                                ₹{(item.unit_price * item.quantity).toLocaleString("en-IN")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="sm:col-span-5 rounded-2xl bg-white/60 p-4 border border-white/70 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-lilac-deep">
                        <MapPin className="size-3.5" /> Shipping Address
                      </div>
                      <p className="font-bold text-foreground">{order.customer_name}</p>
                      <p className="text-muted-foreground leading-relaxed">{order.address}</p>
                      <p className="font-semibold text-muted-foreground">
                        Pincode: {order.pincode}
                      </p>
                      <p className="font-semibold text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="size-3" /> +91 {order.phone}
                      </p>

                      {order.gift_note && (
                        <div className="mt-3 pt-2.5 border-t border-white/60">
                          <span className="font-bold text-foreground">👑 Wax-Sealed Note:</span>
                          <p className="italic text-muted-foreground mt-0.5">"{order.gift_note}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
