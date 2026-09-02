import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/lib/products";
import { useProducts } from "@/lib/cms-products";
import { getProductPricing, isNewArrival, parsePriceValue } from "@/lib/product-display";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

type SortOption = "default" | "price-low" | "price-high" | "name-az";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products } = useProducts();
  const category = categories.find((c) => c.slug === slug);
  const items = products.filter((p) => p.type === slug);
  const [sort, setSort] = useState<SortOption>("default");

  const sortedItems = useMemo(() => {
    const copy = [...items];
    switch (sort) {
      case "price-low":
        return copy.sort((a, b) => parsePriceValue(a.sellingPrice || a.price) - parsePriceValue(b.sellingPrice || b.price));
      case "price-high":
        return copy.sort((a, b) => parsePriceValue(b.sellingPrice || b.price) - parsePriceValue(a.sellingPrice || a.price));
      case "name-az":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return copy;
    }
  }, [items, sort]);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Collection banner */}
        <section className="bg-fairytale-mesh border-b border-border/40 relative overflow-hidden py-12 md:py-18">
          <div className="container relative z-10">
            {/* Breadcrumbs */}
            <FadeIn>
              <nav aria-label="Breadcrumb" className="mb-5">
                <ol className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  </li>
                  <li><ChevronRight size={12} /></li>
                  <li>
                    <Link to="/#categories" className="hover:text-primary transition-colors">Collections</Link>
                  </li>
                  <li><ChevronRight size={12} /></li>
                  <li className="text-foreground font-semibold">{category?.title ?? "Collection"}</li>
                </ol>
              </nav>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={12} className="text-amber-500" />
                Handcrafted Collection
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-balance">
                {category?.title ?? "Collection"}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-3 md:mt-4 text-muted-foreground max-w-lg text-sm md:text-base leading-relaxed">
                {category?.description ?? "Handmade with love using premium milk cotton yarn."}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Products area */}
        <div className="container py-8 md:py-14 max-w-6xl">
          {/* Toolbar */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
              <p className="text-xs sm:text-sm font-semibold text-muted-foreground font-body">
                Showing <span className="text-foreground font-bold">{sortedItems.length}</span> {sortedItems.length === 1 ? "design" : "designs"}
              </p>
              <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-full border border-border/60 shadow-luxury-sm">
                <SlidersHorizontal size={13} className="text-primary" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-xs font-body bg-transparent border-none text-foreground focus:outline-none cursor-pointer font-semibold"
                  aria-label="Sort products"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                </select>
              </div>
            </div>
          </FadeIn>

          {sortedItems.length === 0 ? (
            <FadeIn>
              <div className="py-20 text-center glass-card rounded-3xl p-8 max-w-md mx-auto shadow-luxury border border-border/50">
                <p className="font-display text-2xl font-bold text-foreground mb-2">
                  Coming Soon ✨
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                  New pieces are currently being crocheted for this collection. Check back soon or request a custom order!
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-border/60 text-xs font-semibold hover:bg-secondary/60 transition-colors"
                  >
                    <ChevronLeft size={14} /> Back to Atelier
                  </Link>
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full btn-gradient text-white text-xs font-bold shadow-royal-glow"
                  >
                    <Sparkles size={13} className="text-amber-200" />
                    Custom Request
                  </Link>
                </div>
              </div>
            </FadeIn>
          ) : (
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedItems.map((p) => {
                const pricing = getProductPricing(p);
                const newArrival = isNewArrival(p);

                return (
                  <StaggerItem key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      className="group block rounded-3xl glass-card p-4 border border-border/50 hover:border-primary/40 shadow-luxury-sm hover:shadow-luxury-lg card-lift transition-all duration-400 flex flex-col h-full"
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden relative bg-gradient-to-br from-purple-50/50 via-white to-pink-50/20 flex items-center justify-center p-3 mb-3.5 border border-border/30">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
                          {newArrival && (
                            <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[9.5px] font-bold shadow-sm">
                              NEW
                            </span>
                          )}
                          {pricing.hasDiscount && (
                            <span className="rounded-full bg-foreground text-background px-2.5 py-0.5 text-[9.5px] font-bold shadow-sm">
                              {pricing.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-primary font-bold block mb-1">
                            Handmade
                          </span>
                          <h3 className="font-display text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {p.name}
                          </h3>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-baseline justify-between">
                          <p className="font-display text-base font-bold text-foreground">
                            {pricing.sellingPrice}
                          </p>
                          {pricing.hasDiscount && (
                            <p className="text-xs text-muted-foreground line-through">{pricing.originalPrice}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerChildren>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
