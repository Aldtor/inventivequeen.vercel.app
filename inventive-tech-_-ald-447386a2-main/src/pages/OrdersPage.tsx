import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Package, Truck, CheckCircle, ShoppingBag, UserRound, KeyRound, Mail, Phone, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { getAuthRedirectUrl } from "@/lib/auth-redirect";
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
  const { user, profile, loading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountLoading, setAccountLoading] = useState(false);

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

  const handleSendResetLink = async () => {
    if (!user?.email) return;
    setAccountLoading(true);
    setAccountMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: getAuthRedirectUrl("/auth/reset-password"),
    });
    setAccountLoading(false);
    setAccountMessage(error ? error.message : "Password reset link sent to your email.");
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setAccountMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setAccountMessage("Passwords do not match.");
      return;
    }

    setAccountLoading(true);
    setAccountMessage("");
    const { error } = await supabase.auth.updateUser({ password });
    setAccountLoading(false);
    if (error) {
      setAccountMessage(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setAccountMessage("Password changed successfully.");
  };

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
          ) : (
            <div className="space-y-6">
              <AccountCard
                email={user.email ?? profile?.email ?? ""}
                name={profile?.full_name}
                phone={profile?.phone}
                password={password}
                confirmPassword={confirmPassword}
                message={accountMessage}
                loading={accountLoading}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSendResetLink={handleSendResetLink}
                onSubmitPassword={handleChangePassword}
              />

              {orders.length === 0 ? (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

function AccountCard({
  email,
  name,
  phone,
  password,
  confirmPassword,
  message,
  loading,
  onPasswordChange,
  onConfirmPasswordChange,
  onSendResetLink,
  onSubmitPassword,
}: {
  email: string;
  name: string | null | undefined;
  phone: string | null | undefined;
  password: string;
  confirmPassword: string;
  message: string;
  loading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSendResetLink: () => void;
  onSubmitPassword: (event: React.FormEvent) => void;
}) {
  return (
    <section className="bg-card rounded-2xl shadow-luxury-sm border border-border/40 p-5 md:p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-blush/60 flex items-center justify-center flex-shrink-0">
          <UserRound className="w-6 h-6 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-bold text-foreground">Account Details</p>
          <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
        </div>
      </div>

      <div className="mt-5 grid sm:grid-cols-3 gap-3">
        <AccountFact label="Email" value={email} icon={Mail} />
        <AccountFact label="Name" value={name || "Not added"} icon={UserRound} />
        <AccountFact label="Phone" value={phone || "Not added"} icon={Phone} />
      </div>

      <form onSubmit={onSubmitPassword} className="mt-6 rounded-2xl bg-secondary/40 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          <p className="font-body text-sm font-semibold text-foreground">Change Password</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="New password"
            minLength={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="Confirm new password"
            minLength={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        {message && (
          <p className="text-sm text-muted-foreground bg-background rounded-xl px-4 py-3">
            {message}
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <Button disabled={loading} className="rounded-xl">
            {loading ? "Please wait..." : "Save Password"}
          </Button>
          <Button type="button" variant="outline" disabled={loading} onClick={onSendResetLink} className="rounded-xl">
            Get Reset Link
          </Button>
        </div>
      </form>
    </section>
  );
}

function AccountFact({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-xl bg-secondary/40 px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground font-body font-semibold">
        <Icon size={13} className="text-primary" />
        {label}
      </div>
      <p className="mt-1 text-sm text-foreground font-body break-words">{value}</p>
    </div>
  );
}

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
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
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
            {order.payment_id && <span> · {order.payment_id}</span>}
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
