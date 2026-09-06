import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  ExternalLink,
  Gift,
  Heart,
  HelpCircle,
  Maximize2,
  MessageCircle,
  Minus,
  Palette,
  Plus,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { products as fallbackProducts, type Product, type ProductType } from "@/lib/products";
import { useProducts } from "@/lib/cms-products";
import { addToCart, parsePrice } from "@/lib/cart";

export const Route = createFileRoute("/product/$productId")({
  component: ProductDetailsPage,
});

const CATEGORY_META: Record<
  ProductType,
  { label: string; href: string; tag: string; description: string }
> = {
  doll: {
    label: "Crochet Dolls",
    href: "/dolls",
    tag: "Custom Keepsake Doll",
    description: "Detailed amigurumi doll created from soft milk cotton yarn, fully customizable to your reference photo.",
  },
  bouquet: {
    label: "Forever Flowers",
    href: "/flowers",
    tag: "Everlasting Crochet Bouquet",
    description: "Hand-stitched eternal flower arrangement wrapped in delicate frosted wrap with satin ribbons.",
  },
  plushie: {
    label: "Characters & Plushies",
    href: "/characters",
    tag: "Artisanal Plush Companion",
    description: "Handmade cuddly animal plushie or mascot, crafted stitch by stitch with plush yarn.",
  },
  keychain: {
    label: "Charms & Keychains",
    href: "/characters",
    tag: "Miniature Crochet Charm",
    description: "Pocket-sized crochet charm fitted with a durable metal clasp, perfect for backpacks, car keys and gifts.",
  },
  misc: {
    label: "Handcrafted Keepsakes",
    href: "/dolls",
    tag: "Unique Keepsake",
    description: "One-of-a-kind handcrafted crochet piece designed to bring warmth and joy.",
  },
};

