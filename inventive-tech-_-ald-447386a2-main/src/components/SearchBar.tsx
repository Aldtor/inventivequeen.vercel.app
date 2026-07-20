import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { products, categories } from "@/lib/products";
import { getRecentlyViewed, clearRecentlyViewed, TRENDING_SEARCHES } from "@/lib/recentlyViewed";

interface SearchBarProps {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}

const SearchBar = ({ onNavigate, variant = "desktop" }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const refresh = () => setRecentIds(getRecentlyViewed());
    refresh();
    window.addEventListener("recently-viewed-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("recently-viewed-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const recentProducts = useMemo(
    () =>
      recentIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is (typeof products)[number] => Boolean(p))
        .slice(0, 4),
    [recentIds],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { products: [], categories: [] };
    const matchedCategories = categories.filter(
      (c) => c.title.toLowerCase().includes(q) || c.slug.includes(q),
    );
    const matchedProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q),
      )
      .slice(0, 6);
    return { products: matchedProducts, categories: matchedCategories };
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const close = () => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
  };

  const goToProduct = (id: string) => {
    navigate(`/product/${id}`);
    close();
  };

  const goToCategory = (slug: string) => {
    navigate(`/category/${slug}`);
    close();
  };

  const hasResults = results.products.length > 0 || results.categories.length > 0;
  const isEmpty = !query.trim();

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search keychains, bouquets…"
          className="w-full h-10 pl-9 pr-9 rounded-full bg-brand-blush/30 border border-border/60 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          className={`absolute ${
            variant === "mobile" ? "left-0 right-0" : "left-0 right-0"
          } mt-2 bg-background border border-border/60 rounded-2xl shadow-lg overflow-hidden z-50 animate-fade-up`}
        >
          {isEmpty ? (
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {recentProducts.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                      <Clock size={11} /> Recently viewed
                    </p>
                    <button
                      onClick={clearRecentlyViewed}
                      className="text-[11px] font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => goToProduct(p.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-brand-blush/40 transition-colors text-left"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-border/60"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">
                          {p.type} · {p.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <div className="px-2 pt-1">
                <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1.5">
                  <TrendingUp size={11} /> Trending searches
                </p>
                <div className="flex flex-wrap gap-2 px-3 py-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        setOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-full bg-brand-blush/40 hover:bg-brand-blush/70 text-xs font-medium text-foreground transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : !hasResults ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No results for "{query}" 💭
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.categories.length > 0 && (
                <div className="px-2 pb-1">
                  <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Categories
                  </p>
                  {results.categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => goToCategory(c.slug)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-brand-blush/40 transition-colors text-left"
                    >
                      <span className="text-lg">{c.emoji}</span>
                      <span className="text-sm font-medium text-foreground">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.products.length > 0 && (
                <div className="px-2 pt-1">
                  <p className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Products
                  </p>
                  {results.products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => goToProduct(p.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-brand-blush/40 transition-colors text-left"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-border/60"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">
                          {p.type} · {p.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
