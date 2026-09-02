import { useState, useRef, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/lib/cms-products";
import { AnimatePresence, motion } from "framer-motion";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();

  const trimmedQuery = query.trim().toLowerCase();
  const results = trimmedQuery.length >= 2
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.type.toLowerCase().includes(trimmedQuery) ||
          p.tagline?.toLowerCase().includes(trimmedQuery)
      ).slice(0, 5)
    : [];

  const showDropdown = focused && trimmedQuery.length >= 2;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 ${
          focused
            ? "bg-white border-primary/30 shadow-luxury ring-2 ring-primary/10"
            : "bg-secondary/60 border-border/60 hover:bg-secondary/80"
        }`}
      >
        <Search size={15} className={`flex-shrink-0 transition-colors ${focused ? "text-primary" : "text-muted-foreground"}`} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search dolls, bouquets, charms..."
          className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground/60 outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-luxury-lg z-50 overflow-hidden"
          >
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/product/${p.id}`}
                      onClick={() => { setFocused(false); setQuery(""); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/60 overflow-hidden flex-shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">{p.type}</p>
                      </div>
                      <ArrowRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">No results for "{query}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try searching for "bouquet", "doll", or "keychain"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
