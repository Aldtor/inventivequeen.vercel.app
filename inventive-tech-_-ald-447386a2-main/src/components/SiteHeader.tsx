import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Crown, Sparkles, MessageCircle, Heart, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { getCartCount, openCartDrawer, CART_UPDATED_EVENT } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

interface SiteHeaderProps {
  hideBanner?: boolean;
}

export function SiteHeader({ hideBanner = false }: SiteHeaderProps) {
  const [count, setCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCount = () => setCount(getCartCount());
    updateCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collection", href: "/shop" },
    { label: "The Craft", href: "/about" },
    { label: "Reviews", href: "/reviews" },
    { label: "How to Order", href: "/how-to-order" },
    { label: "FAQ", href: "/faq" },
    { label: "Custom Studio ✨", href: "/custom-orders", highlight: true },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname.startsWith(href)) return true;
    return false;
  };

  const showTopBanner = !hideBanner && bannerVisible;

  return (
    <>
      {/* ── Top Royal Announcement Ribbon ── */}
      <AnimatePresence>
        {showTopBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed inset-x-0 top-0 z-50 overflow-hidden bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white shadow-sm border-b border-purple-800/40"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs font-medium tracking-wide">
              <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/25 border border-amber-300/40 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  <Crown size={11} className="text-amber-300" />
                  Royal Atelier
                </span>
                <span className="text-purple-100 hidden sm:inline">
                  🌸 Bespoke Custom Commissions are currently <strong className="font-bold text-white underline decoration-amber-300/60 underline-offset-2">OPEN</strong>!
                </span>
                <span className="text-purple-100 sm:hidden">
                  🌸 Custom orders are <strong className="font-bold text-white">OPEN</strong>!
                </span>
                <span className="text-purple-300 text-[11px] hidden md:inline">• Turnaround: 3–5 Days</span>
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center gap-1 font-bold text-amber-200 hover:text-white transition-colors ml-1 underline decoration-amber-300/50"
                >
                  <span>Commission Now</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <button
                onClick={() => setBannerVisible(false)}
                className="text-purple-300/70 hover:text-white transition-colors p-1 -mr-1 rounded-md"
                aria-label="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Floating Capsule Header ── */}
      <header
        className="fixed inset-x-0 z-40 px-3 sm:px-6 pointer-events-none transition-all duration-300"
        style={{ top: showTopBanner ? "36px" : "12px" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass-card px-3.5 sm:px-6 py-2.5 pointer-events-auto border border-purple-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl bg-white/90 transition-all duration-300 hover:border-purple-300">
          {/* Logo & Atelier Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="Inventive Queen logo"
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border border-purple-200 shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-1 -right-1 text-[11px] select-none filter drop-shadow">👑</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg tracking-tight font-bold text-plum group-hover:text-purple-700 transition-colors">
                Inventive Queen
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-purple-600 font-semibold hidden sm:inline">
                Crochet Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden gap-1.5 text-xs lg:text-sm font-medium lg:flex items-center">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-3 py-1.5 rounded-full transition-all duration-200 ${
                    active
                      ? "bg-purple-100/90 text-purple-950 font-bold shadow-sm"
                      : item.highlight
                      ? "text-purple-700 hover:bg-purple-50 font-semibold"
                      : "text-muted-foreground hover:text-purple-950 hover:bg-purple-50/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Basket */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {user ? (
              <Link
                to="/account"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border border-purple-200/80 bg-white/90 text-plum hover:bg-purple-50 transition-colors shadow-sm"
                title="Your Account"
              >
                <User className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex text-xs font-semibold text-purple-700 hover:text-purple-950 px-2.5 py-1.5 rounded-full hover:bg-purple-50 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Shopping Basket Button */}
            <button
              onClick={() => openCartDrawer()}
              className="relative rounded-full btn-royal px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              aria-label="Open basket"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Basket</span>
              {count > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-plum shadow-inner animate-pulse">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full border border-purple-200/80 bg-white text-plum hover:bg-purple-50 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-In Navigation Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-[#461c48]/40 backdrop-blur-sm lg:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-[#FAF8F5] p-6 shadow-2xl border-l border-purple-200/80 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-purple-200/70">
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="Inventive Queen" className="h-10 w-10 rounded-full object-cover border border-purple-200 shadow-sm" />
                    <div>
                      <h3 className="font-display font-bold text-plum text-base">Inventive Queen</h3>
                      <p className="text-[10px] uppercase tracking-wider text-purple-600 font-semibold">Royal Crochet Atelier</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-purple-100/60 text-muted-foreground hover:text-plum transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="py-6 space-y-1.5">
                  {navLinks.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-purple-100 text-purple-950 font-bold border border-purple-200/80 shadow-sm"
                            : item.highlight
                            ? "bg-purple-50/70 text-purple-800 hover:bg-purple-100/80 border border-purple-200/50"
                            : "text-plum/80 hover:bg-purple-50 hover:text-plum"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.highlight && <Sparkles size={14} className="text-amber-500" />}
                      </Link>
                    );
                  })}
                </div>

                {/* Account & Policies in drawer */}
                <div className="pt-4 border-t border-purple-200/60 space-y-2">
                  {user ? (
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-plum hover:bg-purple-50 transition-colors"
                    >
                      <User size={15} className="text-purple-600" />
                      <span>Your Account Profile</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      <User size={15} className="text-purple-600" />
                      <span>Sign In / Create Account</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-6 border-t border-purple-200/70 space-y-3">
                <a
                  href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20would%20like%20to%20inquire%20about%20a%20crochet%20commission."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-md"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp Atelier Support</span>
                </a>

                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">100% Milk Cotton Yarn • Made in India</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Direct Hotline: +91 7892305330</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
