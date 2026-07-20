import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  IndianRupee,
  Package,
  Save,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { useAuth } from "@/lib/auth";
import { products } from "@/lib/products";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "crafting",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColor: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  crafting: "bg-pink-100 text-pink-700",
  shipped: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-stone-100 text-stone-700",
};

export default function AdminDashboard() {
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const activeView = location.pathname.includes("/products")
    ? "products"
    : location.pathname.includes("/settings")
      ? "settings"
      : "orders";

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      totalRevenue: orders
        .filter((order) => order.payment_status === "paid")
        .reduce((sum, order) => sum + order.amount_total, 0),
      totalOrders: orders.length,
      todayOrders: orders.filter((order) => new Date(order.created_at).toDateString() === today).length,
      pendingOrders: orders.filter((order) => ["pending", "confirmed", "crafting"].includes(order.status)).length,
    };
  }, [orders]);

  const fetchOrders = async () => {
    if (!isSupabaseConfigured || !isAdmin) {
      setFetching(false);
      return;
    }

    setFetching(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setOrders((data ?? []) as DbOrder[]);
      setMessage("");
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!loading) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAdmin]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      setMessage(error.message);
      return;
    }
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  const handleNotesChange = (orderId: string, admin_notes: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, admin_notes } : order)));
  };

  const handleSaveNotes = async (order: DbOrder) => {
    const { error } = await supabase
      .from("orders")
      .update({ admin_notes: order.admin_notes ?? null })
      .eq("id", order.id);

    setMessage(error ? error.message : `Saved notes for ${order.order_number}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 h-12 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h1 className="font-display text-lg text-foreground">Admin Panel</h1>
          </header>

          <main className="flex-1 p-4 md:p-6 space-y-5 max-w-6xl">
            {!isSupabaseConfigured ? (
              <AdminNotice
                title="Supabase key missing"
                body="Add VITE_SUPABASE_PUBLISHABLE_KEY in Vercel and local .env to enable admin data."
              />
            ) : loading || fetching ? (
              <div className="py-16 flex justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : !user ? (
              <AdminNotice
                title="Admin login required"
                body="Sign in with an account listed in the admin_users table."
                actionLabel="Sign In"
                actionTo="/login?redirect=/admin"
              />
            ) : !isAdmin ? (
              <AdminNotice
                title="No admin access"
                body="Your account is not in the admin_users table yet. Add your user id there from Supabase to unlock this panel."
              />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard
                    title="Total Revenue"
                    value={`Rs. ${stats.totalRevenue.toLocaleString("en-IN")}`}
                    icon={IndianRupee}
                    accent="bg-brand-blush"
                  />
                  <StatCard title="Total Orders" value={String(stats.totalOrders)} icon={ShoppingBag} accent="bg-accent" />
                  <StatCard title="Today's Orders" value={String(stats.todayOrders)} icon={CalendarCheck} accent="bg-brand-blush" />
                  <StatCard title="Open Orders" value={String(stats.pendingOrders)} icon={Clock} accent="bg-accent" />
                </div>

                {message && (
                  <div className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground">
                    {message}
                  </div>
                )}

                {activeView === "products" ? (
                  <ProductsAdmin />
                ) : activeView === "settings" ? (
                  <SettingsAdmin />
                ) : (
                  <OrdersAdmin
                    orders={orders}
                    onStatusChange={handleStatusChange}
                    onNotesChange={handleNotesChange}
                    onSaveNotes={handleSaveNotes}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function OrdersAdmin({
  orders,
  onStatusChange,
  onNotesChange,
  onSaveNotes,
}: {
  orders: DbOrder[];
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onNotesChange: (orderId: string, notes: string) => void;
  onSaveNotes: (order: DbOrder) => void;
}) {
  return (
    <section className="bg-card rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl text-foreground">Orders</h2>
        <span className="text-xs text-muted-foreground">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border/60 bg-background p-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-foreground">{order.order_number}</h3>
                    <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">
                      {order.payment_status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {order.customer_name} · {order.phone} · {order.pincode}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="mt-2 text-sm text-foreground">{order.address}</p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <p className="font-display text-xl text-primary font-bold">Rs. {order.amount_total}</p>
                </div>
              </div>

              <div className="mt-4 grid md:grid-cols-[1fr_280px] gap-4">
                <div className="space-y-3">
                  {(order.order_items ?? []).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.product_name} className="w-14 h-14 rounded-xl object-cover" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-body font-semibold text-foreground">
                          {item.product_name} x{item.quantity}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.price_text}</p>
                        {item.custom && <p className="text-xs text-muted-foreground line-clamp-2">Custom: {item.custom}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <textarea
                    value={order.admin_notes ?? ""}
                    onChange={(e) => onNotesChange(order.id, e.target.value)}
                    placeholder="Admin notes..."
                    rows={4}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <Button onClick={() => onSaveNotes(order)} size="sm" className="w-full rounded-xl">
                    <Save size={14} />
                    Save Notes
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ProductsAdmin() {
  return (
    <section className="bg-card rounded-2xl p-4 shadow-sm">
      <h2 className="font-display text-xl text-foreground mb-4">Products</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <article key={product.id} className="rounded-2xl border border-border/60 bg-background overflow-hidden">
            <img src={product.images[0]} alt={product.name} className="w-full aspect-square object-cover" />
            <div className="p-4">
              <p className="font-body text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
              <p className="font-display text-primary font-bold">{product.price}</p>
              <p className="mt-1 text-xs text-muted-foreground capitalize">{product.type}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SettingsAdmin() {
  return (
    <section className="bg-card rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl text-foreground">Admin Settings</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Admin access is controlled in Supabase through the <span className="font-semibold text-foreground">admin_users</span> table.
        Add a signed-in user's id to that table to let them manage orders.
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Product content currently comes from the website code in <span className="font-semibold text-foreground">src/lib/products.ts</span>.
        Orders, customers, payment ids, statuses, and admin notes are stored in Supabase.
      </p>
    </section>
  );
}

function AdminNotice({
  title,
  body,
  actionLabel,
  actionTo,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="max-w-lg bg-card rounded-2xl p-6 shadow-sm border border-border/60 text-center mx-auto mt-10">
      <Package className="w-10 h-10 text-primary mx-auto" />
      <h2 className="mt-4 font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
      {actionLabel && actionTo && (
        <Button asChild className="mt-5 rounded-xl">
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
