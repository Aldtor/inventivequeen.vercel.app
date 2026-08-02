import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Collection banner */}
        <div className="bg-secondary/30 border-b border-border/40">
          <div className="container py-10 md:py-16">
            {/* Breadcrumbs */}
            <FadeIn>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  </li>
                  <li><ChevronRight size={12} /></li>
                  <li>
                    <Link to="/#categories" className="hover:text-primary transition-colors">Collections</Link>
                  </li>
                  <li><ChevronRight size={12} /></li>
                  <li className="text-foreground font-medium">{category?.title ?? "Collection"}</li>
                </ol>
              </nav>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                {category?.title ?? "Collection"}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-3 md:mt-4 text-muted-foreground max-w-lg text-pretty leading-relaxed">
                {category?.description ?? "Handmade with love."}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Products area */}
        <div className="container py-8 md:py-12">
          {/* Toolbar */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground font-body">
                {sortedItems.length} {sortedItems.length === 1 ? "product" : "products"}
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-sm font-body bg-transparent border-none text-foreground focus:outline-none cursor-pointer"
                  aria-label="Sort products"
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                </select>
              </div>
            </div>
          </FadeIn>

          {sortedItems.length === 0 ? (
            <FadeIn>
              <div className="py-20 text-center">
                <p className="font-display text-2xl text-foreground mb-3">
                  Coming Soon
                </p>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  No products in this category yet - we're crafting something special. Check back soon!
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <ChevronLeft size={16} /> Browse other collections
                </Link>
              </div>
            </FadeIn>
          ) : (
            <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedItems.map((p) => {
                const pricing = getProductPricing(p);
                const newArrival = isNewArrival(p);

                return (
                  <StaggerItem key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      className="group card-lift overflow-hidden rounded-2xl bg-card shadow-luxury-sm block"
                    >
                      <div className="aspect-square overflow-hidden relative bg-white">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute left-2 top-2 flex flex-col gap-1">
                          {newArrival && (
                            <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-body font-semibold shadow-sm">
                              NEW
                            </span>
                          )}
                          {pricing.hasDiscount && (
                            <span className="rounded-full bg-foreground text-background px-2 py-0.5 text-[10px] font-body font-semibold shadow-sm">
                              {pricing.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
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


