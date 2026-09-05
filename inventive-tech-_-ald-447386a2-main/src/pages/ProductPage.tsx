import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Star, Truck, Sparkles, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { allCatalogItems, type ShopItem } from "./ShopPage";
import { useProducts } from "@/lib/cms-products";
import { addCartItem, openCartDrawer } from "@/lib/cart";

export default function ProductPage() {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const productKey = slug || id || "lavender-bear";
  const { products: cmsProducts } = useProducts();
  const navigate = useNavigate();

  const product = useMemo(() => {
    // Check in allCatalogItems first
    const found = allCatalogItems.find(
      (p) => p.slug === productKey || p.id === productKey
    );
    if (found) return found;

    // Check in cmsProducts
    const cmsFound = cmsProducts.find((p) => p.id === productKey);
    if (cmsFound) {
      return {
        id: cmsFound.id,
        slug: cmsFound.id,
        name: cmsFound.name,
        price: cmsFound.price,
        rawPrice: parseInt(cmsFound.price.replace(/[^\d]/g, "")) || 999,
        category: cmsFound.type as any,
        categoryLabel: cmsFound.type.charAt(0).toUpperCase() + cmsFound.type.slice(1),
        note: cmsFound.tagline || "Handcrafted Crochet",
        img: cmsFound.images[0] || "",
        desc: cmsFound.description,
        story: "Each stitch is woven by hand with certified soft cotton yarn in our royal atelier.",
        details: [
          "100% premium milk-cotton yarn",
          "Handmade with slow craftsmanship",
          "Gift-ready signature packaging",
          "Dust-resistant & long-lasting",
        ],
        rating: 5.0,
        reviews: 48,
        bestseller: true,
        madeToOrder: true,
      } as ShopItem;
    }

    // Default fallback
    return allCatalogItems[0];
  }, [productKey, cmsProducts]);

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("Original Atelier Palette");
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [giftBoxNote, setGiftBoxNote] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("craft");
  const [added, setAdded] = useState(false);

  const productColors = [
    { name: "Original Atelier Palette", class: "from-purple-500 to-indigo-500" },
    { name: "Pastel Lavender", class: "from-purple-300 to-purple-400" },
    { name: "Dusty Rose Pink", class: "from-pink-300 to-rose-400" },
    { name: "Forest Mint Sage", class: "from-emerald-300 to-teal-400" },
    { name: "Golden Honey", class: "from-amber-300 to-amber-500" },
  ];

  const rawUnitPrice = product.rawPrice || parseInt(product.price.replace(/[^\d]/g, "")) || 999;
  const giftBoxFee = includeGiftBox ? 149 : 0;
  const totalItemPrice = rawUnitPrice * qty + giftBoxFee;
  const qualifiesForFreeShipping = totalItemPrice >= 999;

  const related = useMemo(() => {
    return allCatalogItems
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [product]);

  const handleAddToCart = () => {
    addCartItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        type: "bouquet",
        tagline: product.desc,
        description: product.desc,
        images: [product.img],
        isActive: true,
      },
      {
        color: selectedColor || undefined,
        custom: includeGiftBox ? `Wax-Sealed Gift Box${giftBoxNote ? `: "${giftBoxNote}"` : ""}` : undefined,
      }
    );

    setAdded(true);
    toast.success(`${product.name} added to your basket!`, {
      description: `${qty} × ${product.price} · Prepared by our royal atelier`,
    });
    openCartDrawer();

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to collection
            </Link>
          </div>

          {/* Product Showcase */}
          <div className="mt-10 grid gap-14 lg:grid-cols-2 items-start">
            {/* Left Photo Showcase */}
            <div className="tilt-scene">
              <div className="overflow-hidden rounded-[2.5rem] glass-card border border-purple-200/80 shadow-lift bg-white/80 p-2">
                <motion.img
                  src={product.img}
                  alt={product.name}
                  width={912}
                  height={1104}
                  className="aspect-[4/5] w-full rounded-[2rem] object-cover"
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>

            {/* Right Details */}
            <div className="flex flex-col justify-center">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-purple-700 font-bold">
                  {product.note}
                </span>
                <h1 className="mt-3 font-display text-4xl text-plum sm:text-5xl font-medium tracking-tight">
                  {product.name}
                </h1>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/80 border border-purple-200/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-purple-600 text-purple-600" />
                    <span className="font-semibold text-plum">{product.rating}</span> · {product.reviews} reviews
                  </span>
                  {product.madeToOrder && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] uppercase tracking-[0.16em] font-bold text-purple-900">
                      Made to order
                    </span>
                  )}
                  {product.bestseller && (
                    <span className="rounded-full btn-royal px-3 py-1 text-[10px] uppercase tracking-[0.16em] font-bold shadow-sm">
                      Bestseller
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Description */}
              <div className="mt-6 border-t border-purple-200/60 pt-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-purple-950">
                    {product.price}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    (All taxes included)
                  </span>
                </div>
                <p className="mt-4 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
                  {product.desc}
                </p>
              </div>

              {/* Color Theme Selector Swatches */}
              <div className="mt-6 border-t border-purple-200/60 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-950">
                    Palette Swatch: <span className="text-purple-700 font-semibold">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((color) => {
                    const active = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          active
                            ? "bg-purple-900 text-white border-purple-900 shadow-sm"
                            : "bg-white text-purple-950 border-purple-200 hover:border-purple-300"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-tr ${color.class} shadow-xs`} />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Luxury Gift Packaging Option */}
              <div className="mt-6 border-t border-purple-200/60 pt-6">
                <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  includeGiftBox ? "bg-purple-50/80 border-purple-500 shadow-sm" : "bg-white border-purple-200/80 hover:border-purple-300"
                }`}>
                  <input
                    type="checkbox"
                    checked={includeGiftBox}
                    onChange={(e) => setIncludeGiftBox(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-950">👑 Signature Wax-Sealed Gift Box Pack</span>
                      <span className="font-black text-purple-700">+₹149</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5">
                      Premium rigid box, satin ribbon wrap, dried floral sprig & handwritten wax-sealed message card.
                    </p>
                    {includeGiftBox && (
                      <input
                        type="text"
                        value={giftBoxNote}
                        onChange={(e) => setGiftBoxNote(e.target.value)}
                        placeholder="Personal gift card note (e.g. 'Happy Birthday Priya! With love, Arjun')..."
                        className="mt-2.5 w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-xs text-purple-950 placeholder:text-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    )}
                  </div>
                </label>
              </div>

              {/* Free Shipping Alert Bar */}
              <div className="mt-4 px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-between text-xs">
                <span className="text-purple-900 font-medium flex items-center gap-1.5">
                  <Truck size={14} className="text-purple-600" />
                  {qualifiesForFreeShipping ? (
                    <span className="text-emerald-700 font-bold">✨ You qualify for FREE Pan-India Courier Shipping!</span>
                  ) : (
                    <span>Add <strong className="font-bold text-purple-950">₹{999 - totalItemPrice}</strong> more for free courier delivery</span>
                  )}
                </span>
                <span className="text-purple-700 font-black">
                  Total: ₹{totalItemPrice.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Quantity and Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center rounded-full border border-purple-200 bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-purple-100 hover:text-plum"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-plum">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="rounded-full p-2.5 text-muted-foreground transition-colors hover:bg-purple-100 hover:text-plum"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Basket CTA */}
                <button
                  onClick={handleAddToCart}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full btn-royal px-8 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>{added ? "Added to basket!" : `Add to Basket · ₹${totalItemPrice.toLocaleString("en-IN")}`}</span>
                </button>
              </div>

              {/* Instant Buy CTA */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-purple-300 hover:border-purple-600 bg-white hover:bg-purple-50 text-purple-950 py-3 text-xs sm:text-sm font-bold active:scale-[0.98] transition-all shadow-xs"
                >
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Instant Buy · Proceed to Royal Checkout</span>
                </button>
              </div>

              {/* Accordion Tabs for Craft, Care, Shipping */}
              <div className="mt-8 border-t border-purple-200/60 pt-6 space-y-3">
                {/* Accordion 1: Craftsmanship */}
                <div className="rounded-2xl border border-purple-200/70 overflow-hidden bg-white/70">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === "craft" ? null : "craft")}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs sm:text-sm font-bold text-purple-950 hover:bg-purple-50/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-500" />
                      Slow Craftsmanship & Yarn Specs
                    </span>
                    <span className="text-purple-600 font-black">{openSection === "craft" ? "−" : "+"}</span>
                  </button>
                  {openSection === "craft" && (
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-purple-100 bg-purple-50/20">
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.details.map((detail) => (
                          <li key={detail} className="text-plum">{detail}</li>
                        ))}
                        <li>100% hypoallergenic combed milk-cotton yarn</li>
                        <li>High-tension micro-stitches prevents sagging or fraying over years</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Care Guide */}
                <div className="rounded-2xl border border-purple-200/70 overflow-hidden bg-white/70">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === "care" ? null : "care")}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs sm:text-sm font-bold text-purple-950 hover:bg-purple-50/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Heart size={15} className="text-rose-500" />
                      Longevity & Flower Care
                    </span>
                    <span className="text-purple-600 font-black">{openSection === "care" ? "−" : "+"}</span>
                  </button>
                  {openSection === "care" && (
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-purple-100 bg-purple-50/20 space-y-1.5">
                      <p>• <strong>No Water Needed:</strong> These blooms last indefinitely without wilting.</p>
                      <p>• <strong>Dusting:</strong> Use a soft blush brush or hairdryer on cool, low setting occasionally.</p>
                      <p>• <strong>Pliable Stems:</strong> Stems contain gentle craft wire so you can bend or arrange them in any vase.</p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Shipping */}
                <div className="rounded-2xl border border-purple-200/70 overflow-hidden bg-white/70">
                  <button
                    type="button"
                    onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left text-xs sm:text-sm font-bold text-purple-950 hover:bg-purple-50/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={15} className="text-purple-600" />
                      Packaging & Insured Delivery
                    </span>
                    <span className="text-purple-600 font-black">{openSection === "shipping" ? "−" : "+"}</span>
                  </button>
                  {openSection === "shipping" && (
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-purple-100 bg-purple-50/20 space-y-1.5">
                      <p>• <strong>Turnaround:</strong> Made to order in 3–5 business days in our royal atelier.</p>
                      <p>• <strong>Courier:</strong> Shipped via premium air express (Delhivery / Bluedart) across all pin codes in India.</p>
                      <p>• <strong>Transit Protection:</strong> Wrapped in protective honeycomb wrap and shipped in rigid shock-proof boxes.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* The Story Section */}
          <section className="mt-28 grid items-center gap-14 lg:grid-cols-2 border-t border-purple-200/60 pt-20">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The story</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium text-plum">
                Made <span className="italic text-gradient">slowly</span>, with intention
              </h2>
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground text-sm sm:text-base">
                {product.story}
              </p>
              <div className="mt-8 flex items-center gap-3 text-xs text-purple-900 font-semibold">
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
                <span>Individually numbered & handmade in our atelier</span>
              </div>
            </div>

            <div className="tilt-scene">
              <div className="overflow-hidden rounded-[2.5rem] tilt-3d shadow-lift border border-purple-200/70 bg-white p-2">
                <img
                  src={product.img}
                  alt={`${product.name} craftsmanship detail`}
                  loading="lazy"
                  className="aspect-square w-full rounded-[2rem] object-cover"
                />
              </div>
            </div>
          </section>

          {/* Related Pieces */}
          {related.length > 0 && (
            <section className="mt-28 border-t border-purple-200/60 pt-20">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">
                  You may also love
                </p>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium text-plum">
                  More from <span className="italic text-gradient">{product.categoryLabel}</span>
                </h2>
              </div>

              <div className="mt-12 grid gap-8 tilt-scene sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-3xl glass-card tilt-3d border border-purple-200/70 shadow-soft bg-white/80 hover:bg-white transition-all flex flex-col"
                  >
                    <Link to={`/product/${p.slug}`} className="relative overflow-hidden aspect-[4/3] w-full block">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium text-plum shadow-sm">
                        {p.note}
                      </span>
                    </Link>

                    <div className="flex flex-col flex-1 justify-between p-6">
                      <div>
                        <Link to={`/product/${p.slug}`}>
                          <h3 className="font-display text-xl text-plum font-medium tracking-tight group-hover:text-purple-700 transition-colors">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {p.desc}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-4">
                        <span className="font-display text-xl font-bold text-purple-950">
                          {p.price}
                        </span>
                        <Link
                          to={`/product/${p.slug}`}
                          className="rounded-full border border-purple-300/80 bg-purple-50/60 px-4 py-1.5 text-xs uppercase tracking-wider font-semibold text-plum hover:btn-royal hover:border-transparent transition-all"
                        >
                          View Piece
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
