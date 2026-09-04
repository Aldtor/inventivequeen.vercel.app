import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Sparkles, Search, Home, ShoppingBag } from "lucide-react";
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
      {/* Decorative floating orbs */}
      <div className="decorative-orb w-72 h-72 bg-purple-400/15 top-10 -left-20" style={{ animationDelay: "0s" }} />
      <div className="decorative-orb w-56 h-56 bg-pink-300/10 bottom-10 -right-16" style={{ animationDelay: "4s" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating decorative yarn elements */}
      <div className="absolute top-20 right-16 text-4xl opacity-15 animate-float-gentle select-none pointer-events-none hidden md:block" aria-hidden="true">🧶</div>
      <div className="absolute bottom-24 left-12 text-3xl opacity-12 animate-float-slow select-none pointer-events-none hidden md:block" style={{ animationDelay: "2s" }} aria-hidden="true">🪡</div>
      <div className="absolute top-32 left-20 text-2xl opacity-10 animate-float-gentle select-none pointer-events-none hidden md:block" style={{ animationDelay: "4s" }} aria-hidden="true">✨</div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-3xl p-8 sm:p-10 shadow-luxury-lg border border-border/60 text-center max-w-lg w-full relative z-10"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "backOut" }}
          className="w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-primary via-purple-300 to-amber-300 shadow-royal mx-auto mb-6 animate-success-ring"
        >
          <img src={logo} alt="Inventive Queen" className="w-full h-full rounded-full object-cover" />
        </motion.div>

        {/* Animated 404 Number */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "backOut" }}
          className="font-display text-6xl md:text-7xl font-extrabold text-gradient-royal"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-2 text-xl font-display font-bold text-foreground"
        >
          Page Not Found in the Atelier
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto"
        >
          The crochet creation or page you're searching for might have found a new home. Let's get you back to the main collection!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-gradient text-white font-body font-bold text-xs shadow-royal-glow hover:shadow-luxury transition-all hover:-translate-y-0.5"
          >
            <Home size={14} />
            <span>Back to Atelier</span>
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-foreground font-bold text-xs hover:bg-white shadow-sm transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag size={14} className="text-primary" />
            <span>Browse Shop</span>
          </Link>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-8 pt-5 border-t border-border/40"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { to: "/custom-orders", label: "Custom Orders" },
              { to: "/how-to-order", label: "How To Order" },
              { to: "/reviews", label: "Reviews" },
              { to: "/faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[11px] font-semibold text-primary hover:underline px-2.5 py-1 rounded-full hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Popular products */}
        {popularProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="mt-6 pt-5 border-t border-border/40"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4">
              Featured Handmade Pieces
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {popularProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block rounded-2xl glass-panel p-1.5 border border-border/40 hover:border-primary/40 transition-all hover:scale-105 hover:shadow-md"
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NotFound;
