import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User } from "lucide-react";
import logo from "@/assets/logo.png";
import { getCartCount, openCartDrawer, CART_UPDATED_EVENT } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const [count, setCount] = useState(0);
  const { user } = useAuth();
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

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:pt-4 pointer-events-none">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full glass-card px-4 sm:px-6 py-2.5 pointer-events-auto border border-purple-200/60 shadow-lg backdrop-blur-xl bg-white/80 transition-all duration-300">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src={logo}
              alt="Inventive Queen logo"
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-purple-200 shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute -bottom-1 -right-1 text-[10px] select-none">👑</span>
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

        <nav className="hidden gap-6 text-sm font-medium text-muted-foreground lg:flex">
          <Link to="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/shop" className="transition-colors hover:text-primary">
            Collection
          </Link>
          <Link to="/about" className="transition-colors hover:text-primary">
            The Craft
          </Link>
          <Link to="/reviews" className="transition-colors hover:text-primary">
            Reviews
          </Link>
          <Link to="/how-to-order" className="transition-colors hover:text-primary">
            How to Order
          </Link>
          <Link to="/faq" className="transition-colors hover:text-primary">
            FAQ
          </Link>
          <Link to="/custom-orders" className="transition-colors hover:text-primary font-semibold text-purple-700">
            Custom Studio ✨
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              to="/account"
              className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full border border-purple-200/80 bg-white/80 text-plum hover:bg-purple-50 transition-colors"
              title="Your Account"
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-semibold text-purple-700 hover:text-purple-900 px-2 py-1 transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => openCartDrawer()}
            className="relative rounded-full btn-royal px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            aria-label="Open basket"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Basket</span>
            {count > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-plum shadow-inner animate-pulse">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
