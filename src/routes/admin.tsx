import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgePercent,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  EyeOff,
  ImagePlus,
  IndianRupee,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Unlock,
  Upload,
  User as UserIcon,
  X,
} from "lucide-react";
import { AdminSidebar, type AdminTab } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { useAuth } from "@/lib/auth";
import { useProducts } from "@/lib/cms-products";
import { categories, type Product, type ProductType } from "@/lib/products";
import { calculateDiscountPercent, formatPrice, parsePriceValue } from "@/lib/product-display";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: ((search.tab as string) || "overview") as AdminTab,
  }),
  head: () => ({
    meta: [
      { title: "Admin Panel & CMS — Inventive Queen" },
      { name: "description", content: "Manage orders, products, pricing, and website content." },
    ],
  }),
});

const ALL_STATUSES: { status: OrderStatus; label: string; color: string }[] = [
  { status: "pending", label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { status: "confirmed", label: "Confirmed", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { status: "crafting", label: "Crafting", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { status: "shipped", label: "Shipped", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { status: "delivered", label: "Delivered", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { status: "cancelled", label: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

interface ProductDraft {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  sellingPrice: string;
  discountPercent: string;
  type: ProductType;
  size: string;
  tagline: string;
  description: string;
  imagesText: string;
  badge: string;
  isNewArrival: boolean;
  newArrivalDays: string;
  isActive: boolean;
  sortOrder: number;
  isCmsProduct: boolean;
  isNew?: boolean;
  isIdLocked: boolean;
}

function toDraft(product: Product): ProductDraft {
  const sellingPrice = product.sellingPrice || product.price;
  const calculatedDiscount = product.originalPrice
    ? calculateDiscountPercent(product.originalPrice, sellingPrice)
    : 0;

  return {
    id: product.id,
    name: product.name,
    price: sellingPrice,
    originalPrice: product.originalPrice ?? "",
    sellingPrice,
    discountPercent: product.discountPercent ? String(product.discountPercent) : calculatedDiscount > 0 ? String(calculatedDiscount) : "",
    type: product.type || "doll",
    size: product.size || "",
    tagline: product.tagline || "",
    description: product.description || "",
    imagesText: (product.images || []).slice(0, 10).join("\n"),
    badge: product.badge || "",
    isNewArrival: Boolean(product.isNewArrival),
    newArrivalDays: String(product.newArrivalDays ?? 30),
    isActive: product.isActive !== false,
    sortOrder: product.sortOrder ?? 0,
    isCmsProduct: Boolean(product.isCmsProduct),
    isIdLocked: true,
  };
}

function draftToProduct(draft: ProductDraft): Product {
  const sellingPrice = draft.sellingPrice.trim() || draft.price.trim();
  const originalPrice = draft.originalPrice.trim();
  const discountPercent = Number(draft.discountPercent);
  const images = draft.imagesText
    .split(/\r?\n/)
    .map((img) => img.trim())
    .filter(Boolean);

  return {
    id: draft.id.trim(),
    name: draft.name.trim(),
    price: sellingPrice,
    originalPrice: originalPrice || undefined,
    sellingPrice,
    discountPercent: Number.isFinite(discountPercent) && discountPercent > 0 ? discountPercent : undefined,
    type: draft.type,
    size: draft.size.trim() || undefined,
    tagline: draft.tagline.trim(),
    description: draft.description.trim(),
    images,
    badge: draft.badge.trim() || undefined,
    isNewArrival: draft.isNewArrival,
    newArrivalDays: Number(draft.newArrivalDays) || 30,
    isActive: draft.isActive,
    sortOrder: Number(draft.sortOrder) || 0,
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin" });
  const activeTab: AdminTab = (search.tab as AdminTab) || "overview";

  const { user, isAdmin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const setTab = (tab: AdminTab) => {
    navigate({
      to: "/admin",
      search: { tab },
    });
  };

  const fetchOrders = async () => {
    if (!isSupabaseConfigured) {
      setOrdersLoading(false);
      return;
    }

    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error("Failed to load orders for admin:", err);
      setNotice(err?.message || "Failed to load orders");
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [authLoading, user]);

  // Statistics calculation
  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.payment_status === "paid");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount_total || 0), 0);
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);
    const openOrders = orders.filter((o) => ["pending", "confirmed", "crafting"].includes(o.status));

    return {
      totalRevenue,
      totalOrders: orders.length,
      todayOrdersCount: todayOrders.length,
      openOrdersCount: openOrders.length,
      paidOrdersCount: paidOrders.length,
    };
  }, [orders]);

  // Live order status update
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      setNotice(`Order status updated to ${newStatus}. Customer tracking reflects this immediately.`);
      setTimeout(() => setNotice(null), 4000);
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  // Order notes update
  const handleOrderNotesSave = async (orderId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ admin_notes: notes })
        .eq("id", orderId);

      if (error) throw error;

      setNotice("Admin internal notes saved successfully.");
      setTimeout(() => setNotice(null), 3000);
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-foreground">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-white/70 backdrop-blur-md px-6 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-lilac-deep text-white text-xs font-black shadow-sm">
              👑
            </span>
            <div>
              <h1 className="font-display text-base font-extrabold text-lilac-deep leading-tight">
                Royal Atelier Administration
              </h1>
              <p className="text-[11px] text-muted-foreground">
                Inventive Queen Store &amp; Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-lilac-deep">
                <UserIcon className="size-3" /> {user.email}
              </span>
            ) : null}
            <Link
              to="/"
              className="clay rounded-full px-3.5 py-1.5 text-xs font-bold text-lilac-deep hover:bg-white/60"
            >
              Back to Store
            </Link>
          </div>
        </header>

        {/* Alerts Banner */}
        {notice && (
          <div className="mx-6 mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-800 font-semibold flex items-center justify-between shadow-sm">
            <span>👑 {notice}</span>
            <button onClick={() => setNotice(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="size-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-6 max-w-6xl space-y-6">
          {/* Auth Check */}
          {authLoading ? (
            <div className="py-24 text-center">
              <RefreshCw className="size-8 animate-spin mx-auto text-lilac-deep mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">Verifying royal permissions...</p>
            </div>
          ) : !user ? (
            <div className="liquid-glass mx-auto max-w-md rounded-3xl p-8 text-center my-12 shadow-xl border border-white/60">
              <div className="size-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Lock className="size-7" />
              </div>
              <h2 className="font-display text-xl font-bold text-lilac-deep">Admin Sign In Required</h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                You must be signed in with an authorized account to access the Inventive Queen CMS and manage orders &amp; products.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  search={{ redirect: "/admin" }}
                  className="clay-primary liquid-btn inline-flex rounded-full px-6 py-2.5 text-xs font-bold shadow-md"
                >
                  Sign In to Admin Portal
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ─────── TAB 1: OVERVIEW ─────── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Total Revenue"
                      value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                      icon={IndianRupee}
                      accent="bg-emerald-100 text-emerald-800"
                      subtitle={`${stats.paidOrdersCount} orders paid via Razorpay`}
                    />
                    <StatCard
                      title="Total Orders"
                      value={String(stats.totalOrders)}
                      icon={ShoppingBag}
                      accent="bg-purple-100 text-purple-800"
                      subtitle="All-time placed orders"
                    />
                    <StatCard
                      title="Open / In-Crafting"
                      value={String(stats.openOrdersCount)}
                      icon={Clock}
                      accent="bg-amber-100 text-amber-800"
                      subtitle="Orders needing attention"
                    />
                    <StatCard
                      title="Today's Orders"
                      value={String(stats.todayOrdersCount)}
                      icon={CalendarCheck}
                      accent="bg-sky-100 text-sky-800"
                      subtitle="Orders received today"
                    />
                  </div>

                  {/* Quick Action Banner */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-lilac-deep">
                        Website CMS &amp; Live Catalogue
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Update products, change pricing, add seasonal items, and process incoming customer orders.
                      </p>
                    </div>
                    <div className="flex gap-2.5 flex-shrink-0">
                      <button
                        onClick={() => setTab("orders")}
                        className="clay-primary liquid-btn rounded-full px-5 py-2.5 text-xs font-bold shadow-md"
                      >
                        Manage Orders ({orders.length})
                      </button>
                      <button
                        onClick={() => setTab("products")}
                        className="clay rounded-full px-5 py-2.5 text-xs font-bold text-lilac-deep hover:bg-white/60"
                      >
                        Edit Products CMS
                      </button>
                    </div>
                  </div>

                  {/* Recent Orders Preview */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/60">
                    <div className="flex items-center justify-between pb-4 border-b border-white/50 mb-4">
                      <h3 className="font-display text-base font-bold text-lilac-deep">
                        Recent Incoming Orders
                      </h3>
                      <button
                        onClick={() => setTab("orders")}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        View all orders →
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No orders yet.</p>
                    ) : (
                      <div className="divide-y divide-white/40">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                            <div>
                              <span className="font-mono font-bold text-lilac-deep">{order.order_number}</span>
                              <p className="text-muted-foreground mt-0.5">
                                {order.customer_name} · +91 {order.phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-foreground">
                                ₹{order.amount_total?.toLocaleString("en-IN")}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                ALL_STATUSES.find((s) => s.status === order.status)?.color || "bg-gray-100"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ─────── TAB 2: ORDERS CMS ─────── */}
              {activeTab === "orders" && (
                <OrdersAdminSection
                  orders={orders}
                  loading={ordersLoading}
                  onStatusChange={handleOrderStatusChange}
                  onSaveNotes={handleOrderNotesSave}
                />
              )}

              {/* ─────── TAB 3: PRODUCTS CMS ─────── */}
              {activeTab === "products" && <ProductsAdminSection />}

              {/* ─────── TAB 4: SETTINGS ─────── */}
              {activeTab === "settings" && <SettingsAdminSection userEmail={user.email} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORDERS CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function OrdersAdminSection({
  orders,
  loading,
  onStatusChange,
  onSaveNotes,
}: {
  orders: DbOrder[];
  loading: boolean;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onSaveNotes: (orderId: string, notes: string) => void;
}) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notesState, setNotesState] = useState<Record<string, string>>({});

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const matchesSearch =
        !searchQuery ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">Orders Management</h2>
          <p className="text-xs text-muted-foreground">
            Update order statuses live. Status updates immediately reflect on customer tracking pages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by order #, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/80 bg-white/80 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="crafting">In Hand-Crafting</option>
            <option value="shipped">Dispatched / Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="size-6 animate-spin mx-auto text-lilac-deep mb-2" />
          <p className="text-xs text-muted-foreground">Loading orders from Supabase...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-8 text-center text-muted-foreground text-xs">
          No orders match the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentNotes = notesState[order.id] ?? order.admin_notes ?? "";

            return (
              <div
                key={order.id}
                className="liquid-glass rounded-3xl p-5 border border-white/60 shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-lilac-deep">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      Paid · Razorpay ({order.payment_id || "Verified"})
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className="rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-extrabold text-lilac-deep shadow-sm outline-none focus:ring-2 focus:ring-lilac-deep/30"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s.status} value={s.status}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Details Grid: Customer Info + Items */}
                <div className="grid gap-5 md:grid-cols-12 text-xs">
                  {/* Customer Delivery Info */}
                  <div className="md:col-span-4 rounded-2xl bg-white/60 p-3.5 border border-white/70 space-y-1.5">
                    <p className="font-bold text-foreground">{order.customer_name}</p>
                    <p className="text-muted-foreground">Phone: +91 {order.phone}</p>
                    <p className="text-muted-foreground leading-relaxed">{order.address}</p>
                    <p className="font-bold text-foreground">Pincode: {order.pincode}</p>
                    {order.gift_note && (
                      <div className="mt-2 pt-2 border-t border-white/60 text-[11px]">
                        <span className="font-bold text-lilac-deep">👑 Wax-Sealed Note:</span>
                        <p className="italic text-muted-foreground mt-0.5">"{order.gift_note}"</p>
                      </div>
                    )}
                  </div>

                  {/* Ordered Items */}
                  <div className="md:col-span-4 space-y-2">
                    <p className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">
                      Ordered Items ({order.order_items?.length || 1})
                    </p>
                    <div className="divide-y divide-white/40 max-h-36 overflow-y-auto pr-1">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="py-1.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="size-8 rounded-md object-cover flex-shrink-0" />
                            ) : (
                              <div className="size-8 rounded-md bg-lilac/30 flex items-center justify-center flex-shrink-0">
                                <Package className="size-3.5 text-lilac-deep" />
                              </div>
                            )}
                            <span className="truncate font-semibold text-foreground">{item.product_name}</span>
                          </div>
                          <span className="font-bold text-muted-foreground whitespace-nowrap">
                            {item.quantity} × ₹{item.unit_price}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/50 text-right font-black text-sm text-lilac-deep">
                      Total: ₹{order.amount_total?.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Admin Internal Notes */}
                  <div className="md:col-span-4 rounded-2xl bg-white/60 p-3.5 border border-white/70 flex flex-col justify-between">
                    <div>
                      <label className="block font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-1">
                        Admin Internal Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Internal notes (yarn colors, courier tracking #, etc.)..."
                        value={currentNotes}
                        onChange={(e) =>
                          setNotesState((prev) => ({ ...prev, [order.id]: e.target.value }))
                        }
                        className="w-full rounded-xl border border-white/80 bg-white/80 p-2 text-xs outline-none focus:border-lilac-deep"
                      />
                    </div>
                    <div className="text-right mt-2">
                      <button
                        onClick={() => onSaveNotes(order.id, currentNotes)}
                        className="clay rounded-full px-3.5 py-1 text-[11px] font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1"
                      >
                        <Save className="size-3" /> Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCTS CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function ProductsAdminSection() {
  const {
    adminProducts,
    loading,
    error,
    refreshProducts,
    saveProduct,
    deleteProduct,
    uploadProductImage,
    generateProductId,
  } = useProducts();

  const [drafts, setDrafts] = useState<ProductDraft[]>([]);
  const [savingId, setSavingId] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(adminProducts.map(toDraft));
  }, [adminProducts]);

  const updateDraft = (id: string, patch: Partial<ProductDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const handlePricingChange = (
    id: string,
    field: "originalPrice" | "sellingPrice" | "discountPercent",
    val: string
  ) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const next = { ...d, [field]: val };
        const orig = parsePriceValue(next.originalPrice);
        const sell = parsePriceValue(next.sellingPrice);

        if (field === "discountPercent") {
          const pct = Math.max(0, Math.min(99, Number(val) || 0));
          next.discountPercent = pct > 0 ? String(pct) : "";
          if (orig > 0 && pct > 0) {
            next.sellingPrice = formatPrice(Math.max(1, Math.round(orig - (orig * pct) / 100)));
          }
        } else {
          const calc = calculateDiscountPercent(next.originalPrice, next.sellingPrice);
          next.discountPercent = calc > 0 ? String(calc) : "";
        }

        next.price = next.sellingPrice || (sell > 0 ? formatPrice(sell) : d.price);
        return next;
      })
    );
  };

  const handleAddNewProduct = async () => {
    setSavingId("new");
    try {
      const newId = await generateProductId("doll");
      const newDraft: ProductDraft = {
        id: newId,
        name: "New Crochet Design",
        price: "₹1,200",
        originalPrice: "",
        sellingPrice: "₹1,200",
        discountPercent: "",
        type: "doll",
        size: "Regular",
        tagline: "Handmade crochet amigurumi",
        description: "Add details about materials, yarn type, and customization options here.",
        imagesText: "",
        badge: "✨ New",
        isNewArrival: true,
        newArrivalDays: "30",
        isActive: true,
        sortOrder: 1,
        isCmsProduct: false,
        isNew: true,
        isIdLocked: true,
      };
      setDrafts((prev) => [newDraft, ...prev]);
      setStatusMsg("New draft created! Fill in the details and click Save.");
    } catch (err: any) {
      alert("Error generating ID: " + err.message);
    } finally {
      setSavingId("");
    }
  };

  const handleSaveProduct = async (draft: ProductDraft) => {
    const product = draftToProduct(draft);
    if (!product.id || !product.name || !product.price) {
      alert("Please ensure product ID, Name, and Selling Price are provided.");
      return;
    }

    setSavingId(draft.id);
    try {
      await saveProduct(product);
      setStatusMsg(`Successfully saved "${product.name}" to CMS!`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setSavingId("");
    }
  };

  const handleDeleteProduct = async (draft: ProductDraft) => {
    if (draft.isNew) {
      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      return;
    }

    if (!confirm(`Are you sure you want to delete or revert CMS customizations for "${draft.name}"?`)) {
      return;
    }

    setSavingId(draft.id);
    try {
      await deleteProduct(draft.id);
      setStatusMsg(`Removed CMS entry for ${draft.name}.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    } finally {
      setSavingId("");
    }
  };

  const handleFileUpload = async (draft: ProductDraft, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSavingId(draft.id);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(draft.id, file);
        uploadedUrls.push(url);
      }
      const existing = draft.imagesText.split(/\r?\n/).filter(Boolean);
      updateDraft(draft.id, {
        imagesText: [...existing, ...uploadedUrls].join("\n"),
      });
      setStatusMsg("Images uploaded! Remember to click 'Save Product' to commit.");
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      alert("Image upload failed: " + err.message);
    } finally {
      setSavingId("");
    }
  };

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      const matchesCat = categoryFilter === "all" || d.type === categoryFilter;
      const matchesSearch =
        !searchTerm ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [drafts, categoryFilter, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Top action header */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">Products CMS</h2>
          <p className="text-xs text-muted-foreground">
            Edit product names, pricing, discounts, descriptions, photos, or add brand new creations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-white/80 bg-white/80 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
          >
            <option value="all">All Categories ({drafts.length})</option>
            <option value="doll">Dolls</option>
            <option value="bouquet">Flowers &amp; Bouquets</option>
            <option value="plushie">Plushies &amp; Animals</option>
            <option value="keychain">Keychains &amp; Charms</option>
            <option value="misc">Bookmarks &amp; Misc</option>
          </select>

          <button
            onClick={handleAddNewProduct}
            disabled={Boolean(savingId)}
            className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> Add New Product
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Products Grid / Editor List */}
      <div className="space-y-6">
        {filteredDrafts.map((draft) => {
          const isSaving = savingId === draft.id;
          const imageList = draft.imagesText.split(/\r?\n/).filter(Boolean);

          return (
            <article
              key={draft.id}
              className={`liquid-glass rounded-3xl p-6 border transition-all shadow-sm ${
                draft.isActive ? "border-white/70" : "border-slate-300 opacity-75 bg-slate-50/50"
              }`}
            >
              {/* Draft Header: ID, Name, Visibility, Save */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/50">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-black bg-white/80 px-2.5 py-1 rounded-lg border border-white/80 text-lilac-deep">
                    {draft.id}
                  </span>
                  {draft.isCmsProduct && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      CMS Synced
                    </span>
                  )}
                  {!draft.isActive && (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Hidden from Store
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Active/Hidden Toggle */}
                  <button
                    onClick={() => updateDraft(draft.id, { isActive: !draft.isActive })}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all inline-flex items-center gap-1 ${
                      draft.isActive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {draft.isActive ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    {draft.isActive ? "Active" : "Hidden"}
                  </button>

                  {/* Save button */}
                  <button
                    onClick={() => handleSaveProduct(draft)}
                    disabled={isSaving}
                    className="clay-primary liquid-btn rounded-full px-4 py-1.5 text-xs font-bold shadow-md inline-flex items-center gap-1.5 hover:scale-102"
                  >
                    <Save className="size-3.5" />
                    {isSaving ? "Saving..." : "Save Product"}
                  </button>

                  {/* Delete / Revert button */}
                  <button
                    onClick={() => handleDeleteProduct(draft)}
                    disabled={isSaving}
                    className="rounded-full p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    title="Delete product"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid gap-4 sm:grid-cols-12 pt-4 text-xs">
                {/* Product Name */}
                <div className="sm:col-span-6">
                  <label className="block font-bold text-foreground mb-1">Product Title</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => updateDraft(draft.id, { name: e.target.value })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold outline-none focus:border-lilac-deep"
                  />
                </div>

                {/* Category / Type */}
                <div className="sm:col-span-3">
                  <label className="block font-bold text-foreground mb-1">Category</label>
                  <select
                    value={draft.type}
                    onChange={(e) => updateDraft(draft.id, { type: e.target.value as ProductType })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
                  >
                    <option value="doll">Doll</option>
                    <option value="bouquet">Bouquet / Flower</option>
                    <option value="plushie">Plushie / Animal</option>
                    <option value="keychain">Keychain / Charm</option>
                    <option value="misc">Bookmark / Misc</option>
                  </select>
                </div>

                {/* Size / Specs */}
                <div className="sm:col-span-3">
                  <label className="block font-bold text-foreground mb-1">Size / Dimensions</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 inches · 12.7 cm"
                    value={draft.size}
                    onChange={(e) => updateDraft(draft.id, { size: e.target.value })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                  />
                </div>

                {/* Pricing Fields */}
                <div className="sm:col-span-4">
                  <label className="block font-bold text-foreground mb-1">Original Price (Strike)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,800"
                    value={draft.originalPrice}
                    onChange={(e) => handlePricingChange(draft.id, "originalPrice", e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block font-bold text-foreground mb-1">Selling Price *</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1,499"
                    value={draft.sellingPrice}
                    onChange={(e) => handlePricingChange(draft.id, "sellingPrice", e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-emerald-700 outline-none focus:border-lilac-deep"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-foreground mb-1">Discount %</label>
                  <input
                    type="text"
                    placeholder="e.g. 15"
                    value={draft.discountPercent}
                    onChange={(e) => handlePricingChange(draft.id, "discountPercent", e.target.value)}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-purple-700 outline-none focus:border-lilac-deep"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-foreground mb-1">Store Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. ⭐ Bestseller"
                    value={draft.badge}
                    onChange={(e) => updateDraft(draft.id, { badge: e.target.value })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                  />
                </div>

                {/* Tagline */}
                <div className="sm:col-span-12">
                  <label className="block font-bold text-foreground mb-1">Tagline</label>
                  <input
                    type="text"
                    placeholder="Brief catchphrase shown in previews..."
                    value={draft.tagline}
                    onChange={(e) => updateDraft(draft.id, { tagline: e.target.value })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-12">
                  <label className="block font-bold text-foreground mb-1">Product Description</label>
                  <textarea
                    rows={2}
                    value={draft.description}
                    onChange={(e) => updateDraft(draft.id, { description: e.target.value })}
                    className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                  />
                </div>

                {/* Images Section */}
                <div className="sm:col-span-12 rounded-2xl bg-white/60 p-3.5 border border-white/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-xs">
                      Product Photos ({imageList.length})
                    </span>
                    <label className="clay rounded-full px-3 py-1 text-[11px] font-bold text-lilac-deep cursor-pointer hover:bg-white/60 inline-flex items-center gap-1">
                      <Upload className="size-3" /> Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(draft, e.target.files)}
                      />
                    </label>
                  </div>

                  {/* Thumbnails preview */}
                  {imageList.length > 0 && (
                    <div className="flex flex-wrap gap-2.5">
                      {imageList.map((imgUrl, i) => (
                        <div key={i} className="relative size-16 rounded-xl overflow-hidden shadow-sm border border-white/80 group">
                          <img src={imgUrl} alt="" className="size-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const next = imageList.filter((_, idx) => idx !== i);
                              updateDraft(draft.id, { imagesText: next.join("\n") });
                            }}
                            className="absolute top-1 right-1 size-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Image URLs (one URL per line):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="https://... or /src/assets/..."
                      value={draft.imagesText}
                      onChange={(e) => updateDraft(draft.id, { imagesText: e.target.value })}
                      className="w-full rounded-xl border border-white/80 bg-white/80 p-2 font-mono text-[11px] outline-none focus:border-lilac-deep"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SETTINGS COMPONENT
   ───────────────────────────────────────────────────────────── */
function SettingsAdminSection({ userEmail }: { userEmail?: string | null }) {
  return (
    <div className="liquid-glass rounded-3xl p-6 border border-white/60 space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-lilac-deep">Admin Settings &amp; Roles</h2>
        <p className="text-xs text-muted-foreground">
          Configuration for the Inventive Queen online realm.
        </p>
      </div>

      <div className="rounded-2xl bg-white/60 p-4 border border-white/70 space-y-3 text-xs">
        <h3 className="font-bold text-foreground">👑 Admin Role Security</h3>
        <p className="text-muted-foreground leading-relaxed">
          Admin access is controlled directly via Supabase. In your Supabase database dashboard, the table{" "}
          <code className="font-mono bg-white px-1.5 py-0.5 rounded text-lilac-deep">admin_users</code>{" "}
          stores the user IDs granted administrator privileges.
        </p>
        <p className="text-muted-foreground">
          Currently signed in as: <strong className="text-foreground">{userEmail}</strong>
        </p>
      </div>

      <div className="rounded-2xl bg-white/60 p-4 border border-white/70 space-y-2 text-xs">
        <h3 className="font-bold text-foreground">💳 Razorpay Production Configuration</h3>
        <p className="text-muted-foreground leading-relaxed">
          Payments are handled via Razorpay SDK with instantaneous webhook and status tracking. Make sure{" "}
          <code className="font-mono bg-white px-1.5 py-0.5 rounded text-lilac-deep">VITE_RAZORPAY_KEY_ID</code>{" "}
          is configured in your environment variables for live transaction processing.
        </p>
      </div>
    </div>
  );
}
