import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useProducts } from "@/lib/cms-products";
import { getProductPricing, isNewArrival } from "@/lib/product-display";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const FEATURED_COUNT = 8;

function getWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem("iq_wishlist") ?? "[]");
  } catch {
    return [];
  }
}

function toggleWishlistItem(id: string) {
  const current = getWishlist();
  const next = current.includes(id)
    ? current.filter((x) => x !== id)
    : [...current, id];
  localStorage.setItem("iq_wishlist", JSON.stringify(next));
  return next;
}

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState(getWishlist);
  const { products } = useProducts();
  const featured = products.slice(0, FEATURED_COUNT);

  const handleWishlist = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(toggleWishlistItem(id));
  }, []);

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-secondary/30">
      <div className="container">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
            Loved by handmade lovers
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-center text-foreground text-balance">
            Featured Creations
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-4 text-center text-muted-foreground max-w-lg mx-auto text-pretty leading-relaxed">
            Some of our most loved handmade pieces - perfect as gifts or keepsakes.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => {
            const hasSecondImage = p.images.length > 1;
            const isWishlisted = wishlist.includes(p.id);
            const pricing = getProductPricing(p);
            const newArrival = isNewArrival(p);

            return (
              <StaggerItem key={p.id}>
                <Link to={`/product/${p.id}`} className="group block relative">
                  <div className="card-lift overflow-hidden rounded-2xl bg-card shadow-luxury-sm">
                    <div className="aspect-square overflow-hidden relative bg-white">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className={`w-full h-full object-contain transition-all duration-700 ease-out ${
                          hasSecondImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
                        }`}
                      />
                      {hasSecondImage && (
                        <img
                          src={p.images[1]}
                          alt={`${p.name} alternate view`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-all duration-700 ease-out"
                        />
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="bg-card/90 backdrop-blur-sm text-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                          Handmade
                        </span>
                        {newArrival && (
                          <span className="bg-primary text-primary-foreground font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            NEW
                          </span>
                        )}
                        {pricing.hasDiscount && (
                          <span className="bg-foreground text-background font-body text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-sm">
                            {pricing.discountPercent}% OFF
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleWishlist(e, p.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card hover:scale-110 active:scale-95 shadow-sm"
                        aria-label={isWishlisted ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                      >
                        <Heart size={14} className={isWishlisted ? "text-primary fill-primary" : "text-foreground/70"} />
                      </button>
                    </div>

                    <div className="p-4 md:p-5">
                      <h3 className="font-body text-sm md:text-base font-medium text-foreground leading-snug line-clamp-1">
                        {p.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                        <p className="font-display text-base md:text-lg font-semibold text-primary">
                          {pricing.sellingPrice}
                        </p>
                        {pricing.hasDiscount && (
                          <p className="text-xs text-muted-foreground line-through">{pricing.originalPrice}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default FeaturedProducts;
