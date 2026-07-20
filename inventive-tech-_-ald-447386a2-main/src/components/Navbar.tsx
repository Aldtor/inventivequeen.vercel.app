import { useEffect, useState } from "react";
import { Menu, ShieldCheck, ShoppingBag, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpg";
import ContactModal from "./ContactModal";
import SearchBar from "./SearchBar";
import { CART_UPDATED_EVENT, getCartCount } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

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

  const handleShop = () => {
    if (window.location.pathname === "/") {
      document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#categories");
    }
  };

  const links = [
    { label: "Home", onClick: () => navigate("/") },
    { label: "Shop", onClick: handleShop },
    { label: "Custom Orders", onClick: () => navigate("/custom-orders") },
    { label: "Contact", onClick: () => setContactOpen(true) },
  ];

  return (
    <>
      <div className="scarcity-line" role="banner">
        Only limited pieces made daily · Handcrafted specially for you
      </div>

      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/60">
        <div className="container flex items-center justify-between h-16 md:h-[72px]">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Inventive Queen logo"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shadow-sm ring-2 ring-brand-blush group-hover:ring-primary/40 transition-all duration-300"
            />
            <span className="font-display text-lg md:text-xl font-semibold text-foreground">
              Inventive Queen
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <SearchBar />
          </div>

          <ul className="hidden md:flex items-center gap-7">
            {links.map((link) => (
              <li key={link.label}>
                <button
                  onClick={link.onClick}
                  className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="hidden sm:flex w-10 h-10 rounded-full text-foreground hover:text-primary hover:bg-brand-blush/30 items-center justify-center transition-all active:scale-95"
                aria-label="Open admin panel"
              >
                <ShieldCheck size={20} />
              </button>
            )}
            <button
              onClick={() => navigate(user ? "/orders" : "/login")}
              className="hidden sm:flex w-10 h-10 rounded-full text-foreground hover:text-primary hover:bg-brand-blush/30 items-center justify-center transition-all active:scale-95"
              aria-label={user ? "Open my orders" : "Sign in"}
            >
              <UserRound size={20} />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="relative w-10 h-10 rounded-full text-foreground hover:text-primary hover:bg-brand-blush/30 flex items-center justify-center transition-all active:scale-95"
              aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-body font-bold flex items-center justify-center shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu with Framer Motion */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t border-border/60 bg-background overflow-hidden"
            >
              <div className="container pt-4">
                <SearchBar variant="mobile" onNavigate={() => setOpen(false)} />
              </div>
              <ul className="container py-4 flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        link.onClick();
                      }}
                      className="block w-full text-left py-2.5 px-3 rounded-xl font-body text-sm font-medium text-muted-foreground hover:text-primary hover:bg-brand-blush/30 transition-all duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                {isAdmin && (
                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin");
                      }}
                      className="block w-full text-left py-2.5 px-3 rounded-xl font-body text-sm font-medium text-muted-foreground hover:text-primary hover:bg-brand-blush/30 transition-all duration-200"
                    >
                      Admin Panel
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate(user ? "/orders" : "/login");
                    }}
                    className="block w-full text-left py-2.5 px-3 rounded-xl font-body text-sm font-medium text-muted-foreground hover:text-primary hover:bg-brand-blush/30 transition-all duration-200"
                  >
                    {user ? "My Orders" : "Sign In"}
                  </button>
                </li>
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
