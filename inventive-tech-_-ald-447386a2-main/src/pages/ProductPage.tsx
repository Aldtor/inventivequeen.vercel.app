import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  Clock,
  Truck,
  Gift,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  Check,
  Package,
  Pencil,
  Scissors,
  ShoppingCart,
  Droplets,
  ChevronDown,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories, type Product } from "@/lib/products";
import { useProducts } from "@/lib/cms-products";
import { addCartItem } from "@/lib/cart";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import { getProductPricing, isNewArrival } from "@/lib/product-display";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

/* Zoom Modal */
const ZoomModal = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 backdrop-blur-sm cursor-zoom-out"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 p-2 rounded-full bg-card text-foreground hover:bg-card/80 transition-colors active:scale-95"
      aria-label="Close zoom"
    >
      <X size={20} />
    </button>
    <img
      src={src}
      alt={alt}
      className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
    />
  </div>
);

/* Image Gallery */
const ImageGallery = ({ images, name }: { images: string[]; name: string }) => {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      {zoomed && (
        <ZoomModal
          src={images[active]}
          alt={name}
          onClose={() => setZoomed(false)}
        />
      )}
      <div className="flex flex-col gap-3">
        <div
          className="aspect-square overflow-hidden rounded-2xl bg-white shadow-luxury cursor-zoom-in group"
          onClick={() => setZoomed(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active]}
              alt={name}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 active:scale-95 flex-shrink-0 ${
                  i === active
                    ? "border-primary shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${name} ${i + 1}`}
                  className="w-full h-full object-contain bg-white"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

/* Color Picker */
const ColorPicker = ({
  colors,
  selected,
  onSelect,
}: {
  colors: { name: string; value: string }[];
  selected: string | null;
  onSelect: (name: string) => void;
}) => (
  <div>
    <p className="font-body text-sm font-medium text-foreground mb-2.5">
      Select Color
    </p>
    <div className="flex gap-3">
      {colors.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name)}
          className={`relative w-11 h-11 rounded-full border-2 transition-all duration-200 active:scale-90 ${
            selected === c.name
              ? "border-primary scale-110 shadow-md shadow-primary/20"
              : "border-border hover:scale-105 hover:border-primary/40"
          }`}
          style={{ backgroundColor: c.value }}
          aria-label={c.name}
          title={c.name}
        >
          {selected === c.name && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Check size={16} className="text-foreground drop-shadow" />
            </span>
          )}
        </button>
      ))}
    </div>
    {selected && (
      <p className="mt-2 text-xs text-muted-foreground">
        Selected: <span className="font-semibold text-foreground">{selected}</span>
      </p>
    )}
  </div>
);

/* Flower Picker (multi-select) */
const FlowerPicker = ({
  flowers,
  selected,
  onToggle,
}: {
  flowers: string[];
  selected: string[];
  onToggle: (f: string) => void;
}) => (
  <div>
    <p className="font-body text-sm font-medium text-foreground mb-2.5">
      Choose Flowers
    </p>
    <div className="flex flex-wrap gap-2">
      {flowers.map((f) => {
        const isActive = selected.includes(f);
        return (
          <button
            key={f}
            onClick={() => onToggle(f)}
            className={`px-5 py-2.5 rounded-full text-sm font-body font-medium border transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-brand-blush/20"
            }`}
          >
            {isActive && <Check size={14} className="inline mr-1.5 -mt-0.5" />}
            {f}
          </button>
        );
      })}
    </div>
  </div>
);

