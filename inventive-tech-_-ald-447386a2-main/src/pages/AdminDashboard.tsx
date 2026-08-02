import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Eye,
  EyeOff,
  ArrowDown,
  ArrowUp,
  ImagePlus,
  IndianRupee,
  Package,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  BadgePercent,
  Lock,
  Unlock,
  Trash2,
  X,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/admin/StatCard";
import { useAuth } from "@/lib/auth";
import { categories, type Product, type ProductType } from "@/lib/products";
import { useProducts } from "@/lib/cms-products";
import { isSupabaseConfigured, supabase, type DbOrder, type OrderStatus } from "@/lib/supabase";
import { calculateDiscountPercent, formatPrice, parsePriceValue } from "@/lib/product-display";

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

const productTypes: ProductType[] = ["keychain", "bouquet", "doll"];
const MAX_PRODUCT_IMAGES = 10;

interface ProductDraft {
  id: string;
  name: string;
  price: string;
  originalPrice: string;
  sellingPrice: string;
  discountPercent: string;
  type: ProductType;
  tagline: string;
  description: string;
  imagesText: string;
  isNewArrival: boolean;
  newArrivalDays: string;
  newArrivalStartedAt: string | null;
  isActive: boolean;
  sortOrder: number;
  isCmsProduct: boolean;
  isNew?: boolean;
  isIdLocked: boolean;
  colors?: Product["colors"];
  flowers?: Product["flowers"];
  flowerColors?: Product["flowerColors"];
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function imageLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((image) => image.trim())
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_IMAGES);
}

function formatPercent(value: number) {
  return value > 0 ? String(value) : "";
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
    discountPercent: formatPercent(product.discountPercent ?? calculatedDiscount),
    type: product.type,
    tagline: product.tagline,
    description: product.description,
    imagesText: product.images.slice(0, MAX_PRODUCT_IMAGES).join("\n"),
    isNewArrival: Boolean(product.isNewArrival),
    newArrivalDays: String(product.newArrivalDays ?? 30),
    newArrivalStartedAt: product.newArrivalStartedAt ?? null,
    isActive: product.isActive !== false,
    sortOrder: product.sortOrder ?? 0,
    isCmsProduct: Boolean(product.isCmsProduct),
    isIdLocked: true,
    colors: product.colors,
    flowers: product.flowers,
    flowerColors: product.flowerColors,
  };
}

function draftToProduct(draft: ProductDraft): Product {
  const sellingPrice = draft.sellingPrice.trim() || draft.price.trim();
  const originalPrice = draft.originalPrice.trim();
  const discountPercent = Number(draft.discountPercent);
  const newArrivalDays = Number(draft.newArrivalDays);

  return {
    id: draft.id.trim() || makeSlug(draft.name),
    name: draft.name.trim(),
    price: sellingPrice,
    originalPrice: originalPrice || undefined,
    sellingPrice,
    discountPercent: Number.isFinite(discountPercent) && discountPercent > 0 ? discountPercent : undefined,
    type: draft.type,
    tagline: draft.tagline.trim(),
    description: draft.description.trim(),
    images: imageLines(draft.imagesText),
    isNewArrival: draft.isNewArrival,
    newArrivalDays: Number.isFinite(newArrivalDays) && newArrivalDays > 0 ? newArrivalDays : 30,
    newArrivalStartedAt: draft.isNewArrival ? draft.newArrivalStartedAt ?? new Date().toISOString() : null,
    colors: draft.colors,
    flowers: draft.flowers,
    flowerColors: draft.flowerColors,
    isActive: draft.isActive,
    sortOrder: Number.isFinite(Number(draft.sortOrder)) ? Number(draft.sortOrder) : 0,
  };
}

