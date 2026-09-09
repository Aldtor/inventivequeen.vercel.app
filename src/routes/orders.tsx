import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
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
  Trash2,
  Truck,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useAuth } from "@/lib/auth";
import { supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { getOrderItemImageUrl } from "@/lib/order-utils";
import { addToCart } from "@/lib/cart";
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

function checkIsPaid(order: DbOrder): boolean {
  return (
    order.payment_status === "paid" ||
    ["confirmed", "crafting", "shipped", "delivered"].includes(order.status) ||
    Boolean(order.payment_id && order.status !== "cancelled" && order.payment_status !== "failed")
  );
}

function checkIsCancelled(order: DbOrder): boolean {
  return order.status === "cancelled" || order.payment_status === "failed";
}

function OrdersPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "cancelled">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

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
      const orderList = data || [];

      // Auto-heal in background: if any order is confirmed/crafting/shipped/delivered but payment_status !== paid
      for (const ord of orderList) {
        if (
          ord.payment_status !== "paid" &&
          (ord.status === "confirmed" || ord.status === "crafting" || ord.payment_id)
        ) {
          supabase
            .rpc("confirm_order_payment", {
              p_order_id: ord.id,
              p_payment_id: ord.payment_id || "captured",
              p_user_id: user.id,
            })
            .then(({ data: ok }) => {
              if (ok) {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === ord.id ? { ...o, payment_status: "paid", status: "confirmed" } : o,
                  ),
                );
              }
            });
        }
      }

      setOrders(orderList);
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

  const activeOrders = useMemo(
    () => orders.filter((o) => checkIsPaid(o) && !checkIsCancelled(o)),
    [orders],
  );

  const cancelledOrders = useMemo(
    () => orders.filter((o) => checkIsCancelled(o) || (!checkIsPaid(o) && o.status === "pending")),
    [orders],
  );

  const displayedOrders = useMemo(() => {
    if (filterTab === "active") return activeOrders;
    if (filterTab === "cancelled") return cancelledOrders;
    return orders;
  }, [filterTab, orders, activeOrders, cancelledOrders]);

  const handleDeleteOrder = async (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (checkIsPaid(targetOrder) && !checkIsCancelled(targetOrder)) {
      alert("Confirmed active orders cannot be removed from history.");
      return;
    }

    if (!window.confirm("Remove this order from your history?")) {
      return;
    }
    setDeletingId(orderId);
    try {
      await supabase.from("order_items").delete().eq("order_id", orderId);
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Failed to remove order:", err);
      alert("Could not remove order. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetryOrder = (order: DbOrder) => {
    if (order.order_items && order.order_items.length > 0) {
      order.order_items.forEach((item) => {
        addToCart(
          {
            id: item.product_id,
            name: item.product_name,
            price: item.price_text || `₹${item.unit_price}`,
            numericPrice: item.unit_price,
            image: item.image_url || logo,
          },
          item.quantity || 1,
        );
      });
    }
    navigate({ to: "/checkout" });
  };

  const handleConfirmPendingPayment = async (order: DbOrder) => {
    if (!user) return;
    setVerifyingId(order.id);
    try {
      let paymentId = order.payment_id || "captured";
      try {
        const stored = sessionStorage.getItem(`iq_paid_order_${order.id}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.paymentId) paymentId = parsed.paymentId;
        }
      } catch {
        // Ignore sessionStorage error
      }

      const { data: rpcOk, error: rpcErr } = await supabase.rpc("confirm_order_payment", {
        p_order_id: order.id,
        p_payment_id: paymentId,
        p_user_id: user.id,
      });

      if (rpcErr || !rpcOk) {
        // Fallback: update directly
        const { error: directErr } = await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            payment_id: paymentId,
          })
          .eq("id", order.id);

        if (directErr) {
          console.warn("Direct update error:", directErr);
          alert(
            `Payment could not be verified automatically. If amount was deducted, please share order #${order.order_number} with support.`,
          );
          return;
        }
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id
            ? { ...o, payment_status: "paid", status: "confirmed", payment_id: paymentId }
            : o,
        ),
      );
      alert("Payment verified successfully! Your order is now active and confirmed.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      alert("Verification error: " + msg);
    } finally {
      setVerifyingId(null);
    }
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

        {/* Filter Tabs */}
        {user && !loading && orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-1.5 rounded-2xl bg-white/40 border border-white/60 w-fit">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === "all"
                  ? "bg-lilac-deep text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setFilterTab("active")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === "active"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({activeOrders.length})
            </button>
            {cancelledOrders.length > 0 && (
              <button
                onClick={() => setFilterTab("cancelled")}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === "cancelled"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Incomplete / Cancelled ({cancelledOrders.length})
              </button>
            )}
          </div>
        )}

        {/* Orders List */}
        {user && !loading && displayedOrders.length > 0 && (
          <div className="space-y-8">
            {displayedOrders.map((order) => {
              const activeIndex = getStepIndex(order.status);
              const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const isPaid = checkIsPaid(order) && !checkIsCancelled(order);
              const isCancelled = checkIsCancelled(order);

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
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <Check className="size-3" /> Paid (Razorpay)
                        </span>
                      ) : isCancelled ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                          <XCircle className="size-3" /> Cancelled / Unpaid
                        </span>
                      ) : order.payment_status === "refunded" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">
                          Refunded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                          <Clock className="size-3" /> Payment Incomplete
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Display: Stepper for Paid vs Differentiated Cards for Cancelled / Incomplete */}
                  {isPaid ? (
                    /* 4-Step Tracking Stepper for Verified Paid Orders */
                    <div className="my-8">
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {STATUS_STEPS.map((step, idx) => {
                          const isDone = activeIndex >= idx + 1;

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
                                  {isDone ? <Check className="size-3.5" /> : idx + 1}
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
                  ) : isCancelled ? (
                    /* Explicitly Cancelled Order Card */
                    <div className="my-6 rounded-2xl bg-rose-50/75 border border-rose-200 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="size-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                            <XCircle className="size-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-rose-950">
                              Order Cancelled / Payment Not Finalized
                            </h4>
                            <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                              This checkout was closed or cancelled before payment completion. If amount
                              was debited by your bank, Razorpay will automatically reverse it within
                              3–5 business days.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleRetryOrder(order)}
                            className="clay-primary liquid-btn inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm hover:scale-102 transition-transform"
                          >
                            <RefreshCw className="size-3.5" /> Re-order / Retry
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingId === order.id}
                            className="clay inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-50"
                            title="Remove this cancelled order from your list"
                          >
                            <Trash2 className="size-3.5" />
                            {deletingId === order.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Incomplete / Pending Verification Order Card */
                    <div className="my-6 rounded-2xl bg-amber-50/75 border border-amber-200 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="size-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock className="size-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-amber-950">
                              Payment Incomplete / Pending Verification
                            </h4>
                            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                              This order was created but payment confirmation is pending. If you
                              already completed payment via UPI/Card, click "Verify Payment" to
                              instantly activate your order.
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleConfirmPendingPayment(order)}
                            disabled={verifyingId === order.id}
                            className="clay-primary liquid-btn inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-sm hover:scale-102 transition-transform disabled:opacity-50"
                          >
                            <CheckCircle2
                              className={`size-3.5 ${verifyingId === order.id ? "animate-spin" : ""}`}
                            />
                            {verifyingId === order.id ? "Verifying..." : "Verify Payment"}
                          </button>
                          <button
                            onClick={() => handleRetryOrder(order)}
                            className="clay inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-lilac-deep bg-white/70 border border-white hover:bg-white active:scale-95 transition-all"
                          >
                            <RefreshCw className="size-3.5" /> Re-order
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingId === order.id}
                            className="clay inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 active:scale-95 transition-all disabled:opacity-50"
                            title="Remove this incomplete order from your list"
                          >
                            <Trash2 className="size-3.5" />
                            {deletingId === order.id ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

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
                              <Link
                                to="/product/$productId"
                                params={{
                                  productId: item.product_name
                                    .toLowerCase()
                                    .replace(/[^\w\s-]/g, "")
                                    .trim()
                                    .replace(/\s+/g, "-"),
                                }}
                                className="size-12 rounded-xl bg-white shadow-xs border border-purple-100/80 overflow-hidden shrink-0 flex items-center justify-center p-0.5 hover:opacity-80 transition-opacity"
                              >
                                <img
                                  src={itemImage}
                                  alt={item.product_name}
                                  className="size-full rounded-lg object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = logo;
                                  }}
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link
                                  to="/product/$productId"
                                  params={{
                                    productId: item.product_name
                                      .toLowerCase()
                                      .replace(/[^\w\s-]/g, "")
                                      .trim()
                                      .replace(/\s+/g, "-"),
                                  }}
                                  className="font-display text-sm font-bold text-lilac-deep hover:text-primary transition-colors truncate block"
                                >
                                  {item.product_name}
                                </Link>
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
                          <span className="font-bold text-foreground inline-flex items-center gap-1">
                            <Crown className="size-3.5 text-amber-600" />
                            <span>Wax-Sealed Note:</span>
                          </span>
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
