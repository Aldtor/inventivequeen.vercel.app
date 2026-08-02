import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Package, Truck, CheckCircle, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";

const statusMeta: Record<OrderStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", icon: CheckCircle, className: "bg-sky-100 text-sky-700" },
  crafting: { label: "Crafting", icon: Package, className: "bg-pink-100 text-pink-700" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-violet-100 text-violet-700" },
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-emerald-100 text-emerald-700" },
  cancelled: { label: "Cancelled", icon: Clock, className: "bg-stone-100 text-stone-700" },
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-secondary/30 border-b border-border/40">
          <div className="container py-12 md:py-16 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
              Track Your Handmade Pieces
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground">
              My Orders
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto leading-relaxed">
              See order status, payment details, and the items being crafted for you.
            </p>
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
            <div className="py-16 flex justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : !user ? (
            <EmptyState
              title="Sign in to track orders"
              description="Use the same email you ordered with to see your handmade order history."
              actionLabel="Sign In"
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
              title="No orders yet"
              description="Your placed orders will appear here after checkout."
              actionLabel="Start Shopping"
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
  const meta = statusMeta[order.status];
  const Icon = meta.icon;

  return (
    <article className="bg-card rounded-2xl shadow-luxury-sm border border-border/40 overflow-hidden">
      <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="font-display text-xl font-bold text-foreground">{order.order_number}</p>
          <p className="mt-1 text-xs text-muted-foreground font-body">
            {new Date(order.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-body font-semibold ${meta.className}`}>
          <Icon size={13} />
          {meta.label}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {(order.order_items ?? []).map((item) => (
          <div key={item.id} className="flex gap-3">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.product_name}
                className="w-16 h-16 rounded-xl object-contain bg-white flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-3">
                <p className="font-body text-sm font-semibold text-foreground line-clamp-1">
                  {item.product_name}
                </p>
                <span className="text-xs text-muted-foreground">x{item.quantity}</span>
              </div>
              <p className="font-display text-primary font-bold">{item.price_text}</p>
              {item.custom && (
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  Custom: {item.custom}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-xs text-muted-foreground font-body">
            Payment: <span className="capitalize text-foreground font-medium">{order.payment_status}</span>
            {order.payment_id && <span> - {order.payment_id}</span>}
          </div>
          <p className="font-display text-2xl text-primary font-bold">Rs. {order.amount_total}</p>
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
    <div className="max-w-md mx-auto text-center py-14">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-blush/60 flex items-center justify-center">
        <ShoppingBag className="w-7 h-7 text-primary" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to={actionTo}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

export default OrdersPage;