function newProductDraft(id = ""): ProductDraft {
  return {
    id,
    name: "New Product",
    price: "Rs. 199",
    originalPrice: "",
    sellingPrice: "Rs. 199",
    discountPercent: "",
    type: "keychain",
    tagline: "Handmade with love",
    description: "Add the product description here.",
    imagesText: "",
    isNewArrival: false,
    newArrivalDays: "30",
    newArrivalStartedAt: null,
    isActive: true,
    sortOrder: 99,
    isCmsProduct: false,
    isNew: true,
    isIdLocked: true,
  };
}

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
                    {order.customer_name} - {order.phone} - {order.pincode}
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
                        <img src={item.image_url} alt={item.product_name} className="w-14 h-14 rounded-xl object-contain bg-white" />
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
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setDrafts(adminProducts.map(toDraft));
  }, [adminProducts]);

  const updateDraft = (id: string, patch: Partial<ProductDraft>) => {
    setDrafts((current) => current.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft)));
  };

  const updateDraftByKey = (draftKey: string, patch: Partial<ProductDraft>) => {
    setDrafts((current) => current.map((draft) => (draft.id === draftKey ? { ...draft, ...patch } : draft)));
  };

  const updatePricingDraft = (id: string, field: "originalPrice" | "sellingPrice" | "discountPercent", value: string) => {
    setDrafts((current) =>
      current.map((draft) => {
        if (draft.id !== id) return draft;
        const next = { ...draft, [field]: value };
        const original = parsePriceValue(next.originalPrice);
        const selling = parsePriceValue(next.sellingPrice);

        if (field === "discountPercent") {
          const percent = Math.max(0, Math.min(99, Number(value) || 0));
          next.discountPercent = percent > 0 ? String(percent) : "";
          if (original > 0 && percent > 0) {
            next.sellingPrice = formatPrice(Math.max(1, Math.round(original - (original * percent) / 100)));
          }
        } else {
          next.discountPercent = formatPercent(calculateDiscountPercent(next.originalPrice, next.sellingPrice));
        }

        next.price = next.sellingPrice || (selling > 0 ? formatPrice(selling) : draft.price);
        return next;
      })
    );
  };

  const handleAddProduct = async () => {
    setSavingId("new-product");
    setNotice("");
    try {
      const id = await generateProductId("keychain");
      setDrafts((current) => [newProductDraft(id), ...current]);
    } catch (idError) {
      const fallbackId = `IQ-KCH-${Date.now().toString().slice(-3)}`;
      setDrafts((current) => [newProductDraft(fallbackId), ...current]);
      setNotice(idError instanceof Error ? idError.message : "Could not reserve a product ID. Using a temporary ID.");
    } finally {
      setSavingId("");
    }
  };

  const handleTypeChange = async (draft: ProductDraft, type: ProductType) => {
    updateDraft(draft.id, { type });
    if (!draft.isNew || !draft.isIdLocked) return;

    setSavingId(draft.id);
    try {
      const nextId = await generateProductId(type);
      updateDraftByKey(draft.id, { id: nextId, type });
    } catch (idError) {
      setNotice(idError instanceof Error ? idError.message : "Could not reserve product ID for that category.");
    } finally {
      setSavingId("");
    }
  };

  const handleSave = async (draft: ProductDraft) => {
    const product = draftToProduct(draft);
    if (!product.id || !product.name || !product.price || !product.description) {
      setNotice("Please fill product id, name, selling price, and description before saving.");
      return;
    }
    if (product.images.length === 0 && product.isActive !== false) {
      setNotice("Add at least one image URL or upload an image before making the product visible.");
      return;
    }

    setSavingId(draft.id);
    try {
      await saveProduct(product);
      setNotice(`Saved ${product.name}.`);
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : "Could not save product.");
    } finally {
      setSavingId("");
    }
  };

  const handleToggleActive = async (draft: ProductDraft) => {
    await handleSave({ ...draft, isActive: !draft.isActive });
  };

  const handleDelete = async (draft: ProductDraft) => {
    if (draft.isNew) {
      setDrafts((current) => current.filter((item) => item.id !== draft.id));
      return;
    }
    if (!draft.isCmsProduct) {
      setNotice("This starter product has no CMS row yet. Use Hide if you do not want it visible.");
      return;
    }

    setSavingId(draft.id);
    try {
      await deleteProduct(draft.id);
      setNotice(`Deleted CMS override for ${draft.name}.`);
    } catch (deleteError) {
      setNotice(deleteError instanceof Error ? deleteError.message : "Could not delete product.");
    } finally {
      setSavingId("");
    }
  };

  const setImages = (draft: ProductDraft, images: string[]) => {
    updateDraft(draft.id, { imagesText: images.filter(Boolean).slice(0, MAX_PRODUCT_IMAGES).join("\n") });
  };

  const moveImage = (draft: ProductDraft, index: number, direction: -1 | 1) => {
    const images = imageLines(draft.imagesText);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= images.length) return;
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    setImages(draft, images);
  };

  const removeImage = (draft: ProductDraft, index: number) => {
    setImages(draft, imageLines(draft.imagesText).filter((_, imageIndex) => imageIndex !== index));
  };

  const handleUpload = async (draft: ProductDraft, files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []).slice(0, MAX_PRODUCT_IMAGES - imageLines(draft.imagesText).length);
    if (selectedFiles.length === 0) return;
    setSavingId(draft.id);
    try {
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        uploadedUrls.push(await uploadProductImage(draft.id || makeSlug(draft.name), file));
      }
      setImages(draft, [...imageLines(draft.imagesText), ...uploadedUrls]);
      setNotice("Image uploaded. Save the product to use it on the website.");
    } catch (uploadError) {
      setNotice(uploadError instanceof Error ? uploadError.message : "Could not upload image.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section className="bg-card rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-foreground">Products CMS</h2>
          <p className="text-sm text-muted-foreground">
            Edit product names, IDs, prices, badges, photos, descriptions, visibility, and add new items.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={refreshProducts} disabled={loading}>
            <RefreshCw size={15} />
            Refresh
          </Button>
          <Button className="rounded-xl" onClick={handleAddProduct} disabled={savingId === "new-product"}>
            <Plus size={15} />
            {savingId === "new-product" ? "Creating..." : "Add Product"}
          </Button>
        </div>
      </div>

      {(notice || error) && (
        <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
          {notice || error}
        </div>
      )}

      <div className="space-y-4">
        {drafts.map((draft) => {
          const images = imageLines(draft.imagesText);
          const imagePreview = images[0];
          const category = categories.find((item) => item.slug === draft.type);
          const discount = Number(draft.discountPercent) || 0;

          return (
            <article key={draft.id} className="rounded-2xl border border-border/60 bg-background p-4">
              <div className="grid lg:grid-cols-[220px_1fr] gap-4">
                <div className="space-y-3">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-border/60 relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt={draft.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImagePlus className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                      {draft.isNewArrival && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-semibold">
                          <Sparkles size={11} /> NEW
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-semibold">
                          <BadgePercent size={11} /> {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  <label className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-body font-medium text-foreground hover:bg-brand-blush/20 cursor-pointer transition-colors">
                    <ImagePlus size={15} />
                    Upload Images
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleUpload(draft, event.target.files)} />
                  </label>
                  {images.length > 0 && (
                    <div className="space-y-2">
                      {images.map((image, index) => (
                        <div key={`${image}-${index}`} className="flex items-center gap-2 rounded-xl border border-border/60 bg-card p-2">
                          <img src={image} alt={`${draft.name} ${index + 1}`} className="w-10 h-10 rounded-lg object-contain bg-white" />
                          <span className="text-xs text-muted-foreground flex-1 truncate">{index === 0 ? "Thumbnail" : `Image ${index + 1}`}</span>
                          <button type="button" onClick={() => moveImage(draft, index, -1)} className="p-1 text-muted-foreground hover:text-primary" aria-label="Move image up"><ArrowUp size={14} /></button>
                          <button type="button" onClick={() => moveImage(draft, index, 1)} className="p-1 text-muted-foreground hover:text-primary" aria-label="Move image down"><ArrowDown size={14} /></button>
                          <button type="button" onClick={() => removeImage(draft, index)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove image"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Product ID</label>
                      <div className="flex gap-2">
                        <input
                          value={draft.id}
                          disabled={draft.isIdLocked}
                          onChange={(event) => updateDraft(draft.id, { id: event.target.value.trim() })}
                          className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground disabled:bg-secondary/50 disabled:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <Button type="button" variant="outline" className="rounded-xl shrink-0" onClick={() => updateDraft(draft.id, { isIdLocked: !draft.isIdLocked })} title={draft.isIdLocked ? "Unlock product ID" : "Lock product ID"}>
                          {draft.isIdLocked ? <Lock size={15} /> : <Unlock size={15} />}
                        </Button>
                      </div>
                    </div>
                    <AdminInput label="Name" value={draft.name} onChange={(value) => updateDraft(draft.id, { name: value })} />
                    <AdminInput label="Original Price" value={draft.originalPrice} onChange={(value) => updatePricingDraft(draft.id, "originalPrice", value)} />
                    <AdminInput label="Selling Price" value={draft.sellingPrice} onChange={(value) => updatePricingDraft(draft.id, "sellingPrice", value)} />
                    <AdminInput label="Discount %" value={draft.discountPercent} onChange={(value) => updatePricingDraft(draft.id, "discountPercent", value)} />
                    <div className="space-y-2">
                      <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Category</label>
                      <select value={draft.type} onChange={(event) => handleTypeChange(draft, event.target.value as ProductType)} className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                        {productTypes.map((type) => (
                          <option key={type} value={type}>{categories.find((item) => item.slug === type)?.title ?? type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-card p-3">
                    <label className="inline-flex items-center gap-2 text-sm font-body font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={draft.isNewArrival}
                        onChange={(event) => updateDraft(draft.id, {
                          isNewArrival: event.target.checked,
                          newArrivalStartedAt: event.target.checked ? draft.newArrivalStartedAt ?? new Date().toISOString() : null,
                        })}
                        className="accent-primary"
                      />
                      <Sparkles size={15} className="text-primary" />
                      Mark as New Arrival
                    </label>
                    <AdminInput label="New Badge Days" value={draft.newArrivalDays} onChange={(value) => updateDraft(draft.id, { newArrivalDays: value })} />
                  </div>

                  <AdminInput label="Tagline" value={draft.tagline} onChange={(value) => updateDraft(draft.id, { tagline: value })} />
                  <AdminTextarea label="Description" value={draft.description} rows={3} onChange={(value) => updateDraft(draft.id, { description: value })} />
                  <AdminTextarea label={`Image URLs (${images.length}/${MAX_PRODUCT_IMAGES})`} value={draft.imagesText} rows={3} onChange={(value) => updateDraft(draft.id, { imagesText: imageLines(value).join("\n") })} />

                  <div className="rounded-2xl bg-secondary/40 px-4 py-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-body font-semibold text-foreground">Preview:</span>
                    {draft.originalPrice && discount > 0 && <span className="text-muted-foreground line-through">{formatPrice(draft.originalPrice)}</span>}
                    <span className="font-display text-lg text-primary font-bold">{formatPrice(draft.sellingPrice || draft.price)}</span>
                    {discount > 0 && <span className="text-xs font-semibold text-primary">{discount}% off</span>}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-secondary px-2.5 py-1 capitalize">{category?.title ?? draft.type}</span>
                      <label className="inline-flex items-center gap-2 rounded-full bg-secondary px-2.5 py-1">
                        <input type="checkbox" checked={draft.isActive} onChange={(event) => updateDraft(draft.id, { isActive: event.target.checked })} className="accent-primary" />
                        Visible
                      </label>
                      <label className="inline-flex items-center gap-2">
                        Sort
                        <input type="number" value={draft.sortOrder} onChange={(event) => updateDraft(draft.id, { sortOrder: Number(event.target.value) })} className="w-20 rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground" />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleToggleActive(draft)} disabled={savingId === draft.id}>
                        {draft.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                        {draft.isActive ? "Hide" : "Show"}
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleDelete(draft)} disabled={savingId === draft.id || (!draft.isCmsProduct && !draft.isNew)}>
                        <Trash2 size={14} />
                        {draft.isNew ? "Remove" : "Delete CMS"}
                      </Button>
                      <Button size="sm" className="rounded-xl" onClick={() => handleSave(draft)} disabled={savingId === draft.id}>
                        <Save size={14} />
                        {savingId === draft.id ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
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
        Product content is editable from the Products section. Saved CMS edits live in Supabase and override the
        built-in starter catalog automatically.
      </p>
    </section>
  );
}

function AdminInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

function AdminTextarea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="font-body text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </label>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
      />
    </div>
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






