import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgePercent,
  AlertTriangle,
  Boxes,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Columns,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  ImagePlus,
  IndianRupee,
  Kanban,
  List,
  Lock,
  Megaphone,
  MessageCircle,
  Package,
  Percent,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Square,
  Star,
  Tag,
  Trash2,
  Truck,
  Unlock,
  Upload,
  User as UserIcon,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { AdminSidebar, type AdminTab } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { OrderStatusChart } from "@/components/admin/OrderStatusChart";
import { PackingSlipModal } from "@/components/admin/PackingSlipModal";
import { GiftNotePrintModal } from "@/components/admin/GiftNotePrintModal";
import { OrderKanbanBoard } from "@/components/admin/OrderKanbanBoard";
import { ProductPreviewCard } from "@/components/admin/ProductPreviewCard";
import { useAuth } from "@/lib/auth";
import { useProducts } from "@/lib/cms-products";
import { useReviews, type ReviewItem } from "@/lib/cms-reviews";
import { useCoupons, type Coupon } from "@/lib/cms-coupons";
import { useInventory, type InventoryItem } from "@/lib/cms-inventory";
import { categories, type Product, type ProductType } from "@/lib/products";
import { calculateDiscountPercent, formatPrice, parsePriceValue } from "@/lib/product-display";
import {
  createWhatsAppChatUrl,
  exportOrdersToCsv,
  getNextOrderStatus,
  parseAdminNotes,
  serializeAdminNotes,
  getOrderItemImageUrl,
} from "@/lib/order-utils";
import logo from "@/assets/logo.png";
import { useStoreSettings } from "@/lib/store-settings";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: ((search["tab"] as string) || "overview") as AdminTab,
  }),
  head: () => ({
    meta: [
      { title: "Admin Panel & CMS — Inventive Queen" },
      { name: "description", content: "Manage orders, products, pricing, and website content." },
    ],
  }),
});

