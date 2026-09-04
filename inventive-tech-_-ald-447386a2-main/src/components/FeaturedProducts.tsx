import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowRight, Eye, Crown, ShoppingBag, Star, Check } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/lib/cms-products";
import { getProductPricing, isNewArrival } from "@/lib/product-display";
import { addCartItem } from "@/lib/cart";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("iq_wishlist") ?? "[]");
  } catch {
    return [];
  }
}

function toggleWishlistItem(id: string) {
  const current = getWishlist();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  localStorage.setItem("iq_wishlist", JSON.stringify(next));
  return next;
}

const filterTabs = [
  { id: "all", label: "All Pieces", emoji: "✨" },
  { id: "bouquet", label: "Forever Flowers", emoji: "💐" },
  { id: "doll", label: "Keepsake Dolls", emoji: "🧸" },
  { id: "keychain", label: "Pocket Charms", emoji: "🔑" },
  { id: "bookmark", label: "Bookmarks", emoji: "🔖" },
];

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState(getWishlist);
  const [activeFilter, setActiveFilter] = useState("all");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { products } = useProducts();

  const handleWishlist = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(toggleWishlistItem(id));
  }, []);

  const handleQuickAdd = useCallback((e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedColor = product.colors?.[0]?.name;
    const selectedFlowers = product.flowers ? [product.flowers[0]] : undefined;

    addCartItem(product, {
      color: selectedColor,
      flowers: selectedFlowers,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`Added "${product.name}" to your royal bag! ✨`, {
      description: "Hand-stitched on order with luxury gift wrapping.",
    });

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.type === activeFilter);
  }, [products, activeFilter]);

  if (products.length === 0) return null;

  return (
    <section id="catalogue" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Sparkles size={13} className="text-amber-500" />
              <span>Signature Creations</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Cherished Atelier Pieces
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Our most celebrated handmade creations. Soft hypoallergenic milk cotton, custom colorways, and heirloom gift box with every piece.
            </p>
          </FadeIn>

          {/* Interactive Filter Pills */}
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-purple-900 text-white shadow-md shadow-purple-900/20 scale-105"
                        : "bg-white/90 hover:bg-white text-purple-900 border border-purple-200/80 shadow-xs hover:border-purple-300"
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </FadeIn>
        </div>

        {/* Product Grid */}
        <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => {
            const hasSecondImage = p.images.length > 1;
            const isWishlisted = wishlist.includes(p.id);
            const pricing = getProductPricing(p);
            const newArrival = isNewArrival(p);
            const isJustAdded = addedIds[p.id];

            return (
              <StaggerItem key={p.id}>
                <div className="group h-full bg-white rounded-[2rem] p-3 sm:p-4 border border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
                  {/* Image Container */}
                  <Link to={`/product/${p.id}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50/70 via-pink-50/40 to-white">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className={`w-full h-full object-contain p-3 transition-all duration-500 ease-out ${
                        hasSecondImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                      }`}
                    />
                    {hasSecondImage && (
                      <img
                        src={p.images[1]}
                        alt={`${p.name} alternate view`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-contain p-3 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-500 ease-out"
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {newArrival && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-700 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                          NEW
                        </span>
                      )}
                      {pricing.hasDiscount && (
                        <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                          {pricing.discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlist(e, p.id)}
                      className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isWishlisted
                          ? "bg-rose-50 text-rose-600 border border-rose-200 shadow-sm"
                          : "bg-white/90 text-purple-900/60 hover:text-rose-500 hover:bg-white shadow-sm"
                      }`}
                      aria-label="Wishlist item"
                    >
                      <Heart
                        size={15}
                        className={`transition-transform duration-200 active:scale-125 ${
                          isWishlisted ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                    </button>

                    {/* Quick Add Overlay on Hover for Desktop */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
                      <button
                        onClick={(e) => handleQuickAdd(e, p)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all ${
                          isJustAdded
                            ? "bg-emerald-600 text-white"
                            : "bg-purple-950/90 hover:bg-purple-900 text-white backdrop-blur-md"
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check size={14} />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Quick Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="mt-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                        <span>{p.type.replace("-", " ")}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <Link to={`/product/${p.id}`} className="block mt-1">
                        <h3 className="font-display text-sm sm:text-base font-bold text-purple-950 group-hover:text-purple-700 transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-[11px] text-purple-900/65 line-clamp-1 mt-0.5">
                        {p.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-purple-50 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-base sm:text-lg font-black text-purple-950">
                          {pricing.sellingPriceFormatted}
                        </span>
                        {pricing.hasDiscount && (
                          <span className="text-xs text-purple-900/40 line-through">
                            {pricing.originalPriceFormatted}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Mobile Add button */}
                        <button
                          onClick={(e) => handleQuickAdd(e, p)}
                          className={`sm:hidden p-2 rounded-xl transition-all ${
                            isJustAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-purple-100 text-purple-950 hover:bg-purple-200"
                          }`}
                          aria-label="Add to bag"
                        >
                          {isJustAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
                        </button>

                        <Link
                          to={`/product/${p.id}`}
                          className="p-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-900 transition-all active:scale-95"
                          title="View details"
                        >
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerChildren>

        {/* View All Collection Banner */}
        <FadeIn delay={0.3}>
          <div className="mt-14 text-center">
            <Link
              to="/category/bouquet"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-purple-50 text-purple-950 border-2 border-purple-200 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <span>Explore All Forever Collections</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default FeaturedProducts;