function ProductDetailsPage() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const { products: cmsProducts } = useProducts();

  // Combine products
  const allProducts = useMemo(() => {
    return cmsProducts.length > 0 ? cmsProducts : fallbackProducts;
  }, [cmsProducts]);

  // Resilient product matching: exact id -> slug -> fallback list -> fuzzy match
  const product: Product | undefined = useMemo(() => {
    if (!productId) return undefined;
    const cleanId = decodeURIComponent(productId).toLowerCase().trim();

    // 1. Exact ID
    let found = allProducts.find((p) => p.id.toLowerCase() === cleanId);
    if (found) return found;

    // 2. Slug match
    found = allProducts.find((p) => {
      const slug = p.name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
      return slug === cleanId;
    });
    if (found) return found;

    // 3. Check fallback catalogue directly
    found = fallbackProducts.find((p) => p.id.toLowerCase() === cleanId);
    if (found) return found;

    found = fallbackProducts.find((p) => {
      const slug = p.name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
      return slug === cleanId;
    });
    if (found) return found;

    // 4. Substring / name matching
    return allProducts.find(
      (p) =>
        p.id.toLowerCase().includes(cleanId) ||
        cleanId.includes(p.id.toLowerCase()) ||
        p.name.toLowerCase().includes(cleanId),
    );
  }, [allProducts, productId]);

  // Images array
  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    return [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState("");
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "custom" | "care" | "shipping">("details");

  // Reset image index when switching products
  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setAdded(false);
  }, [productId]);

  // Pricing calculations
  const displayPrice = product?.sellingPrice || product?.price || "₹1,499";
  const numPrice = parsePrice(displayPrice);
  const originalPrice = product?.originalPrice;
  const discountPercent = product?.discountPercent;
  const totalPrice = numPrice * quantity;

  // Category metadata
  const catMeta = product?.type ? CATEGORY_META[product.type] : CATEGORY_META.doll;

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameType = allProducts.filter((p) => p.id !== product.id && p.type === product.type);
    if (sameType.length >= 3) return sameType.slice(0, 4);
    const otherProducts = allProducts.filter((p) => p.id !== product.id && p.type !== product.type);
    return [...sameType, ...otherProducts].slice(0, 4);
  }, [allProducts, product]);

  // Cart actions
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: displayPrice,
        numericPrice: numPrice || 999,
        image: images[0] || "",
        note: customNote.trim() || undefined,
      },
      quantity,
    );
    setAdded(true);
    toast.success("Added to your royal basket!", {
      description: `${quantity}× ${product.name}`,
    });
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: displayPrice,
        numericPrice: numPrice || 999,
        image: images[0] || "",
        note: customNote.trim() || undefined,
      },
      quantity,
    );
    navigate({ to: "/checkout" });
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Product link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const text = encodeURIComponent(
      `Hello Inventive Queen! 👑\nI am interested in ordering / customizing the "${product.name}" (${displayPrice}).\n${
        customNote ? `My notes: ${customNote}\n` : ""
      }Could you please share details on crafting time and custom reference options?`,
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  };

  // 404 State if product wasn't found
  if (!product) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="liquid-glass mx-auto max-w-md rounded-3xl p-8 shadow-xl">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
              <Crown className="size-8" />
            </div>
            <h1 className="sheen-text font-display text-2xl font-extrabold text-lilac-deep">
              Product Not Found
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We couldn't locate the handcrafted item you're searching for. It may have been updated or retired.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dolls"
                className="clay-primary liquid-btn w-full sm:w-auto rounded-full px-6 py-2.5 text-sm font-bold text-center"
              >
                Browse Dolls
              </Link>
              <Link
                to="/flowers"
                className="clay w-full sm:w-auto rounded-full px-6 py-2.5 text-sm font-bold text-lilac-deep text-center"
              >
                Browse Flowers
              </Link>
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const currentImage = images[activeImageIndex] || images[0];

  return (
    <SiteLayout>
      <div className="min-h-screen pb-28 lg:pb-16">
        {/* ── Breadcrumb & Top Bar ── */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to={catMeta.href} className="hover:text-primary transition-colors">
                {catMeta.label}
              </Link>
              <span>/</span>
              <span className="font-bold text-foreground truncate max-w-[180px] sm:max-w-xs">
                {product.name}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-lilac-deep hover:bg-white/60 transition-all cursor-pointer"
                title="Share product"
              >
                {copiedLink ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
              <Link
                to={catMeta.href}
                className="liquid-glass inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to {catMeta.label}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main Product Showcase ── */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            {/* ── Left Column: Media Gallery ── */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-4">
              {/* Main Image Frame */}
              <div className="liquid-glass relative overflow-hidden rounded-[2.5rem] p-3 shadow-2xl border border-white/60 bg-white/40">
                <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-purple-50/50 to-pink-50/50 group">
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <span className="skeu-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold shadow-lg">
                        <Sparkles className="size-3.5 text-amber-500" />
                        <span>{product.badge}</span>
                      </span>
                    </div>
                  )}

                  {discountPercent && discountPercent > 0 ? (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {discountPercent}% OFF
                      </span>
                    </div>
                  ) : null}

                  {/* Main Display Image */}
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                    onClick={() => setIsZoomOpen(true)}
                  />

                  {/* Hover Shine */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Expand button */}
                  <button
                    type="button"
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute bottom-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 text-foreground shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Expand photo"
                  >
                    <Maximize2 className="size-4" />
                  </button>

                  {/* Multi-image Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 text-foreground shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer"
                        title="Previous photo"
                      >
                        <ChevronLeft className="size-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-10 items-center justify-center rounded-full bg-white/80 text-foreground shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-110 active:scale-95 cursor-pointer"
                        title="Next photo"
                      >
                        <ChevronRight className="size-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative flex-shrink-0 size-20 sm:size-24 rounded-2xl overflow-hidden p-1 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "ring-3 ring-primary shadow-lg scale-105 bg-primary/10"
                          : "opacity-70 hover:opacity-100 hover:scale-102 bg-white/40 border border-white/60"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        className="size-full rounded-xl object-cover"
                      />
                    </button>
                  ))}
                  <div className="ml-auto text-xs font-bold text-muted-foreground px-2">
                    {activeImageIndex + 1} of {images.length} photos
                  </div>
                </div>
              )}

              {/* Visual Guarantee Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="liquid-glass rounded-2xl p-3 text-center">
                  <Palette className="size-5 mx-auto text-primary mb-1" />
                  <p className="font-bold text-xs text-lilac-deep">100% Handcrafted</p>
                  <p className="text-[10px] text-muted-foreground">Premium cotton yarn</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3 text-center">
                  <Crown className="size-5 mx-auto text-amber-500 mb-1" />
                  <p className="font-bold text-xs text-lilac-deep">Custom Made</p>
                  <p className="text-[10px] text-muted-foreground">From reference photo</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3 text-center">
                  <Sparkles className="size-5 mx-auto text-purple-500 mb-1" />
                  <p className="font-bold text-xs text-lilac-deep">Forever Keepsake</p>
                  <p className="text-[10px] text-muted-foreground">Never wilts or fades</p>
                </div>
                <div className="liquid-glass rounded-2xl p-3 text-center">
                  <Truck className="size-5 mx-auto text-emerald-500 mb-1" />
                  <p className="font-bold text-xs text-lilac-deep">Safe Delivery</p>
                  <p className="text-[10px] text-muted-foreground">Gift box packed</p>
                </div>
              </div>
            </div>

            {/* ── Right Column: Information & Actions ── */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-6">
              {/* Category Pill & In-Stock Status */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-lilac-deep">
                  <Crown className="size-3 text-primary" />
                  <span>{catMeta.tag}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Made to Order · Dispatched in 3–5 Days</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="sheen-text font-display text-3xl sm:text-4xl xl:text-5xl font-extrabold leading-tight text-lilac-deep">
                  {product.name}
                </h1>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                  {product.tagline || product.description}
                </p>
              </div>

              {/* Reviews & Social Proof */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">5.0</span>
                <span className="text-xs text-muted-foreground">· 100% Hand-stitched with love</span>
              </div>

              {/* Pricing Box */}
              <div className="liquid-glass rounded-3xl p-5 border border-white/70 shadow-sm space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                    {displayPrice}
                  </span>
                  {originalPrice && originalPrice !== displayPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {originalPrice}
                    </span>
                  )}
                  {discountPercent && discountPercent > 0 ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                      Save {discountPercent}%
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  Includes personalized hand-wrapping, protective shipping box and decorative satin ribbon.
                </p>
              </div>

              {/* Size & Dimensions Highlight */}
              {product.size && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/40 border border-white/60">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Ruler className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-lilac-deep">Size &amp; Dimensions</p>
                    <p className="text-xs text-muted-foreground">{product.size}</p>
                  </div>
                </div>
              )}

              {/* Custom Reference Note Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-lilac-deep">
                  Customization Instructions / Reference Note (Optional)
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Specify custom hair colour, outfit details, flower wrapping colours, or a gift card message..."
                  rows={2}
                  className="w-full rounded-2xl border border-input bg-white/70 px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all shadow-inner"
                />
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3 text-amber-500" />
                  You can also send your photo reference directly to the Queen after placing your order.
                </p>
              </div>

              {/* Quantity Selector & Subtotal */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/30 border border-white/50">
                <span className="text-xs font-bold text-lilac-deep">Quantity</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full bg-white shadow-sm border border-input p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent disabled:opacity-30 transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center font-display text-sm font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  {quantity > 1 && (
                    <span className="text-xs font-bold text-primary">
                      Subtotal: ₹{totalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="clay-primary liquid-btn w-full sm:flex-1 rounded-full py-4 px-6 text-sm sm:text-base font-bold text-center shadow-lg hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="size-4" />
                    <span>Buy Now — ₹{totalPrice.toLocaleString("en-IN")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full sm:flex-1 rounded-full py-4 px-6 text-sm sm:text-base font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      added
                        ? "bg-emerald-600 text-white shadow-emerald-200"
                        : "clay text-lilac-deep hover:bg-white/60"
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="size-4" />
                        <span>Added to Basket!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="size-4" />
                        <span>Add to Basket</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Direct WhatsApp Consultation Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="w-full rounded-full border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 py-3 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <MessageCircle className="size-4 text-emerald-600" />
                  <span>Chat with the Queen on WhatsApp about Customizing This</span>
                </button>
              </div>

              {/* Quick Shipping & Crafting Info */}
              <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-primary flex-shrink-0" />
                  <span>Handcrafted fresh upon order confirmation (takes 3–5 working days).</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="size-3.5 text-primary flex-shrink-0" />
                  <span>Tracked courier delivery pan-India with safe unboxing guarantee.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="size-3.5 text-primary flex-shrink-0" />
                  <span>Complimentary gift wrapping &amp; ribbon bow on every order.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Information Tabs ── */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-border/40 pb-4 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "details"
                    ? "clay-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Artisanal Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "custom"
                    ? "clay-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Customization Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "care"
                    ? "clay-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Wash &amp; Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "shipping"
                    ? "clay-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Packaging &amp; Delivery
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-display text-xl font-bold text-lilac-deep">
                      About this creation
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {product.description ||
                        "Every piece is lovingly hand-stitched stitch by stitch using premium milk cotton yarn. Unlike mass-manufactured items, each creation boasts unique artisan charm and personality that will be cherished for years to come."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-1.5">
                      <p className="text-xs font-bold text-lilac-deep">🧶 Yarn &amp; Materials</p>
                      <p className="text-xs text-muted-foreground">
                        Crafted from 100% Milk Cotton yarn — velvety soft to the touch, hypoallergenic, and baby-safe.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-1.5">
                      <p className="text-xs font-bold text-lilac-deep">☁️ Filling &amp; Safety</p>
                      <p className="text-xs text-muted-foreground">
                        Stuffed with high-resilience A-grade micro-polyfill that retains its plush shape forever. Safety eyes securely locked.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-1.5">
                      <p className="text-xs font-bold text-lilac-deep">📏 Measurements</p>
                      <p className="text-xs text-muted-foreground">
                        {product.size || "Custom dimensions available upon request"}.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-1.5">
                      <p className="text-xs font-bold text-lilac-deep">🎀 Presentation</p>
                      <p className="text-xs text-muted-foreground">
                        Delivered in a lovely protective gift box with handwritten note and ribbon wrap.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "custom" && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-lilac-deep">
                    How custom reference orders work
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                        1
                      </span>
                      <p className="text-sm font-bold text-lilac-deep">Send Your Reference</p>
                      <p className="text-xs text-muted-foreground">
                        Place your order and send reference photos of hair, outfits, pets, or floral colour schemes via WhatsApp or email.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                        2
                      </span>
                      <p className="text-sm font-bold text-lilac-deep">Hand-stitched Progress</p>
                      <p className="text-xs text-muted-foreground">
                        The Queen stitches your doll or bouquet carefully. You get photo previews before packaging to ensure 100% delight!
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                        3
                      </span>
                      <p className="text-sm font-bold text-lilac-deep">Gift Packed &amp; Shipped</p>
                      <p className="text-xs text-muted-foreground">
                        Securely packed with delicate tissue paper, ribbons and bubble cushioning, dispatched with tracking right to your door.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "care" && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-lilac-deep">
                    Wash &amp; Care Guide
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Because your crochet piece is stitched from pure milk cotton, it can last for decades with simple, gentle care:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-white/40">
                      <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Spot Cleaning:</strong> Use a damp microfiber cloth with mild soapy water for small spots.</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-white/40">
                      <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Gentle Hand Wash:</strong> If needed, hand wash in cold water using baby detergent. Do not rub vigorously.</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-white/40">
                      <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Drying:</strong> Gently squeeze excess water with a clean towel. Lay flat in shade to dry. Never tumble dry.</span>
                    </li>
                    <li className="flex items-start gap-2 p-3 rounded-xl bg-white/40">
                      <Check className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Flower Bouquets:</strong> Dust off petals occasionally with a soft makeup brush or gentle hairdryer on cool mode.</span>
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-lilac-deep">
                    Packaging &amp; Pan-India Delivery
                  </h3>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <p>
                      <strong>Crafting Time:</strong> Every creation is handmade to order and takes 3 to 5 business days to craft with maximum precision and love.
                    </p>
                    <p>
                      <strong>Delivery Time:</strong> Shipped via premium couriers (Delhivery, BlueDart, DTDC). Metro cities take 2–4 days; rest of India takes 4–6 days.
                    </p>
                    <p>
                      <strong>Damage-Free Guarantee:</strong> We pack every doll and bouquet with rigid boxes and interior cushioning. In the unlikely event of transit damage, we'll fix or replace it promptly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Related Products Carousel ── */}
        {relatedProducts.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Handcrafted Collection
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
                  You May Also Love
                </h2>
              </div>
              <Link
                to={catMeta.href}
                className="text-xs sm:text-sm font-bold text-primary hover:underline"
              >
                View all in {catMeta.label} →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => {
                const relImage = rel.images[0] || currentImage;
                const relPrice = rel.sellingPrice || rel.price;
                return (
                  <Link
                    key={rel.id}
                    to="/product/$productId"
                    params={{ productId: rel.id }}
                    className="clay-glow group overflow-hidden rounded-3xl p-3 flex flex-col justify-between hover-lift transition-all"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-purple-50/50">
                      {rel.badge && (
                        <span className="skeu-badge absolute top-2.5 right-2.5 z-10 text-[10px] py-1 px-2.5">
                          {rel.badge}
                        </span>
                      )}
                      <img
                        src={relImage}
                        alt={rel.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-display text-sm sm:text-base font-bold text-lilac-deep group-hover:text-primary transition-colors truncate">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {rel.size || rel.tagline || "Custom handmade"}
                      </p>
                      <p className="text-sm font-extrabold text-foreground">{relPrice}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Sticky Mobile Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border/40 p-3 shadow-2xl lg:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentImage}
                alt={product.name}
                className="size-11 rounded-xl object-cover border border-white shadow-sm flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-lilac-deep truncate">{product.name}</p>
                <p className="font-display text-sm font-extrabold text-foreground">
                  {displayPrice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`rounded-full p-2.5 text-xs font-bold transition-all ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "clay text-lilac-deep hover:bg-white/60"
                }`}
                title="Add to Basket"
              >
                {added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="clay-primary liquid-btn rounded-full py-2.5 px-4 text-xs font-bold shadow-md active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* ── Zoom Lightbox Modal ── */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-6 right-6 z-50 flex size-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="size-6" />
            </button>

            <div
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage}
                alt={product.name}
                className="max-h-[85vh] w-auto rounded-3xl object-contain shadow-2xl"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold">
                  {activeImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
