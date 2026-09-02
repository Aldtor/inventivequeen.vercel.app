import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, X, ChevronDown, Sparkles, Crown, Search } from "lucide-react";
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
  useEffect(() => { setOpen(false); setInfoDropdown(false); }, [location.pathname]);

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
    { label: "Dolls", action: () => handleScrollTo("pricelist"), active: location.hash === "#pricelist" },
    { label: "Characters", action: () => handleScrollTo("pricelist"), active: false },
    { label: "Flowers", action: () => handleScrollTo("categories"), active: location.hash === "#categories" },
    { label: "Catalogue", action: () => handleScrollTo("catalogue"), active: location.hash === "#catalogue" },
    { label: "How to order", action: () => handleScrollTo("how-to-order"), active: location.hash === "#how-to-order" },
  ];

  return (
    <>
      {/* ── Announcement Banner ── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="scarcity-line flex items-center justify-center gap-2 px-4 relative z-50">
              <Crown size={12} className="text-amber-500 flex-shrink-0" />
              <span className="font-medium">
                <strong className="tracking-wide">LIMITED SLOTS</strong>: Custom crochet orders are currently OPEN! Processing time: 3–5 days.
              </span>
              <a
                href="#how-to-order"
                className="underline underline-offset-2 font-semibold ml-1 text-primary hover:opacity-80 transition-opacity hidden sm:inline"
              >
                Learn more →
              </a>
              <button
                onClick={() => setBannerVisible(false)}
                className="absolute right-3 sm:right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Dismiss banner"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Navbar ── */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/92 backdrop-blur-2xl shadow-luxury-sm border-b border-border/60"
            : "bg-background/80 backdrop-blur-xl border-b border-border/40"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-[72px] gap-3">
          {/* ── Brand Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300 shadow-sm">
                <img
                  src={logo}
                  alt="Inventive Queen"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 text-[10px] select-none drop-shadow-sm">👑</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base md:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200 leading-none">
                Inventive Queen
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary/70 font-bold mt-0.5">
                Royal Crochet Atelier
              </span>
            </div>

            {/* Orders OPEN badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-semibold ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Orders OPEN</span>
            </div>
          </Link>

          {/* ── Desktop Search ── */}
          <div className="hidden lg:flex flex-1 max-w-xs mx-3">
            <SearchBar />
          </div>

          {/* ── Desktop Navigation Pills ── */}
          <ul className="hidden md:flex items-center gap-1">
            {navPills.map((p) => (
              <li key={p.label}>
                <button
                  onClick={p.action}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    p.active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                  }`}
                >
                  {p.label}
                </button>
              </li>
            ))}

            {/* Info Dropdown */}
            <li className="relative">
              <button
                onClick={() => setInfoDropdown(!infoDropdown)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors flex items-center gap-1"
              >
                <span>Info</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${infoDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {infoDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/80 shadow-luxury-lg py-2 z-50 text-xs"
                  >
                    <button
                      onClick={() => handleScrollTo("why-choose-us")}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/8 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <Crown size={13} className="text-amber-500" />
                      About Atelier
                    </button>
                    <button
                      onClick={() => handleScrollTo("terms")}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/8 hover:text-primary transition-colors"
                    >
                      Terms & Conditions
                    </button>
                    <button
                      onClick={() => { setInfoDropdown(false); setContactOpen(true); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/8 hover:text-primary transition-colors"
                    >
                      Contact & Inquiries
                    </button>
                    <div className="mx-3 my-1 h-px bg-border/60" />
                    <Link
                      to="/custom-orders"
                      onClick={() => setInfoDropdown(false)}
                      className="w-full block px-4 py-2.5 text-primary font-semibold hover:bg-primary/8 transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={13} className="text-amber-500" />
                      Custom Bespoke Orders
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* ── Right Action Icons ── */}
          <div className="flex items-center gap-1.5">
            <Link
              to={user ? "/account" : "/login"}
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-200"
              aria-label={user ? "Account" : "Sign in"}
            >
              <User size={18} />
            </Link>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2.5 rounded-full text-foreground hover:bg-secondary/70 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu Overlay ── */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden border-t border-border/60 bg-background/98 backdrop-blur-2xl px-5 py-5 overflow-hidden"
            >
              <div className="mb-4">
                <SearchBar />
              </div>
              <ul className="space-y-1">
                {navPills.map((p, i) => (
                  <motion.li
                    key={p.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.25 }}
                  >
                    <button
                      onClick={p.action}
                      className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                        p.active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      {p.label}
                    </button>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navPills.length * 0.05, duration: 0.25 }}
                >
                  <button
                    onClick={() => handleScrollTo("terms")}
                    className="w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Terms & Conditions
                  </button>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navPills.length + 1) * 0.05, duration: 0.25 }}
                >
                  <div className="pt-2 mt-2 border-t border-border/50">
                    <Link
                      to="/custom-orders"
                      onClick={() => setOpen(false)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold btn-gradient text-white shadow-md"
                    >
                      <Sparkles size={15} className="text-amber-200" />
                      Custom Bespoke Orders ✨
                    </Link>
                  </div>
                </motion.li>
                {isAdmin && (
                  <motion.li
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navPills.length + 2) * 0.05, duration: 0.25 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="w-full block py-2.5 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Navbar;
