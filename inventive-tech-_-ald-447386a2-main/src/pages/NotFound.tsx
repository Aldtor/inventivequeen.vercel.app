import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { products } from "@/lib/products";

const popularProducts = products.slice(0, 4);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 rounded-full bg-brand-blush/60 flex items-center justify-center mx-auto mb-6">
          <Search className="w-7 h-7 text-primary" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          404
        </h1>
        <p className="mt-3 text-lg text-muted-foreground font-body">
          This page doesn't exist
        </p>
        <p className="mt-2 text-sm text-muted-foreground font-body">
          The page you're looking for may have been moved or doesn't exist. Let's get you back on track.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm shadow-md shadow-primary/15 hover:shadow-lg hover:brightness-105 active:scale-[0.97] transition-all duration-200"
        >
          Back to Home
          <ArrowRight size={15} />
        </Link>

        {/* Popular products */}
        <div className="mt-12 pt-8 border-t border-border/60">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-body font-semibold mb-4">
            Popular Products
          </p>
          <div className="grid grid-cols-4 gap-2">
            {popularProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group"
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-luxury-sm">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
