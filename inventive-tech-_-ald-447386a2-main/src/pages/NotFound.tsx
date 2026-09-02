import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/lib/cms-products";
import logo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();
  const { products } = useProducts();
  const popularProducts = products.slice(0, 4);

  useEffect(() => {
    console.error("404 Error: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-fairytale-mesh px-6 py-12 relative overflow-hidden selection:bg-primary/15 selection:text-primary">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-8 sm:p-10 shadow-luxury-lg border border-border/60 text-center max-w-lg w-full relative z-10"
      >
        <div className="w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-primary via-purple-300 to-amber-300 shadow-royal mx-auto mb-6 animate-glow-pulse">
          <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
        </div>

        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-gradient-royal">
          404
        </h1>
        <p className="mt-2 text-xl font-display font-bold text-foreground">
          Page Not Found in the Atelier
        </p>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          The crochet creation or page you're searching for might have found a new home. Let's get you back to the main collection!
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-body font-bold text-xs shadow-royal-glow hover:shadow-luxury transition-all"
          >
            <Sparkles size={14} className="text-amber-200" />
            <span>Back to Atelier</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Popular products */}
        {popularProducts.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border/40">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4">
              Featured Handmade Pieces
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {popularProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block rounded-2xl glass-panel p-1.5 border border-border/40 hover:border-primary/40 transition-all hover:scale-105"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-white/70 p-1">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-foreground truncate mt-1">
                    {p.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotFound;