const ALL_STATUSES: { status: OrderStatus; label: string; color: string; nextAction?: string }[] = [
  {
    status: "pending",
    label: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    nextAction: "Confirm Order",
  },
  {
    status: "confirmed",
    label: "Confirmed",
    color: "bg-sky-100 text-sky-800 border-sky-300",
    nextAction: "Start Crafting",
  },
  {
    status: "crafting",
    label: "Crafting",
    color: "bg-purple-100 text-purple-800 border-purple-300",
    nextAction: "Mark Shipped",
  },
  {
    status: "shipped",
    label: "Shipped",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    nextAction: "Mark Delivered",
  },
  {
    status: "delivered",
    label: "Delivered",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  { status: "cancelled", label: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

const BADGE_PRESETS = [
  "Bestseller",
  "Popular",
  "New Arrival",
  "Limited Edition",
  "Hand-Crafted",
  "Seasonal",
];

const STOCK_OPTIONS = [
  { value: "in_stock", label: "In Stock (Ready to Ship)" },
  { value: "made_to_order", label: "Made to Order (7-10 days)" },
  { value: "limited_slots", label: "Limited Slots" },
  { value: "out_of_stock", label: "Sold Out / Back Soon" },
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
    discountPercent: product.discountPercent
      ? String(product.discountPercent)
      : calculatedDiscount > 0
        ? String(calculatedDiscount)
        : "",
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
    originalPrice: originalPrice || "",
    sellingPrice,
    discountPercent: Number.isFinite(discountPercent) && discountPercent > 0 ? discountPercent : 0,
    type: draft.type,
    size: draft.size.trim() || "",
    tagline: draft.tagline.trim(),
    description: draft.description.trim(),
    images,
    badge: draft.badge.trim() || "",
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
    } catch (err: unknown) {
      console.error("Failed to load orders for admin:", err);
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setNotice(msg);
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
    const openOrders = orders.filter((o) =>
      ["pending", "confirmed", "crafting"].includes(o.status),
    );

    // Calculate top-ordered products
    const productCountMap: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach((o) => {
      (o.order_items || []).forEach((item) => {
        const key = item.product_id || item.product_name;
        if (!productCountMap[key]) {
          productCountMap[key] = { name: item.product_name, count: 0, revenue: 0 };
        }
        productCountMap[key].count += item.quantity || 1;
        productCountMap[key].revenue += (item.quantity || 1) * (item.unit_price || 0);
      });
    });

    const topProducts = Object.values(productCountMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      todayOrdersCount: todayOrders.length,
      openOrdersCount: openOrders.length,
      paidOrdersCount: paidOrders.length,
      topProducts,
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
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)),
      );
      setNotice(
        `Order status changed to "${newStatus.toUpperCase()}". Customer tracking updated live!`,
      );
      setTimeout(() => setNotice(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Failed to update status: " + msg);
    }
  };

  // Order notes and courier tracking update
  const handleOrderNotesSave = async (orderId: string, rawNotes: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ admin_notes: rawNotes })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, admin_notes: rawNotes } : ord)),
      );
      setNotice("Courier & internal notes saved successfully.");
      setTimeout(() => setNotice(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Failed to save notes: " + msg);
    }
  };

  // Security Gate: Verify authentication and administrative role
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="size-12 rounded-2xl bg-lilac-deep/10 text-lilac-deep flex items-center justify-center mb-4 text-xl">
          <Crown className="size-6 animate-pulse text-lilac-deep" />
        </div>
        <h2 className="font-display font-bold text-lg text-slate-800">
          Verifying Royal Credentials...
        </h2>
        <p className="text-xs text-slate-500 mt-1">Checking atelier administrative access levels</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 p-6 text-center">
        <div className="max-w-md w-full rounded-2xl border border-lilac-deep/20 bg-white p-8 shadow-xl">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-lilac-deep/10 text-lilac-deep">
            <Crown className="size-7 text-lilac-deep" />
          </div>
          <h2 className="font-display text-xl font-black text-slate-800">
            Atelier Administration Gate
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            This portal is strictly reserved for Inventive Queen artisans and store administrators.
            Please authenticate with your executive credentials.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/login"
              search={{ redirect: "/admin" }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-lilac-deep py-3 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all"
            >
              <Lock className="size-4" />
              Sign In to Admin Portal
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-lilac-deep transition-colors py-1"
            >
              ← Return to Atelier Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/70 p-6 text-center">
        <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-white p-8 shadow-xl">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-600">
            <ShieldCheck className="size-8 text-rose-500" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
            403 Forbidden Access
          </div>
          <h2 className="font-display text-xl font-black text-slate-800">
            Restricted Atelier Access
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Account <span className="font-semibold text-slate-700">{user.email}</span> is
            authenticated as a customer but lacks Executive Atelier privileges.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/orders"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-lilac-deep py-3 text-sm font-bold text-white shadow-md hover:bg-lilac-deep/90 transition-all"
            >
              <ShoppingBag className="size-4" />
              View My Personal Orders
            </Link>
            <Link
              to="/"
              className="text-xs text-slate-500 hover:text-lilac-deep transition-colors py-1"
            >
              ← Return to Atelier Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50/70 text-foreground">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-white/70 backdrop-blur-md px-6 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-lilac-deep text-white shadow-sm">
              <Crown className="size-4" />
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
            <span className="inline-flex items-center gap-1.5">
              <Crown className="size-3.5 text-emerald-700 inline" />
              <span>{notice}</span>
            </span>
            <button
              onClick={() => setNotice(null)}
              className="text-emerald-700 hover:text-emerald-900"
            >
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
              <p className="text-sm font-semibold text-muted-foreground">
                Verifying royal permissions...
              </p>
            </div>
          ) : !user ? (
            <div className="liquid-glass mx-auto max-w-md rounded-3xl p-8 text-center my-12 shadow-xl border border-white/60">
              <div className="size-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Lock className="size-7" />
              </div>
              <h2 className="font-display text-xl font-bold text-lilac-deep">
                Admin Sign In Required
              </h2>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                You must be signed in with an authorized account to access the Inventive Queen CMS
                and manage orders &amp; products.
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
              {/* ─────── TAB 1: OVERVIEW & ANALYTICS ─────── */}
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

                  {/* Interactive Visual Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8">
                      <RevenueChart orders={orders} />
                    </div>
                    <div className="lg:col-span-4">
                      <OrderStatusChart orders={orders} />
                    </div>
                  </div>

                  {/* Quick Action Navigation & Leaderboard */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Atelier Management Shortcuts */}
                    <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Crown className="size-4 text-lilac-deep" />
                          <h3 className="font-display text-base font-bold text-lilac-deep">
                            Atelier Management Hub
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Process incoming customer requests, update pricing &amp; seasonal
                          creations, or announce special limited slots directly on the live
                          storefront.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                        <button
                          onClick={() => setTab("orders")}
                          className="clay-primary liquid-btn rounded-2xl p-2.5 text-center text-[11px] font-bold shadow-sm"
                        >
                          <ShoppingBag className="size-3.5 mx-auto mb-1" />
                          Orders ({orders.length})
                        </button>
                        <button
                          onClick={() => setTab("products")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Package className="size-3.5 mx-auto mb-1" />
                          Products CMS
                        </button>
                        <button
                          onClick={() => setTab("inventory")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Boxes className="size-3.5 mx-auto mb-1 text-amber-600" />
                          Yarn &amp; Supplies
                        </button>
                        <button
                          onClick={() => setTab("reviews")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Star className="size-3.5 mx-auto mb-1 text-amber-500" />
                          Reviews CMS
                        </button>
                        <button
                          onClick={() => setTab("coupons")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Tag className="size-3.5 mx-auto mb-1 text-emerald-600" />
                          Coupons CMS
                        </button>
                        <button
                          onClick={() => setTab("customers")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Users className="size-3.5 mx-auto mb-1 text-purple-600" />
                          Patrons CRM
                        </button>
                        <button
                          onClick={() => setTab("store")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Megaphone className="size-3.5 mx-auto mb-1 text-sky-600" />
                          Store Banner
                        </button>
                        <button
                          onClick={() => setTab("settings")}
                          className="clay rounded-2xl p-2.5 text-center text-[11px] font-bold text-lilac-deep hover:bg-white/60 shadow-sm"
                        >
                          <Settings className="size-3.5 mx-auto mb-1 text-slate-600" />
                          Settings
                        </button>
                      </div>
                    </div>

                    {/* Top Performing Creations */}
                    <div className="lg:col-span-6 liquid-glass rounded-3xl p-6 border border-white/60">
                      <div className="flex items-center justify-between pb-3 border-b border-white/50 mb-3">
                        <div className="flex items-center gap-2">
                          <Flame className="size-4 text-rose-500" />
                          <h3 className="font-display text-base font-bold text-lilac-deep">
                            Top Performing Creations
                          </h3>
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          By Volume &amp; Revenue
                        </span>
                      </div>

                      {stats.topProducts.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-6 text-center">
                          Placed customer orders will dynamically generate your top performers
                          leaderboard here!
                        </p>
                      ) : (
                        <div className="divide-y divide-white/40">
                          {stats.topProducts.map((p, idx) => (
                            <div
                              key={idx}
                              className="py-2.5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="size-5 rounded-full bg-lilac/30 text-lilac-deep font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                                  #{idx + 1}
                                </span>
                                <span className="truncate font-semibold text-foreground">
                                  {p.name}
                                </span>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-extrabold text-foreground">
                                  ₹{p.revenue.toLocaleString("en-IN")}
                                </span>
                                <span className="block text-[10px] text-muted-foreground">
                                  {p.count} sold
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Incoming Orders */}
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
                      <p className="text-xs text-muted-foreground text-center py-6">
                        No orders yet.
                      </p>
                    ) : (
                      <div className="divide-y divide-white/40">
                        {orders.slice(0, 5).map((order) => (
                          <div
                            key={order.id}
                            className="py-3 flex items-center justify-between gap-4 text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-lilac-deep">
                                {order.order_number}
                              </span>
                              <p className="text-muted-foreground mt-0.5">
                                {order.customer_name} · +91 {order.phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-foreground">
                                ₹{order.amount_total?.toLocaleString("en-IN")}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  ALL_STATUSES.find((s) => s.status === order.status)?.color ||
                                  "bg-gray-100"
                                }`}
                              >
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

              {/* ─────── TAB 4: YARN & CRAFT SUPPLIES CMS ─────── */}
              {activeTab === "inventory" && <InventoryAdminSection />}

              {/* ─────── TAB 5: REVIEWS CMS ─────── */}
              {activeTab === "reviews" && <ReviewsAdminSection />}

              {/* ─────── TAB 5: COUPONS CMS ─────── */}
              {activeTab === "coupons" && <CouponsAdminSection />}

              {/* ─────── TAB 6: PATRONS CRM ─────── */}
              {activeTab === "customers" && <CustomersAdminSection orders={orders} />}

              {/* ─────── TAB 7: STORE & ANNOUNCEMENT CMS ─────── */}
              {activeTab === "store" && <StoreSettingsAdminSection />}

              {/* ─────── TAB 8: SETTINGS ─────── */}
              {activeTab === "settings" && <SettingsAdminSection userEmail={user.email ?? null} />}
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
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [courierInputs, setCourierInputs] = useState<
    Record<string, { courier: string; tracking: string; notes: string }>
  >({});
  const [selectedPackingOrder, setSelectedPackingOrder] = useState<DbOrder | null>(null);
  const [selectedGiftNoteOrder, setSelectedGiftNoteOrder] = useState<DbOrder | null>(null);

  // Initialize input state for each order from parsed admin_notes
  useEffect(() => {
    const map: Record<string, { courier: string; tracking: string; notes: string }> = {};
    orders.forEach((o) => {
      const parsed = parseAdminNotes(o.admin_notes);
      map[o.id] = {
        courier: parsed.courier,
        tracking: parsed.trackingNumber,
        notes: parsed.internalNotes,
      };
    });
    setCourierInputs(map);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === "all" || order.status === filter;
      const matchesSearch =
        !searchQuery ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery) ||
        (order.pincode && order.pincode.includes(searchQuery));
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  const handleSaveOrderDetails = (orderId: string) => {
    const input = courierInputs[orderId] || { courier: "", tracking: "", notes: "" };
    const serialized = serializeAdminNotes({
      courier: input.courier,
      trackingNumber: input.tracking,
      internalNotes: input.notes,
    });
    onSaveNotes(orderId, serialized);
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Controls */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">Orders Management</h2>
          <p className="text-xs text-muted-foreground">
            Advance orders through hand-crafting stages, assign courier tracking IDs, print royal
            packing slips, and connect with customers on WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/80 p-0.5 rounded-full border border-white/90 shadow-sm text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-full transition-all inline-flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-lilac-deep text-white shadow-sm"
                  : "text-muted-foreground hover:text-lilac-deep"
              }`}
            >
              <List className="size-3.5" /> List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1 rounded-full transition-all inline-flex items-center gap-1 ${
                viewMode === "kanban"
                  ? "bg-lilac-deep text-white shadow-sm"
                  : "text-muted-foreground hover:text-lilac-deep"
              }`}
            >
              <Kanban className="size-3.5" /> Workshop Kanban
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search order #, customer, phone, pin..."
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
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="crafting">In Hand-Crafting</option>
            <option value="shipped">Dispatched / Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export to CSV button */}
          <button
            onClick={() => exportOrdersToCsv(filteredOrders)}
            disabled={filteredOrders.length === 0}
            className="clay rounded-full px-3.5 py-1.5 text-xs font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1.5 shadow-sm"
            title="Download CSV spreadsheet"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Orders Content Area */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="size-6 animate-spin mx-auto text-lilac-deep mb-2" />
          <p className="text-xs text-muted-foreground">Loading orders from workshop database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-8 text-center text-muted-foreground text-xs">
          No orders match the selected search query or filter.
        </div>
      ) : viewMode === "kanban" ? (
        <OrderKanbanBoard
          orders={filteredOrders}
          onStatusChange={onStatusChange}
          onOpenPackingSlip={(order) => setSelectedPackingOrder(order)}
          onOpenGiftNote={(order) => setSelectedGiftNoteOrder(order)}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentInput = courierInputs[order.id] || {
              courier: "",
              tracking: "",
              notes: "",
            };
            const nextStatus = getNextOrderStatus(order.status);
            const statusConfig = ALL_STATUSES.find((s) => s.status === order.status);

            return (
              <div
                key={order.id}
                className="liquid-glass rounded-3xl p-5 border border-white/60 shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/50">
                  <div className="flex flex-wrap items-center gap-3">
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
                    <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      Paid · Razorpay ({order.payment_id || "Verified"})
                    </span>
                  </div>

                  {/* One-Click Pipeline Stepper & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Advance to next pipeline stage */}
                    {nextStatus && (
                      <button
                        onClick={() => onStatusChange(order.id, nextStatus)}
                        className="clay-primary liquid-btn rounded-full px-3.5 py-1 text-xs font-bold shadow-sm inline-flex items-center gap-1.5 hover:scale-102"
                      >
                        <span>{statusConfig?.nextAction || `Advance to ${nextStatus}`}</span>
                        <ArrowRight className="size-3" />
                      </button>
                    )}

                    {/* Status Dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                      className="rounded-xl border border-white/80 bg-white/90 px-3 py-1 text-xs font-extrabold text-lilac-deep shadow-sm outline-none focus:ring-2 focus:ring-lilac-deep/30"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s.status} value={s.status}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    {/* Direct WhatsApp Contact */}
                    <a
                      href={createWhatsAppChatUrl(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay rounded-full px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1"
                      title="Chat directly with customer on WhatsApp"
                    >
                      <MessageCircle className="size-3.5" /> WhatsApp
                    </a>

                    {/* Printable Packing Slip */}
                    <button
                      onClick={() => setSelectedPackingOrder(order)}
                      className="clay rounded-full px-3 py-1 text-xs font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1"
                      title="Generate and print royal packing slip"
                    >
                      <Printer className="size-3.5" /> Packing Slip
                    </button>

                    {/* Wax-Sealed Gift Note Print */}
                    {order.gift_note && (
                      <button
                        onClick={() => setSelectedGiftNoteOrder(order)}
                        className="clay rounded-full px-3 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 inline-flex items-center gap-1 border border-amber-300 shadow-sm"
                        title="Print wax-sealed calligraphy gift note"
                      >
                        <Gift className="size-3.5 text-amber-700" /> Gift Note
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid: Customer Info + Ordered Items + Courier Details */}
                <div className="grid gap-4 md:grid-cols-12 text-xs">
                  {/* Customer Delivery Info */}
                  <div className="md:col-span-4 rounded-2xl bg-white/60 p-3.5 border border-white/70 space-y-1.5">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground block">
                      Delivery Address
                    </span>
                    <p className="font-bold text-foreground text-sm">{order.customer_name}</p>
                    <p className="text-muted-foreground">Phone: +91 {order.phone}</p>
                    <p className="text-muted-foreground leading-relaxed">{order.address}</p>
                    <p className="font-bold text-foreground">Pincode: {order.pincode}</p>
                    {order.gift_note && (
                      <div className="mt-2 pt-2 border-t border-white/60 text-[11px]">
                        <span className="font-bold text-lilac-deep inline-flex items-center gap-1">
                          <Crown className="size-3 text-amber-600" />
                          <span>Wax-Sealed Gift Note:</span>
                        </span>
                        <p className="italic text-muted-foreground mt-0.5">"{order.gift_note}"</p>
                      </div>
                    )}
                  </div>

                  {/* Ordered Items */}
                  <div className="md:col-span-4 space-y-2">
                    <p className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Ordered Items ({order.order_items?.length || 1})
                    </p>
                    <div className="divide-y divide-white/40 max-h-36 overflow-y-auto pr-1">
                      {order.order_items?.map((item) => (
                        <div
                          key={item.id}
                          className="py-1.5 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={getOrderItemImageUrl(item)}
                              alt={item.product_name}
                              className="size-8 rounded-md object-cover flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = logo;
                              }}
                            />
                            <span className="truncate font-semibold text-foreground">
                              {item.product_name}
                            </span>
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

                  {/* Courier Tracking & Dispatch Info */}
                  <div className="md:col-span-4 rounded-2xl bg-white/60 p-3.5 border border-white/70 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider flex items-center gap-1">
                          <Truck className="size-3 text-lilac-deep" /> Courier &amp; Tracking
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Courier (e.g. BlueDart, Delhivery, DTDC, India Post)"
                          value={currentInput.courier}
                          onChange={(e) =>
                            setCourierInputs((prev) => ({
                              ...prev,
                              [order.id]: { ...currentInput, courier: e.target.value },
                            }))
                          }
                          className="w-full rounded-xl border border-white/80 bg-white/90 px-2.5 py-1 text-xs outline-none focus:border-lilac-deep font-medium"
                        />

                        <input
                          type="text"
                          placeholder="Tracking / AWB Number"
                          value={currentInput.tracking}
                          onChange={(e) =>
                            setCourierInputs((prev) => ({
                              ...prev,
                              [order.id]: { ...currentInput, tracking: e.target.value },
                            }))
                          }
                          className="w-full rounded-xl border border-white/80 bg-white/90 px-2.5 py-1 text-xs outline-none focus:border-lilac-deep font-mono"
                        />

                        <textarea
                          rows={2}
                          placeholder="Internal craft notes (yarn batch, special requests)..."
                          value={currentInput.notes}
                          onChange={(e) =>
                            setCourierInputs((prev) => ({
                              ...prev,
                              [order.id]: { ...currentInput, notes: e.target.value },
                            }))
                          }
                          className="w-full rounded-xl border border-white/80 bg-white/80 p-2 text-xs outline-none focus:border-lilac-deep"
                        />
                      </div>
                    </div>

                    <div className="text-right pt-1">
                      <button
                        onClick={() => handleSaveOrderDetails(order.id)}
                        className="clay rounded-full px-3.5 py-1 text-[11px] font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1"
                      >
                        <Save className="size-3" /> Save Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Royal Packing Slip Modal */}
      <PackingSlipModal
        order={selectedPackingOrder}
        onClose={() => setSelectedPackingOrder(null)}
      />

      {/* Calligraphy Gift Note Studio Modal */}
      <GiftNotePrintModal
        order={selectedGiftNoteOrder}
        onClose={() => setSelectedGiftNoteOrder(null)}
      />
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDrafts.length && filteredDrafts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDrafts.map((d) => d.id));
    }
  };

  const handleBulkDiscount = (pct: number) => {
    if (selectedIds.length === 0) return;
    setDrafts((prev) =>
      prev.map((d) => {
        if (!selectedIds.includes(d.id)) return d;
        const orig = parsePriceValue(d.originalPrice) || parsePriceValue(d.price) || 1000;
        const newSell = Math.max(1, Math.round(orig - (orig * pct) / 100));
        return {
          ...d,
          originalPrice: d.originalPrice || d.price,
          sellingPrice: formatPrice(newSell),
          price: formatPrice(newSell),
          discountPercent: String(pct),
        };
      }),
    );
    setStatusMsg(
      `Applied ${pct}% festive discount to ${selectedIds.length} creations! Click 'Save All Selected' to commit.`,
    );
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleBulkBadge = (badge: string) => {
    if (selectedIds.length === 0) return;
    setDrafts((prev) => prev.map((d) => (selectedIds.includes(d.id) ? { ...d, badge } : d)));
    setStatusMsg(`Updated badge to "${badge || "None"}" for ${selectedIds.length} creations!`);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleBulkVisibility = (isActive: boolean) => {
    if (selectedIds.length === 0) return;
    setDrafts((prev) => prev.map((d) => (selectedIds.includes(d.id) ? { ...d, isActive } : d)));
    setStatusMsg(
      `Marked ${selectedIds.length} creations as ${isActive ? "Active (Storefront Visible)" : "Hidden"}!`,
    );
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleBulkSave = async () => {
    if (selectedIds.length === 0) return;
    setSavingId("bulk");
    try {
      const toSave = drafts.filter((d) => selectedIds.includes(d.id));
      for (const draft of toSave) {
        const prod = draftToProduct(draft);
        await saveProduct(prod);
      }
      setStatusMsg(`Successfully saved all ${toSave.length} creations to CMS!`);
      setSelectedIds([]);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Bulk save failed: " + msg);
    } finally {
      setSavingId("");
    }
  };

  const handlePricingChange = (
    id: string,
    field: "originalPrice" | "sellingPrice" | "discountPercent",
    val: string,
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
      }),
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
        badge: "New",
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Error generating ID: " + msg);
    } finally {
      setSavingId("");
    }
  };

  // Duplicate / Clone existing product
  const handleDuplicateProduct = async (original: ProductDraft) => {
    setSavingId(original.id);
    try {
      const newId = `${original.id}-variant-${Math.floor(100 + Math.random() * 900)}`;
      const clonedDraft: ProductDraft = {
        ...original,
        id: newId,
        name: `${original.name} (Variant)`,
        isCmsProduct: false,
        isNew: true,
        isIdLocked: true,
      };

      setDrafts((prev) => [clonedDraft, ...prev]);
      setStatusMsg(`Duplicated "${original.name}" as "${clonedDraft.name}" with ID: ${newId}`);
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Failed to duplicate: " + msg);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Save failed: " + msg);
    } finally {
      setSavingId("");
    }
  };

  const handleDeleteProduct = async (draft: ProductDraft) => {
    if (draft.isNew) {
      setDrafts((prev) => prev.filter((d) => d.id !== draft.id));
      return;
    }

    if (
      !confirm(`Are you sure you want to delete or revert CMS customizations for "${draft.name}"?`)
    ) {
      return;
    }

    setSavingId(draft.id);
    try {
      await deleteProduct(draft.id);
      setStatusMsg(`Removed CMS entry for ${draft.name}.`);
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Delete failed: " + msg);
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
      setStatusMsg("Images uploaded! Click 'Save Product' to commit changes.");
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      alert("Image upload failed: " + msg);
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
            Edit product names, pricing, discounts, descriptions, photos, duplicate variants, or
            publish new creations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products by title or ID..."
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

          {/* Bulk Selection Toggle */}
          <button
            type="button"
            onClick={toggleSelectAll}
            className="clay rounded-xl px-3 py-1.5 text-xs font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1.5 shadow-sm"
            title="Select all products shown for bulk festive discount or badge assignment"
          >
            {selectedIds.length === filteredDrafts.length && filteredDrafts.length > 0 ? (
              <CheckSquare className="size-3.5 text-lilac-deep" />
            ) : (
              <Square className="size-3.5 text-muted-foreground" />
            )}
            <span>
              {selectedIds.length === filteredDrafts.length && filteredDrafts.length > 0
                ? "Deselect All"
                : `Select All (${filteredDrafts.length})`}
            </span>
          </button>

          <button
            onClick={handleAddNewProduct}
            disabled={Boolean(savingId)}
            className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> Add New Creation
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
          const orig = parsePriceValue(draft.originalPrice);
          const sell = parsePriceValue(draft.sellingPrice);
          const savings = orig > sell ? orig - sell : 0;

          return (
            <article
              key={draft.id}
              className={`liquid-glass rounded-3xl p-6 border transition-all shadow-sm ${
                draft.isActive ? "border-white/70" : "border-slate-300 opacity-75 bg-slate-50/50"
              }`}
            >
              {/* Draft Header: ID, Status Badges, Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/50">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleSelect(draft.id)}
                    className={`p-1 rounded-lg transition-colors flex items-center justify-center ${
                      selectedIds.includes(draft.id)
                        ? "text-lilac-deep bg-lilac/20"
                        : "text-muted-foreground hover:text-lilac-deep"
                    }`}
                    title={selectedIds.includes(draft.id) ? "Deselect" : "Select for bulk action"}
                  >
                    {selectedIds.includes(draft.id) ? (
                      <CheckSquare className="size-4 text-lilac-deep" />
                    ) : (
                      <Square className="size-4 text-muted-foreground" />
                    )}
                  </button>
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
                  {/* Duplicate Product */}
                  <button
                    onClick={() => handleDuplicateProduct(draft)}
                    disabled={isSaving}
                    className="clay rounded-full px-3 py-1 text-xs font-bold text-lilac-deep hover:bg-white/60 inline-flex items-center gap-1 shadow-sm"
                    title="Clone this creation into a new draft"
                  >
                    <Copy className="size-3.5" /> Duplicate
                  </button>

                  {/* Active/Hidden Toggle */}
                  <button
                    onClick={() => updateDraft(draft.id, { isActive: !draft.isActive })}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-all inline-flex items-center gap-1 ${
                      draft.isActive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {draft.isActive ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
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
                    title="Delete or revert product"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Split Editor Layout: Form on Left + Live Preview on Right */}
              <div className="grid gap-6 lg:grid-cols-12 pt-4">
                {/* Form Fields: 8 columns */}
                <div className="lg:col-span-8 space-y-4 text-xs">
                  <div className="grid gap-3 sm:grid-cols-12">
                    {/* Product Name */}
                    <div className="sm:col-span-8">
                      <label className="block font-bold text-foreground mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => updateDraft(draft.id, { name: e.target.value })}
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold outline-none focus:border-lilac-deep"
                      />
                    </div>

                    {/* Category */}
                    <div className="sm:col-span-4">
                      <label className="block font-bold text-foreground mb-1">Category</label>
                      <select
                        value={draft.type}
                        onChange={(e) =>
                          updateDraft(draft.id, { type: e.target.value as ProductType })
                        }
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
                      >
                        <option value="doll">Doll</option>
                        <option value="bouquet">Bouquet / Flower</option>
                        <option value="plushie">Plushie / Animal</option>
                        <option value="keychain">Keychain / Charm</option>
                        <option value="misc">Bookmark / Misc</option>
                      </select>
                    </div>

                    {/* Size */}
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-foreground mb-1">
                        Size / Dimensions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 inches · 12.7 cm"
                        value={draft.size}
                        onChange={(e) => updateDraft(draft.id, { size: e.target.value })}
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                      />
                    </div>

                    {/* Tagline */}
                    <div className="sm:col-span-6">
                      <label className="block font-bold text-foreground mb-1">Tagline</label>
                      <input
                        type="text"
                        placeholder="Brief catchphrase shown in store..."
                        value={draft.tagline}
                        onChange={(e) => updateDraft(draft.id, { tagline: e.target.value })}
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                      />
                    </div>

                    {/* Pricing Grid */}
                    <div className="sm:col-span-4">
                      <label className="block font-bold text-foreground mb-1">
                        Original Price (Strike)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹1,800"
                        value={draft.originalPrice}
                        onChange={(e) =>
                          handlePricingChange(draft.id, "originalPrice", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block font-bold text-foreground mb-1">
                        Selling Price *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹1,499"
                        value={draft.sellingPrice}
                        onChange={(e) =>
                          handlePricingChange(draft.id, "sellingPrice", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-emerald-700 outline-none focus:border-lilac-deep"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block font-bold text-foreground mb-1">Discount %</label>
                      <input
                        type="text"
                        placeholder="e.g. 15"
                        value={draft.discountPercent}
                        onChange={(e) =>
                          handlePricingChange(draft.id, "discountPercent", e.target.value)
                        }
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-purple-700 outline-none focus:border-lilac-deep"
                      />
                    </div>

                    {/* Discount & Savings Info */}
                    {savings > 0 && (
                      <div className="sm:col-span-12 rounded-xl bg-purple-50/70 border border-purple-200/70 px-3 py-1.5 text-[11px] text-purple-800 font-semibold flex items-center justify-between">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="size-3 text-purple-600 inline" /> Customer saves ₹
                          {savings.toLocaleString("en-IN")} ({draft.discountPercent}% OFF)
                        </span>
                        <span className="font-normal text-muted-foreground">
                          Original ₹{orig} → Selling ₹{sell}
                        </span>
                      </div>
                    )}

                    {/* Badge Selection & Quick Presets */}
                    <div className="sm:col-span-12 space-y-1.5">
                      <label className="block font-bold text-foreground">Store Badge</label>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        {BADGE_PRESETS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => updateDraft(draft.id, { badge: b })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                              draft.badge === b
                                ? "bg-lilac-deep text-white border-lilac-deep"
                                : "bg-white/80 text-lilac-deep border-white/90 hover:bg-lilac/20"
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Custom badge text..."
                        value={draft.badge}
                        onChange={(e) => updateDraft(draft.id, { badge: e.target.value })}
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
                      />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-12">
                      <label className="block font-bold text-foreground mb-1">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        value={draft.description}
                        onChange={(e) => updateDraft(draft.id, { description: e.target.value })}
                        className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Images Upload & URLs */}
                  <div className="rounded-2xl bg-white/60 p-3.5 border border-white/70 space-y-3">
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
                          <div
                            key={i}
                            className="relative size-16 rounded-xl overflow-hidden shadow-sm border border-white/80 group"
                          >
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

                {/* Live Card Preview: 4 columns */}
                <div className="lg:col-span-4 flex flex-col items-center justify-start border-t lg:border-t-0 lg:border-l border-white/60 pt-4 lg:pt-0 lg:pl-6">
                  <ProductPreviewCard
                    name={draft.name}
                    price={draft.price}
                    originalPrice={draft.originalPrice}
                    sellingPrice={draft.sellingPrice}
                    discountPercent={draft.discountPercent}
                    badge={draft.badge}
                    tagline={draft.tagline}
                    imagesText={draft.imagesText}
                    type={draft.type}
                    isActive={draft.isActive}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Sticky Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-lilac-deep/95 backdrop-blur-2xl text-white rounded-3xl p-4 shadow-2xl border border-white/20 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white size-7 rounded-full flex items-center justify-center font-black text-xs">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">Creations Selected</span>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[11px] text-white/70 hover:text-white underline ml-1"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Festive Discount */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 text-[11px] font-bold">
              <span className="px-2 text-white/80">Festive %:</span>
              <button
                type="button"
                onClick={() => handleBulkDiscount(10)}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full"
              >
                10%
              </button>
              <button
                type="button"
                onClick={() => handleBulkDiscount(15)}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full"
              >
                15%
              </button>
              <button
                type="button"
                onClick={() => handleBulkDiscount(20)}
                className="bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full"
              >
                20%
              </button>
            </div>

            {/* Quick Badge */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleBulkBadge("Bestseller")}
                className="hover:bg-white/20 px-2.5 py-0.5 rounded-full"
              >
                Bestseller
              </button>
              <button
                type="button"
                onClick={() => handleBulkBadge("Limited Edition")}
                className="hover:bg-white/20 px-2.5 py-0.5 rounded-full"
              >
                Limited Edition
              </button>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleBulkVisibility(true)}
                className="hover:bg-white/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-emerald-300"
              >
                <Eye className="size-3" /> Show
              </button>
              <button
                type="button"
                onClick={() => handleBulkVisibility(false)}
                className="hover:bg-white/20 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 text-rose-300"
              >
                <EyeOff className="size-3" /> Hide
              </button>
            </div>

            {/* Save All Selected */}
            <button
              type="button"
              onClick={handleBulkSave}
              disabled={savingId === "bulk"}
              className="clay-primary liquid-btn rounded-full px-4 py-1.5 text-xs font-black shadow-lg inline-flex items-center gap-1.5 text-lilac-deep bg-white hover:bg-white/90"
            >
              <Save className="size-3.5" />
              {savingId === "bulk" ? "Saving..." : "Save to CMS"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   YARN & CRAFT SUPPLIES INVENTORY CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function InventoryAdminSection() {
  const { inventory, lowStockItems, totalValue, adjustQuantity, addItem, deleteItem } =
    useInventory();

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [newItem, setNewItem] = useState<{
    name: string;
    category: "yarn" | "hardware" | "packaging" | "acc";
    quantity: number;
    unit: string;
    minThreshold: number;
    colorHex: string;
    costPerUnit: number;
    supplier: string;
  }>({
    name: "",
    category: "yarn",
    quantity: 10,
    unit: "spools",
    minThreshold: 4,
    colorHex: "#7E57C2",
    costPerUnit: 95,
    supplier: "",
  });

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesCat = categoryFilter === "all" || item.category === categoryFilter;
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [inventory, categoryFilter, searchQuery]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) {
      alert("Please provide a supply material name.");
      return;
    }
    addItem({
      name: newItem.name.trim(),
      category: newItem.category,
      quantity: Number(newItem.quantity) || 0,
      unit: newItem.unit.trim() || "pcs",
      minThreshold: Number(newItem.minThreshold) || 3,
      colorHex: newItem.category === "yarn" ? newItem.colorHex : "",
      costPerUnit: Number(newItem.costPerUnit) || 0,
      supplier: newItem.supplier.trim() || "",
    });
    setStatusMsg(`Added "${newItem.name}" to workshop inventory!`);
    setShowAddForm(false);
    setNewItem({
      name: "",
      category: "yarn",
      quantity: 10,
      unit: "spools",
      minThreshold: 4,
      colorHex: "#7E57C2",
      costPerUnit: 95,
      supplier: "",
    });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "yarn":
        return "Milk Cotton Yarn";
      case "hardware":
        return "Hardware & Safety Eyes";
      case "packaging":
        return "Luxury Packaging";
      case "acc":
        return "Wax Seals & Accessories";
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">
            Yarn &amp; Craft Supplies CMS
          </h2>
          <p className="text-xs text-muted-foreground">
            Track crochet milk cotton yarn spools, safety eyes, gold clasps, royal wax beads, and
            packaging materials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search materials or supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/80 bg-white/80 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
          >
            <option value="all">All Categories ({inventory.length})</option>
            <option value="yarn">Yarn Spools</option>
            <option value="hardware">Hardware &amp; Eyes</option>
            <option value="packaging">Packaging &amp; Boxes</option>
            <option value="acc">Wax Seals &amp; Ribbon</option>
          </select>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> {showAddForm ? "Cancel" : "Add Material"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">
          {statusMsg}
        </div>
      )}

      {/* Workshop Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="liquid-glass rounded-3xl p-4 border border-white/60">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Supply Catalog Items
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-lilac-deep font-mono">
              {inventory.length}
            </span>
            <span className="text-xs text-muted-foreground">different materials</span>
          </div>
        </div>

        <div
          className={`liquid-glass rounded-3xl p-4 border ${lowStockItems.length > 0 ? "border-amber-300 bg-amber-50/40" : "border-white/60"}`}
        >
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Low Stock Alerts
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black font-mono ${lowStockItems.length > 0 ? "text-amber-600" : "text-emerald-600"}`}
            >
              {lowStockItems.length}
            </span>
            <span className="text-xs text-muted-foreground">items below threshold</span>
          </div>
        </div>

        <div className="liquid-glass rounded-3xl p-4 border border-white/60">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Material Inventory Value
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-foreground font-mono">
              ₹{totalValue.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground">estimated stock worth</span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="rounded-3xl bg-amber-50 border border-amber-300 p-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="size-4 text-amber-600 flex-shrink-0" />
            <span>
              Low Stock Warning — {lowStockItems.length} craft materials need reordering soon!
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {lowStockItems.map((item) => (
              <span
                key={item.id}
                className="bg-white/80 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1.5"
              >
                {item.colorHex && (
                  <span
                    className="size-2 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: item.colorHex }}
                  />
                )}
                <strong>{item.name}</strong>: only {item.quantity} {item.unit} left (min:{" "}
                {item.minThreshold})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add New Material Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="liquid-glass rounded-3xl p-6 border border-white/80 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/60">
            <h3 className="font-display font-bold text-lilac-deep text-sm">
              Add Material to Workshop Supplies
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-muted-foreground hover:text-lilac-deep"
            >
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-12 text-xs">
            <div className="sm:col-span-6">
              <label className="block font-bold text-foreground mb-1">Material Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Milk Cotton Yarn — Sky Blue"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-semibold outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value as InventoryItem["category"],
                  })
                }
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
              >
                <option value="yarn">Yarn Spool</option>
                <option value="hardware">Hardware &amp; Eyes</option>
                <option value="packaging">Packaging &amp; Box</option>
                <option value="acc">Wax Seals &amp; Ribbon</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Unit</label>
              <input
                type="text"
                placeholder="spools, pairs, pcs, boxes"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Current Quantity</label>
              <input
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) || 0 })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Min. Threshold (Alert)</label>
              <input
                type="number"
                min="1"
                value={newItem.minThreshold}
                onChange={(e) =>
                  setNewItem({ ...newItem, minThreshold: Number(e.target.value) || 1 })
                }
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Cost Per Unit (₹)</label>
              <input
                type="number"
                min="0"
                value={newItem.costPerUnit}
                onChange={(e) =>
                  setNewItem({ ...newItem, costPerUnit: Number(e.target.value) || 0 })
                }
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-foreground mb-1">Color (Hex/Swatch)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newItem.colorHex}
                  onChange={(e) => setNewItem({ ...newItem, colorHex: e.target.value })}
                  className="size-8 rounded-lg cursor-pointer border border-white/80 bg-white"
                />
                <input
                  type="text"
                  value={newItem.colorHex}
                  onChange={(e) => setNewItem({ ...newItem, colorHex: e.target.value })}
                  className="w-full rounded-xl border border-white/80 bg-white/90 px-2 py-2 text-xs font-mono outline-none focus:border-lilac-deep"
                />
              </div>
            </div>

            <div className="sm:col-span-12">
              <label className="block font-bold text-foreground mb-1">Supplier / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Vardhman Premium, Ganga Soft, CraftSupplies Mumbai"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="clay rounded-full px-4 py-1.5 text-xs font-bold text-muted-foreground hover:bg-white/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-primary liquid-btn rounded-full px-5 py-1.5 text-xs font-bold shadow-md"
            >
              Save Supply Material
            </button>
          </div>
        </form>
      )}

      {/* Inventory Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const isLow = item.quantity <= item.minThreshold;

          return (
            <div
              key={item.id}
              className={`liquid-glass rounded-3xl p-5 border transition-all shadow-sm space-y-3 ${
                isLow ? "border-amber-300 bg-amber-50/20" : "border-white/70"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.colorHex ? (
                    <span
                      className="size-5 rounded-full ring-2 ring-white/80 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: item.colorHex }}
                    />
                  ) : (
                    <div className="size-5 rounded-full bg-lilac/30 flex items-center justify-center flex-shrink-0">
                      <Boxes className="size-3 text-lilac-deep" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4
                      className="font-display font-bold text-foreground text-xs truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove "${item.name}" from inventory?`)) {
                      deleteItem(item.id);
                    }
                  }}
                  className="text-muted-foreground hover:text-rose-600 transition-colors p-1"
                  title="Delete supply material"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Quantity Counter & Steppers */}
              <div className="rounded-2xl bg-white/70 p-3 border border-white/80 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`font-mono text-xl font-black ${isLow ? "text-amber-600" : "text-lilac-deep"}`}
                    >
                      {item.quantity}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{item.unit}</span>
                  </div>
                  {isLow && (
                    <span className="text-[10px] font-bold text-amber-700 inline-flex items-center gap-1">
                      <AlertCircle className="size-3 text-amber-600 inline shrink-0" />
                      <span>Low stock (min: {item.minThreshold})</span>
                    </span>
                  )}
                </div>

                {/* Steppers */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustQuantity(item.id, -5)}
                    className="clay rounded-lg size-7 text-[11px] font-bold text-muted-foreground hover:bg-white flex items-center justify-center shadow-xs"
                    title="Subtract 5"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQuantity(item.id, -1)}
                    className="clay rounded-lg size-7 text-xs font-bold text-muted-foreground hover:bg-white flex items-center justify-center shadow-xs"
                    title="Subtract 1"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQuantity(item.id, 1)}
                    className="clay rounded-lg size-7 text-xs font-bold text-lilac-deep hover:bg-white flex items-center justify-center shadow-xs"
                    title="Add 1"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustQuantity(item.id, 5)}
                    className="clay rounded-lg size-7 text-[11px] font-bold text-lilac-deep hover:bg-white flex items-center justify-center shadow-xs"
                    title="Add 5"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* Bottom Specs: Supplier & Cost */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-white/50">
                <span>{item.supplier || "In-house Supply"}</span>
                <span className="font-semibold text-foreground">
                  ₹{item.costPerUnit}/{item.unit.replace(/s$/, "")} · Total ₹
                  {(item.quantity * item.costPerUnit).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   REVIEWS & STORIES CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function ReviewsAdminSection() {
  const { reviews, addReview, updateReview, deleteReview, resetReviews } = useReviews();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const [newReview, setNewReview] = useState({
    handle: "",
    location: "",
    item: "",
    category: "doll" as ReviewItem["category"],
    rating: 5,
    tag: "Verified Order",
    text: "",
    isApproved: true,
    isFeatured: true,
  });

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchCat = filterCategory === "all" || r.category === filterCategory;
      const matchSearch =
        !searchQuery ||
        r.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [reviews, filterCategory, searchQuery]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 5;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(2);
  }, [reviews]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.handle.trim() || !newReview.text.trim()) {
      alert("Please provide at least a customer handle and review text.");
      return;
    }

    addReview({
      handle: newReview.handle.startsWith("@")
        ? newReview.handle.trim()
        : `@${newReview.handle.trim()}`,
      location: newReview.location.trim() || "India",
      item: newReview.item.trim() || "Handcrafted Crochet",
      category: newReview.category,
      rating: newReview.rating,
      tag: newReview.tag.trim() || "Verified Order",
      text: newReview.text.trim(),
      date: "Just now",
      isApproved: newReview.isApproved,
      isFeatured: newReview.isFeatured,
    });

    setNewReview({
      handle: "",
      location: "",
      item: "",
      category: "doll",
      rating: 5,
      tag: "Verified Order",
      text: "",
      isApproved: true,
      isFeatured: true,
    });
    setShowAddForm(false);
    setNotice("New review published! It now reflects live on the /reviews page.");
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">
            Customer Reviews &amp; Stories CMS
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage customer unboxing stories, feedback, and star testimonials displayed on the
            public Reviews page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/80 bg-white/80 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-white/80 bg-white/80 px-3 py-1.5 text-xs font-bold text-lilac-deep outline-none focus:border-lilac-deep"
          >
            <option value="all">All Categories ({reviews.length})</option>
            <option value="doll">Dolls</option>
            <option value="bouquet">Bouquets &amp; Flowers</option>
            <option value="plushie">Plushies</option>
            <option value="keychain">Keychains</option>
            <option value="misc">Bookmarks &amp; Misc</option>
          </select>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> {showAddForm ? "Close Form" : "Add Review"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-emerald-700" />
            <span>{notice}</span>
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-700">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-lilac-deep">{reviews.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Total Reviews
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
            {avgRating} <Star className="size-4 fill-amber-400 text-amber-400" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Average Rating
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-emerald-600">
            {reviews.filter((r) => r.isApproved).length}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Live / Approved
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-purple-600">
            {reviews.filter((r) => r.isFeatured).length}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Featured Reviews
          </p>
        </div>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="liquid-glass rounded-3xl p-6 border border-white/70 shadow-md space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/50">
            <h3 className="font-display text-sm font-bold text-lilac-deep">
              Add Customer Testimonial / Story
            </h3>
            <span className="text-[11px] text-muted-foreground">Will appear on /reviews</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">
                Customer Handle / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. @ananya_r or Ananya Sharma"
                value={newReview.handle}
                onChange={(e) => setNewReview({ ...newReview, handle: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Location / City</label>
              <input
                type="text"
                placeholder="e.g. Mumbai, Bengaluru, Delhi"
                value={newReview.location}
                onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Product Purchased</label>
              <input
                type="text"
                placeholder="e.g. Custom Anime Doll, Pastel Bouquet"
                value={newReview.item}
                onChange={(e) => setNewReview({ ...newReview, item: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Category</label>
              <select
                value={newReview.category}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    category: e.target.value as ReviewItem["category"],
                  })
                }
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-lilac-deep font-bold outline-none focus:border-lilac-deep"
              >
                <option value="doll">Doll</option>
                <option value="bouquet">Bouquet</option>
                <option value="plushie">Plushie</option>
                <option value="keychain">Keychain</option>
                <option value="misc">Bookmark / Misc</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Rating (1 to 5 Stars)</label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`size-5 ${
                        star <= newReview.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300 fill-slate-100"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-foreground">{newReview.rating} Stars</span>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Badge Tag</label>
              <input
                type="text"
                value={newReview.tag}
                onChange={(e) => setNewReview({ ...newReview, tag: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-12">
              <label className="block font-bold text-foreground mb-1">
                Review Experience &amp; Feedback *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Share what the customer loved about the custom stitching, packaging, or recipient's reaction..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full rounded-xl border border-white/80 bg-white/90 p-3 leading-relaxed outline-none focus:border-lilac-deep"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="clay rounded-full px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-primary liquid-btn rounded-full px-6 py-2 text-xs font-bold shadow-md"
            >
              Publish Customer Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Cards List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className={`liquid-glass rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-3 ${
              rev.isApproved ? "border-white/70" : "border-slate-300 opacity-70 bg-slate-50/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/40">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-xs text-foreground">{rev.handle}</span>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground bg-white/60 px-2 py-0.5 rounded-full">
                  {rev.location} · {rev.category}
                </span>
              </div>

              <div className="mt-2.5">
                <span className="font-bold text-[11px] text-lilac-deep block mb-1">
                  Ordered: {rev.item}
                </span>
                <p className="text-xs text-foreground/90 italic leading-relaxed">"{rev.text}"</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/40 text-[11px]">
              <span className="text-muted-foreground">{rev.date || "Verified patron"}</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateReview(rev.id, { isApproved: !rev.isApproved })}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                    rev.isApproved
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {rev.isApproved ? "Live" : "Hidden"}
                </button>

                <button
                  type="button"
                  onClick={() => updateReview(rev.id, { isFeatured: !rev.isFeatured })}
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] transition-all ${
                    rev.isFeatured
                      ? "bg-purple-100 text-purple-800"
                      : "bg-white/80 text-muted-foreground"
                  }`}
                >
                  {rev.isFeatured ? (
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-2.5 fill-purple-700 text-purple-700 inline" />
                      <span>Featured</span>
                    </span>
                  ) : (
                    "Standard"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete review from ${rev.handle}?`)) deleteReview(rev.id);
                  }}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                  title="Delete review"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   COUPONS & PROMOTIONS CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function CouponsAdminSection() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, resetCoupons } = useCoupons();
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderValue, setMinOrderValue] = useState("999");
  const [description, setDescription] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      alert("Please enter a valid coupon code (e.g. ROYAL20).");
      return;
    }

    addCoupon({
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue) || 0,
      minOrderValue: Number(minOrderValue) || 0,
      description:
        description.trim() ||
        `${discountValue}${discountType === "percentage" ? "%" : "₹"} discount on orders above ₹${minOrderValue}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    });

    setCode("");
    setDescription("");
    setShowAddForm(false);
    setNotice(
      `Coupon code "${cleanCode}" created! Customers can apply it at checkout immediately.`,
    );
    setTimeout(() => setNotice(null), 3500);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">
            Promotional Coupons &amp; Discounts CMS
          </h2>
          <p className="text-xs text-muted-foreground">
            Create discount codes, set percentage or flat rupee discounts, and define minimum order
            values for online checkout.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="clay-primary liquid-btn rounded-full px-4 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="size-3.5" /> {showAddForm ? "Close Form" : "Create Coupon"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5">
            <Crown className="size-3.5 text-emerald-700" />
            <span>{notice}</span>
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-700">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Add Coupon Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCoupon}
          className="liquid-glass rounded-3xl p-6 border border-white/70 shadow-md space-y-4 text-xs animate-in fade-in"
        >
          <div className="pb-3 border-b border-white/50">
            <h3 className="font-display text-sm font-bold text-lilac-deep">
              Create New Promotional Code
            </h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. ROYAL15"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 font-mono font-bold uppercase outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as Coupon["discountType"])}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 font-bold text-lilac-deep outline-none focus:border-lilac-deep"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="flat">Flat Rupee Discount (₹)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">
                Discount Value {discountType === "percentage" ? "(%)" : "(₹)"} *
              </label>
              <input
                type="number"
                required
                min={1}
                max={discountType === "percentage" ? 90 : 10000}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 font-bold outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-foreground mb-1">Minimum Cart Value (₹)</label>
              <input
                type="number"
                min={0}
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep"
              />
            </div>

            <div className="sm:col-span-8">
              <label className="block font-bold text-foreground mb-1">
                Description shown to customer
              </label>
              <input
                type="text"
                placeholder="e.g. 15% off bespoke bouquets on orders above ₹1,499"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 outline-none focus:border-lilac-deep"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="clay rounded-full px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="clay-primary liquid-btn rounded-full px-6 py-2 text-xs font-bold shadow-md"
            >
              Save &amp; Activate Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div
            key={c.code}
            className={`liquid-glass rounded-3xl p-5 border relative overflow-hidden transition-all flex flex-col justify-between space-y-4 ${
              c.isActive
                ? "border-white/70 shadow-sm"
                : "border-slate-300 opacity-60 bg-slate-50/50"
            }`}
          >
            {/* Ticket Notch Aesthetic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black bg-lilac-deep text-white px-3 py-1 rounded-xl shadow-sm">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="clay rounded-lg p-1 text-muted-foreground hover:text-lilac-deep"
                    title="Copy code"
                  >
                    <Copy className="size-3" />
                  </button>
                  {copiedCode === c.code && (
                    <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => updateCoupon(c.code, { isActive: !c.isActive })}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {c.isActive ? "Active" : "Disabled"}
                </button>
              </div>

              <div>
                <span className="font-extrabold text-sm text-foreground block">
                  {c.discountType === "percentage"
                    ? `${c.discountValue}% OFF`
                    : `₹${c.discountValue} FLAT OFF`}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground">
                Min. Order:{" "}
                <strong className="text-foreground">
                  ₹{c.minOrderValue.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="pt-3 border-t border-white/50 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Ready at Checkout
              </span>
              <button
                onClick={() => {
                  if (confirm(`Delete coupon code "${c.code}"?`)) deleteCoupon(c.code);
                }}
                className="text-rose-500 hover:text-rose-700 p-1"
                title="Delete coupon"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CUSTOMERS & PATRONS CRM COMPONENT
   ───────────────────────────────────────────────────────────── */
function CustomersAdminSection({ orders }: { orders: DbOrder[] }) {
  const [search, setSearch] = useState("");

  const patrons = useMemo(() => {
    const patronMap: Record<
      string,
      {
        name: string;
        phone: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string;
        address: string;
        pincode: string;
        recentItems: string[];
      }
    > = {};

    orders.forEach((ord) => {
      const cleanPhone = ord.phone ? ord.phone.replace(/[^\d]/g, "") : "";
      const key = cleanPhone || ord.customer_name.trim().toLowerCase();

      if (!patronMap[key]) {
        patronMap[key] = {
          name: ord.customer_name,
          phone: ord.phone,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: ord.created_at,
          address: ord.address,
          pincode: ord.pincode,
          recentItems: [],
        };
      }

      patronMap[key]!.totalOrders += 1;
      patronMap[key]!.totalSpent += ord.amount_total || 0;

      if (new Date(ord.created_at) > new Date(patronMap[key]!.lastOrderDate)) {
        patronMap[key]!.lastOrderDate = ord.created_at;
        patronMap[key]!.address = ord.address;
        patronMap[key]!.pincode = ord.pincode;
      }

      (ord.order_items || []).forEach((item) => {
        const patron = patronMap[key];
        if (patron && !patron.recentItems.includes(item.product_name)) {
          patron.recentItems.push(item.product_name);
        }
      });
    });

    return Object.values(patronMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredPatrons = useMemo(() => {
    if (!search) return patrons;
    const s = search.toLowerCase();
    return patrons.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.phone.includes(s) ||
        p.address.toLowerCase().includes(s) ||
        p.pincode.includes(s),
    );
  }, [patrons, search]);

  const repeatPatrons = patrons.filter((p) => p.totalOrders > 1);
  const totalLTV = patrons.reduce((acc, curr) => acc + curr.totalSpent, 0);
  const avgLTV = patrons.length > 0 ? Math.round(totalLTV / patrons.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass rounded-3xl p-5 border border-white/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">
            Patrons &amp; Customer CRM
          </h2>
          <p className="text-xs text-muted-foreground">
            Customer profiles aggregated across all workshop orders, with lifetime value and 1-click
            VIP WhatsApp messaging.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search patron by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/80 bg-white/80 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-lilac-deep"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-lilac-deep">{patrons.length}</span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Unique Patrons
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-purple-600">
            {repeatPatrons.length}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Repeat Patrons (
            {patrons.length > 0 ? Math.round((repeatPatrons.length / patrons.length) * 100) : 0}%)
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-emerald-600">
            ₹{avgLTV.toLocaleString("en-IN")}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Avg Customer LTV
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-4 border border-white/60 text-center">
          <span className="font-display text-2xl font-black text-amber-500">
            {patrons.length > 0 && patrons[0]
              ? `₹${patrons[0].totalSpent.toLocaleString("en-IN")}`
              : "₹0"}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
            Top Patron Spend
          </p>
        </div>
      </div>

      {/* Patron Directory Cards */}
      {filteredPatrons.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-8 text-center text-xs text-muted-foreground">
          No customer records match your search query.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPatrons.map((patron, i) => {
            let phoneClean = patron.phone.replace(/[^\d]/g, "");
            if (phoneClean.length === 10) phoneClean = `91${phoneClean}`;

            const vipMsg = encodeURIComponent(
              `Hello ${patron.name}!\nThis is Inventive Queen atelier. Thank you for being one of our cherished patrons (${patron.totalOrders} royal orders)! We are handcrafting new seasonal designs and wanted to offer you an exclusive preview.`,
            );
            const waUrl = `https://wa.me/${phoneClean}?text=${vipMsg}`;

            return (
              <div
                key={i}
                className="liquid-glass rounded-3xl p-5 border border-white/60 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/40">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-full bg-lilac-deep text-white font-black text-sm flex items-center justify-center shadow-sm">
                        {patron.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-foreground">{patron.name}</h4>
                        <p className="text-[10px] text-muted-foreground">+91 {patron.phone}</p>
                      </div>
                    </div>

                    {patron.totalOrders > 1 && (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Crown className="size-2.5 text-purple-700" /> VIP Patron
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-2xl bg-white/60 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Total Spend</span>
                      <span className="font-extrabold text-emerald-700">
                        ₹{patron.totalSpent.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Orders Placed</span>
                      <span className="font-extrabold text-foreground">
                        {patron.totalOrders} {patron.totalOrders === 1 ? "order" : "orders"}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1 text-muted-foreground">
                    <p className="line-clamp-2 leading-relaxed">
                      <strong className="text-foreground">Address:</strong> {patron.address} (PIN:{" "}
                      {patron.pincode})
                    </p>
                    {patron.recentItems.length > 0 && (
                      <p className="line-clamp-1 pt-1">
                        <strong className="text-foreground">Creations:</strong>{" "}
                        {patron.recentItems.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/40 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Last:{" "}
                    {new Date(patron.lastOrderDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay rounded-full px-3 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 inline-flex items-center gap-1 shadow-sm"
                  >
                    <MessageCircle className="size-3" /> VIP WhatsApp
                  </a>
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
   STORE & ANNOUNCEMENT CMS COMPONENT
   ───────────────────────────────────────────────────────────── */
function StoreSettingsAdminSection() {
  const { settings, updateSettings, resetSettings } = useStoreSettings();
  const [draft, setDraft] = useState(settings);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(draft);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 border border-white/60 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/50">
        <div>
          <h2 className="font-display text-xl font-bold text-lilac-deep">
            Store &amp; Announcement CMS
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage the global website announcement banner, store order acceptance, and customer
            service details live.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetSettings}
            className="clay rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="clay-primary liquid-btn rounded-full px-5 py-2 text-xs font-bold shadow-md inline-flex items-center gap-1.5"
          >
            <Save className="size-3.5" /> Save Banner &amp; Settings
          </button>
        </div>
      </div>

      {savedMsg && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-600" />
          Store settings updated live! Customers immediately see the updated announcement banner
          across the site.
        </div>
      )}

      {/* Live Announcement Banner Preview */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Live Top Announcement Banner Preview
        </label>
        <div className="relative overflow-hidden bg-lilac-deep text-white rounded-2xl p-3 text-center text-xs shadow-md">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {draft.announcementBadge && (
              <span className="skeu-badge text-[10px]">{draft.announcementBadge}</span>
            )}
            <span className="font-medium">{draft.announcementText}</span>
            {draft.announcementLink && (
              <span className="font-semibold underline underline-offset-4 cursor-pointer">
                {draft.announcementLinkLabel || "How to order →"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4 sm:grid-cols-12 text-xs">
        {/* Announcement Text */}
        <div className="sm:col-span-8">
          <label className="block font-bold text-foreground mb-1">Announcement Message</label>
          <input
            type="text"
            value={draft.announcementText}
            onChange={(e) => setDraft({ ...draft, announcementText: e.target.value })}
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep font-medium"
          />
        </div>

        {/* Announcement Badge */}
        <div className="sm:col-span-4">
          <label className="block font-bold text-foreground mb-1">Badge Text</label>
          <input
            type="text"
            placeholder="e.g. Limited slots"
            value={draft.announcementBadge}
            onChange={(e) => setDraft({ ...draft, announcementBadge: e.target.value })}
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
          />
        </div>

        {/* Link URL */}
        <div className="sm:col-span-6">
          <label className="block font-bold text-foreground mb-1">Link Destination</label>
          <input
            type="text"
            placeholder="e.g. /how-to-order or /dolls"
            value={draft.announcementLink}
            onChange={(e) => setDraft({ ...draft, announcementLink: e.target.value })}
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
          />
        </div>

        {/* Link Label */}
        <div className="sm:col-span-6">
          <label className="block font-bold text-foreground mb-1">Link Action Label</label>
          <input
            type="text"
            placeholder="e.g. How to order →"
            value={draft.announcementLinkLabel}
            onChange={(e) => setDraft({ ...draft, announcementLinkLabel: e.target.value })}
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
          />
        </div>

        {/* Store Order Acceptance Toggle */}
        <div className="sm:col-span-12 rounded-2xl bg-white/60 p-4 border border-white/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-foreground text-sm">Store Checkout Acceptance Status</h4>
            <p className="text-muted-foreground text-xs mt-0.5">
              Toggle whether the website is currently accepting new orders or in temporary holiday
              craft pause.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDraft({ ...draft, isStoreOpen: !draft.isStoreOpen })}
            className={`rounded-full px-4 py-2 text-xs font-black transition-all ${
              draft.isStoreOpen
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-rose-500 text-white shadow-md"
            }`}
          >
            {draft.isStoreOpen ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-200 animate-pulse inline-block" />
                <span>Orders OPEN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-200 inline-block" />
                <span>Orders PAUSED / CLOSED</span>
              </span>
            )}
          </button>
        </div>

        {/* Free Shipping Threshold */}
        <div className="sm:col-span-6">
          <label className="block font-bold text-foreground mb-1">
            Free Delivery Threshold (₹)
          </label>
          <input
            type="number"
            value={draft.freeShippingThreshold}
            onChange={(e) =>
              setDraft({ ...draft, freeShippingThreshold: Number(e.target.value) || 0 })
            }
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep"
          />
        </div>

        {/* WhatsApp Support Number */}
        <div className="sm:col-span-6">
          <label className="block font-bold text-foreground mb-1">
            WhatsApp Concierge Support Number
          </label>
          <input
            type="text"
            placeholder="e.g. 919876543210"
            value={draft.supportPhone}
            onChange={(e) => setDraft({ ...draft, supportPhone: e.target.value })}
            className="w-full rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs outline-none focus:border-lilac-deep font-mono"
          />
        </div>
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
        <h2 className="font-display text-xl font-bold text-lilac-deep">
          Admin Settings &amp; Security
        </h2>
        <p className="text-xs text-muted-foreground">
          Configuration, access control, and diagnostic indicators for the Inventive Queen realm.
        </p>
      </div>

      <div className="rounded-2xl bg-white/60 p-4 border border-white/70 space-y-3 text-xs">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="size-4 text-lilac-deep" />
          <span>Royal Admin Permissions</span>
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Admin authorization is managed in the Supabase table{" "}
          <code className="font-mono bg-white px-1.5 py-0.5 rounded text-lilac-deep border border-slate-200">
            admin_users
          </code>
          . User IDs registered in this table gain access to this executive CMS portal.
        </p>
        <p className="text-muted-foreground">
          Currently signed in as: <strong className="text-foreground">{userEmail}</strong>
        </p>
      </div>

      <div className="rounded-2xl bg-white/60 p-4 border border-white/70 space-y-2 text-xs">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <IndianRupee className="size-4 text-emerald-600" />
          Razorpay Gateway Status
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          Customer checkout uses the official Razorpay Checkout SDK with real-time payment capture
          and order tracking.
        </p>
        <div className="pt-2 flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-700 font-bold">
            Razorpay Integration Active &amp; Verified
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-white/60 p-4 border border-white/70 space-y-2 text-xs">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <Package className="size-4 text-purple-600" />
          Supabase Database &amp; Storage Status
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {isSupabaseConfigured
            ? "Supabase is actively connected. Real-time orders, customer addresses, and product catalog sync seamlessly."
            : "Running in local storage fallback mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for live cloud persistence."}
        </p>
        <div className="pt-2 flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              isSupabaseConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="font-mono text-[11px] text-foreground font-bold">
            {isSupabaseConfigured ? "Cloud Database Connected" : "Local Storage Mode"}
          </span>
        </div>
      </div>
    </div>
  );
}
