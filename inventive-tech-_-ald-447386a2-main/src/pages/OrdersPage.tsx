import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Package, Truck, CheckCircle, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { FadeIn } from "@/components/motion/FadeIn";

const statusMeta: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Order Placed", icon: Clock, className: "bg-amber-500/10 border-amber-500/20 text-amber-700" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-sky-500/10 border-sky-500/20 text-sky-700" },
  crafting: { label: "In Hand-Crafting", icon: Package, className: "bg-purple-500/10 border-purple-500/20 text-purple-700" },
  shipped: { label: "Dispatched", icon: Truck, className: "bg-indigo-500/10 border-indigo-500/20 text-indigo-700" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700" },
  cancelled: { label: "Cancelled", icon: Clock, className: "bg-neutral-500/10 border-neutral-500/20 text-neutral-700" },
};

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!isSupabaseConfigured || !user) {
      setFetching(false);
      return;
    }

    let active = true;

    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (!active) return;
        setOrders((data ?? []) as DbOrder[]);
        setError(queryError?.message ?? "");
        setFetching(false);
      });

    return () => {
      active = false;
    };
  }, [loading, user]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        <section className="bg-fairytale-mesh border-b border-border/40 py-12 md:py-16 text-center relative overflow-hidden">
          <div className="container relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card shadow-luxury-sm text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-3">
                <span>👑</span> Royal Tracking & History
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                My Commissions & Orders
              </h1>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto text-sm md:text-base leading-relaxed">
                Track crafting progress, delivery timelines & view all past handmade treasures.
              </p>
            </FadeIn>
          </div>
        </section>

        <div className="container py-10 md:py-14 max-w-4xl">
          {!isSupabaseConfigured ? (
            <EmptyState
              title="Supabase is not configured"
              description="Add your Supabase publishable key to enable login and order tracking."
              actionLabel="Back to Shop"
              actionTo="/"
            />
          ) : loading || fetching ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : !user ? (
            <EmptyState
              title="Sign in to track orders"
              description="Use the same email you ordered with to view your bespoke crafting status."
              actionLabel="Sign In to Atelier"
              actionTo="/login?redirect=/orders"
            />
          ) : error ? (
            <EmptyState
              title="Could not load orders"
              description={error}
              actionLabel="Try Again"
              actionTo="/orders"
            />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No Commissions Yet"
              description="Your orders will appear here as soon as you place your first bespoke creation."
              actionLabel="Explore Collections ✨"
              actionTo="/"
            />
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function OrderCard({ order }: { order: DbOrder }) {
  const meta = statusMeta[order.status] ?? statusMeta.pending;
  const Icon = meta.icon;

  return (
    <article className="glass-card rounded-3xl shadow-luxury-sm hover:shadow-luxury border border-border/50 overflow-hidden transition-all duration-300">
      <div className="p-5 sm:p-6 border-b border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-secondary/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-foreground">{order.order_number}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              👑 Royal Order
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground font-body">
            Placed on {new Date(order.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold border ${meta.className} w-fit`}>
          <Icon size={13} />
          {meta.label}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {(order.order_items ?? []).map((item) => (
          <div key={item.id} className="flex gap-4 items-center">
            {item.image_url && (
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 p-1.5 flex items-center justify-center border border-border/40 shadow-sm flex-shrink-0">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3">
                <p className="font-body text-sm font-bold text-foreground line-clamp-1">
                  {item.product_name}
                </p>
                <span className="text-xs text-muted-foreground font-semibold">Qty: {item.quantity}</span>
              </div>
              <p className="font-display text-primary font-bold text-sm mt-0.5">{item.price_text}</p>
              {item.custom && (
                <p className="mt-1 text-xs text-muted-foreground bg-secondary/40 px-2.5 py-1 rounded-lg w-fit line-clamp-1 border border-border/30">
                  Custom: {item.custom}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground font-body flex items-center gap-2">
            <span>Payment:</span>
            <span className="capitalize font-bold text-foreground px-2 py-0.5 rounded-md bg-secondary/60">
              {order.payment_status}
            </span>
            {order.payment_id && <span className="text-[11px] opacity-70">({order.payment_id.slice(0, 14)}...)</span>}
          </div>
          <div className="flex items-baseline gap-1.5 sm:text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total:</span>
            <span className="font-display text-2xl text-gradient-royal font-extrabold">Rs. {order.amount_total}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
}) {
  return (
    <div className="max-w-md mx-auto text-center py-16 px-6 glass-card rounded-3xl shadow-luxury border border-border/50">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        <ShoppingBag size={28} />
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="mt-6">
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-gradient text-white text-xs font-bold shadow-royal-glow"
        >
          <Sparkles size={14} className="text-amber-200" />
          <span>{actionLabel}</span>
        </Link>
      </div>
    </div>
  );
}

export default OrdersPage;