/* Bouquet Color Dropdown */
const BouquetColorDropdown = ({
  colors,
  selected,
  onSelect,
}: {
  colors: { name: string; value: string }[];
  selected: string | null;
  onSelect: (name: string) => void;
}) => (
  <div>
    <label className="font-body text-sm font-medium text-foreground block mb-2.5">
      Select Color
    </label>
    <select
      value={selected ?? ""}
      onChange={(e) => onSelect(e.target.value)}
      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
    >
      <option value="" disabled>
        Choose a color...
      </option>
      {colors.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  </div>
);

/* Expandable Section */
const ExpandableSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-border/60">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-body text-sm font-semibold text-foreground uppercase tracking-[0.1em]">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Trust Badges */
const trustItems = [
  { icon: Heart, label: "Handmade Item" },
  { icon: Clock, label: "Made in 2-3 Days" },
  { icon: Truck, label: "Delivery in 3-7 Days" },
  { icon: Gift, label: "Perfect for Gifting" },
];

/* Default bouquet options */
const defaultFlowers = ["Rose", "Sunflower", "Tulip"];
const defaultBouquetColors = [
  { name: "Red", value: "hsl(0 70% 55%)" },
  { name: "Yellow", value: "hsl(45 90% 60%)" },
  { name: "Pink", value: "hsl(350 60% 75%)" },
];

/* Product Page */
const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<string[]>([]);
  const [bouquetColor, setBouquetColor] = useState<string | null>(null);
  const [customChanges, setCustomChanges] = useState("");
  const [cartFeedback, setCartFeedback] = useState("");

  const toggleFlower = useCallback((f: string) => {
    setSelectedFlowers((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }, []);

  const isTeddy = product?.type === "teddy";
  const isBouquet = product?.type === "bouquet";
  const needsSelection = isTeddy || isBouquet;

  const canBuy =
    !needsSelection ||
    (isTeddy && selectedColor !== null) ||
    (isBouquet && selectedFlowers.length > 0 && bouquetColor !== null);

  const handleBuyNow = () => {
    if (!product || !canBuy) return;
    const params = new URLSearchParams({ product: product.id });
    if (selectedColor) params.set("color", selectedColor);
    if (selectedFlowers.length > 0) params.set("flowers", selectedFlowers.join(","));
    if (customChanges.trim()) params.set("custom", customChanges.trim());
    navigate(`/checkout?${params.toString()}`);
  };

  const handleAddToCart = () => {
    if (!product || !canBuy) return;
    addCartItem(product, {
      color: selectedColor,
      flowers: selectedFlowers,
      custom: customChanges,
    });
    setCartFeedback("Added to cart");
    window.setTimeout(() => setCartFeedback(""), 1600);
  };

  // Related products (same category, excluding current)
  const relatedProducts = product
    ? products.filter((p) => p.type === product.type && p.id !== product.id).slice(0, 4)
    : [];

  const categoryInfo = product
    ? categories.find((c) => c.slug === product.type)
    : null;
  const pricing = product ? getProductPricing(product) : null;
  const newArrival = product ? isNewArrival(product) : false;

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-32 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Product Not Found
          </h1>
          <p className="mt-3 text-muted-foreground">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button variant="outline" className="mt-6">
              <ChevronLeft size={16} /> Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-6 md:py-10">
        {/* Breadcrumbs */}
        <FadeIn>
          <nav aria-label="Breadcrumb" className="mb-6 md:mb-8">
            <ol className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li><ChevronRight size={12} /></li>
              {categoryInfo && (
                <>
                  <li>
                    <Link to={`/category/${product.type}`} className="hover:text-primary transition-colors">
                      {categoryInfo.title}
                    </Link>
                  </li>
                  <li><ChevronRight size={12} /></li>
                </>
              )}
              <li className="text-foreground font-medium line-clamp-1">{product.name}</li>
            </ol>
          </nav>
        </FadeIn>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          <FadeIn>
            <ImageGallery images={product.images} name={product.name} />
          </FadeIn>

          {/* Details - sticky on desktop */}
          <div ref={stickyRef}>
            <div className="md:sticky md:top-24 flex flex-col gap-6">
              <FadeIn delay={0.1}>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {newArrival && (
                      <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-body font-semibold">NEW</span>
                    )}
                    {pricing?.hasDiscount && (
                      <span className="rounded-full bg-foreground text-background px-2.5 py-1 text-[10px] font-body font-semibold">{pricing.discountPercent}% OFF</span>
                    )}
                  </div>
                  <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {product.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-baseline gap-3">
                    <p className="font-display text-xl md:text-2xl font-semibold text-primary">
                      {pricing?.sellingPrice ?? product.price}
                    </p>
                    {pricing?.hasDiscount && <p className="text-sm text-muted-foreground line-through">{pricing.originalPrice}</p>}
                  </div>
                  <p className="mt-3 text-muted-foreground font-body italic text-pretty">
                    {product.tagline}
                  </p>
                </div>
              </FadeIn>

              {/* Shipping info inline */}
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-4 py-3">
                  {trustItems.slice(0, 3).map((t) => (
                    <span key={t.label} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                      <t.icon size={13} className="text-primary" />
                      {t.label}
                    </span>
                  ))}
                </div>
              </FadeIn>

              {/* Variations */}
              <FadeIn delay={0.2}>
                <div className="flex flex-col gap-5">
                  {isTeddy && product.colors && (
                    <ColorPicker
                      colors={product.colors}
                      selected={selectedColor}
                      onSelect={setSelectedColor}
                    />
                  )}

                  {isBouquet && (
                    <>
                      <FlowerPicker
                        flowers={product.flowers ?? defaultFlowers}
                        selected={selectedFlowers}
                        onToggle={toggleFlower}
                      />
                      <BouquetColorDropdown
                        colors={product.flowerColors ?? defaultBouquetColors}
                        selected={bouquetColor}
                        onSelect={setBouquetColor}
                      />
                      {selectedFlowers.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Selected:{" "}
                          <span className="font-semibold text-foreground">
                            {selectedFlowers.join(", ")}
                          </span>
                          {bouquetColor && (
                            <>
                              {" "}in{" "}
                              <span className="font-semibold text-foreground">{bouquetColor}</span>
                            </>
                          )}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </FadeIn>

              {/* Custom Changes / Customisation */}
              <FadeIn delay={0.23}>
                <div className="bg-brand-blush/20 rounded-2xl p-4 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Pencil size={15} className="text-primary" />
                    <p className="font-body text-sm font-semibold text-foreground">
                      Write Custom Changes for Product
                    </p>
                    <span className="text-[10px] uppercase tracking-wider text-primary font-body font-semibold ml-auto bg-primary/10 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">
                    Want specific colors, name stitching, or size adjustments? Describe them below:
                  </p>
                  <textarea
                    value={customChanges}
                    onChange={(e) => setCustomChanges(e.target.value)}
                    placeholder="E.g. Change color to pastel blue, stitch name 'Priya', make it slightly larger..."
                    rows={3}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-200 resize-none"
                    aria-label="Write custom changes for this product"
                  />
                </div>
              </FadeIn>

              {/* Buttons */}
              <FadeIn delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={!canBuy}
                    onClick={handleAddToCart}
                    className="w-full rounded-xl text-base border-primary/30 hover:border-primary/60 active:scale-[0.97] transition-all duration-200"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    disabled={!canBuy}
                    onClick={handleBuyNow}
                    className="w-full rounded-xl text-base shadow-md shadow-primary/15 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.97] transition-all duration-200"
                  >
                    Buy Now
                  </Button>
                </div>

                {cartFeedback && (
                  <p className="text-xs text-primary font-body font-medium mt-3">
                    {cartFeedback}
                  </p>
                )}

                {needsSelection && !canBuy && (
                  <p className="text-xs text-destructive font-body mt-3">
                    {isTeddy
                      ? "Please select a color before buying."
                      : "Please select flowers and a color before buying."}
                  </p>
                )}
              </FadeIn>

              {/* Expandable sections */}
              <FadeIn delay={0.3}>
                <div>
                  <ExpandableSection title="About This Product" defaultOpen>
                    <p className="text-pretty">{product.description}</p>
                  </ExpandableSection>

                  <ExpandableSection title="Materials & Dimensions">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Package size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Premium soft acrylic / cotton yarn</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Scissors size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Handcrafted with 5mm crochet hooks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Safety-tested stuffing material (for plush items)</span>
                      </li>
                    </ul>
                  </ExpandableSection>

                  <ExpandableSection title="Care Guide">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Droplets size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Spot clean gently with mild soap and water</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 flex-shrink-0 text-sm">*</span>
                        <span>Avoid machine washing or tumble drying</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 flex-shrink-0 text-sm">*</span>
                        <span>Keep away from direct sunlight for prolonged periods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5 flex-shrink-0 text-sm">*</span>
                        <span>Store in a cool, dry place when not on display</span>
                      </li>
                    </ul>
                  </ExpandableSection>

                  <ExpandableSection title="Shipping & Delivery">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Truck size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Pan-India delivery via trusted courier partners</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Crafting: 2-3 days - Delivery: 3-7 business days</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Gift size={14} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>Lovingly packed and gift-ready on request</span>
                      </li>
                    </ul>
                  </ExpandableSection>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
                You May Also Like
              </h2>
              <p className="mt-3 text-center text-muted-foreground text-sm">
                More handmade creations from the same collection
              </p>
            </FadeIn>

            <StaggerChildren className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <StaggerItem key={p.id}>
                  <Link
                    to={`/product/${p.id}`}
                    className="group card-lift overflow-hidden rounded-2xl bg-card shadow-luxury-sm block"
                  >
                    <div className="aspect-square overflow-hidden bg-white relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-body text-sm md:text-base font-medium text-foreground leading-snug line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="mt-1.5 font-display text-base font-semibold text-primary">
                        {p.price}
                      </p>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;


