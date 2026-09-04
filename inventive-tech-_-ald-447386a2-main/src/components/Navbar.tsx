import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, ChevronDown, Sparkles, Crown, Search, Heart, MessageCircle } from "lucide-react";
import { getCartCount, CART_UPDATED_EVENT } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import SearchBar from "@/components/SearchBar";
import ContactModal from "@/components/ContactModal";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [infoDropdown, setInfoDropdown] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartCount());
    updateCartCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setInfoDropdown(false);
  }, [location.pathname]);

  const handleScrollTo = (id: string) => {
    setOpen(false);
    setInfoDropdown(false);
    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const navPills = [
    { label: "Home", action: () => { setOpen(false); navigate("/"); }, active: location.pathname === "/" && !location.hash },
    { label: "Forever Flowers", action: () => { setOpen(false); navigate("/category/bouquet"); }, active: location.pathname.includes("/category/bouquet") },
    { label: "Keepsake Dolls", action: () => { setOpen(false); navigate("/category/doll"); }, active: location.pathname.includes("/category/doll") },
    { label: "Pocket Charms", action: () => { setOpen(false); navigate("/category/keychain"); }, active: location.pathname.includes("/category/keychain") },
    { label: "Custom Studio", action: () => { setOpen(false); navigate("/custom-orders"); }, active: location.pathname === "/custom-orders" },
  ];

  return (
    <>
      {/* ── Top Royal Atelier Announcement Ribbon ── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden relative z-50"
          >
            <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-inner border-b border-purple-600/40">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/25 border border-amber-300/40 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                <Crown size={11} className="text-amber-300" />
                Royal Atelier
              </span>
              <span className="hidden sm:inline text-purple-100">
                🌸 Bespoke Custom Commissions are currently <strong className="font-bold text-white underline decoration-amber-300/60 underline-offset-2">OPEN</strong>!
              </span>
              <span className="sm:hidden text-purple-100">
                🌸 Custom orders are <strong className="font-bold text-white">OPEN</strong>!
              </span>
              <span className="text-purple-300 text-[11px] hidden md:inline">• Turnaround: 3–5 Days</span>
              <Link
                to="/custom-orders"
                className="underline underline-offset-2 font-bold ml-1 text-amber-200 hover:text-white transition-colors text-xs"
              >
                Order Custom Piece →
              </Link>
              <button
                onClick={() => setBannerVisible(false)}
                className="absolute right-3 sm:right-5 text-white/70 hover:text-white transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Floating Capsule Navbar ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "glass-navbar shadow-luxury py-2.5"
            : "bg-background/80 backdrop-blur-md py-3.5 border-b border-purple-100/80"
        }`}
      >
        <div className="container max-w-7xl flex items-center justify-between gap-3">
          {/* ── Brand Logo & Royal Avatar ── */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-400 via-pink-300 to-amber-300 shadow-md group-hover:shadow-royal transition-all duration-300">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Inventive Queen"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs select-none filter drop-shadow">👑</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-bold tracking-tight text-purple-950 group-hover:text-purple-700 transition-colors duration-200 leading-tight">
                Inventive Queen
              </span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-purple-600 font-bold">
                Royal Crochet Atelier
              </span>
            </div>

            {/* Commissions Status Pill */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold ml-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Slots Available</span>
            </div>
          </Link>

          {/* ── Desktop Live Search ── */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm mx-4">
            <SearchBar />
          </div>

          {/* ── Desktop Navigation Navigation Pills ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navPills.map((p) => (
              <button
                key={p.label}
                onClick={p.action}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  p.active
                    ? "bg-purple-100/90 text-purple-900 border border-purple-200/80 shadow-sm"
                    : "text-purple-900/75 hover:text-purple-950 hover:bg-purple-50/80"
                }`}
              >
                {p.label}
              </button>
            ))}

            {/* Info Dropdown */}
            <div className="relative">
              <button
                onClick={() => setInfoDropdown(!infoDropdown)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-purple-900/75 hover:text-purple-950 hover:bg-purple-50/80 transition-colors flex items-center gap-1"
              >
                <span>Atelier</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${infoDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {infoDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-2xl border border-purple-100 shadow-luxury-lg py-2 z-50 text-xs"
                  >
                    <button
                      onClick={() => handleScrollTo("why-choose-us")}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-purple-950 transition-colors flex items-center gap-2.5 font-medium"
                    >
                      <Crown size={14} className="text-amber-500" />
                      About Our Atelier
                    </button>
                    <button
                      onClick={() => handleScrollTo("terms")}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-purple-950 transition-colors flex items-center gap-2.5 font-medium"
                    >
                      <span>📜</span>
                      Ordering & Terms
                    </button>
                    <button
                      onClick={() => { setInfoDropdown(false); setContactOpen(true); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-purple-50 text-purple-950 transition-colors flex items-center gap-2.5 font-medium"
                    >
                      <MessageCircle size={14} className="text-purple-600" />
                      Direct Inquiry & FAQ
                    </button>
                    <div className="mx-3 my-1.5 h-px bg-purple-100" />
                    <Link
                      to="/custom-orders"
                      onClick={() => setInfoDropdown(false)}
                      className="w-full px-4 py-2.5 text-purple-700 font-bold hover:bg-purple-50 transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      Bespoke Custom Studio
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* ── Right Action Controls ── */}
          <div className="flex items-center gap-2">
            {/* Custom Commission Button */}
            <Link
              to="/custom-orders"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-gradient text-xs font-bold text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles size={13} className="text-amber-200" />
              <span>Commission Bespoke</span>
            </Link>

            {/* User Profile */}
            <Link
              to={user ? "/account" : "/login"}
              className="p-2.5 rounded-full text-purple-900/75 hover:text-purple-950 hover:bg-purple-100/70 transition-all duration-200 border border-transparent hover:border-purple-200/60"
              aria-label={user ? "Account" : "Sign in"}
              title={user ? "My Account" : "Sign In"}
            >
              <User size={18} />
            </Link>

            {/* Shopping Bag */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-purple-900/75 hover:text-purple-950 hover:bg-purple-100/70 transition-all duration-200 border border-transparent hover:border-purple-200/60"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-gradient-to-tr from-purple-600 to-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2.5 rounded-full text-purple-950 hover:bg-purple-100/70 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden border-t border-purple-100 bg-white/95 backdrop-blur-2xl px-5 py-5 overflow-hidden shadow-2xl"
            >
              <div className="mb-4">
                <SearchBar />
              </div>
              <ul className="space-y-1 text-sm font-semibold">
                {navPills.map((p) => (
                  <li key={p.label}>
                    <button
                      onClick={p.action}
                      className={`w-full text-left py-2.5 px-4 rounded-2xl transition-colors ${
                        p.active
                          ? "bg-purple-100 text-purple-900 font-bold"
                          : "text-purple-900/80 hover:bg-purple-50 hover:text-purple-950"
                      }`}
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handleScrollTo("terms")}
                    className="w-full text-left py-2.5 px-4 rounded-2xl text-purple-900/80 hover:bg-purple-50 hover:text-purple-950 transition-colors"
                  >
                    Terms & FAQ
                  </button>
                </li>
                <li className="pt-3">
                  <Link
                    to="/custom-orders"
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold btn-gradient text-white shadow-md"
                  >
                    <Sparkles size={16} className="text-amber-200" />
                    Bespoke Custom Orders ✨
                  </Link>
                </li>
                {isAdmin && (
                  <li className="pt-2">
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="w-full block py-2.5 px-4 rounded-2xl text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors text-center"
                    >
                      Admin Dashboard CMS
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Navbar;
