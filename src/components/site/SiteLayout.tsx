import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Crown,
  Instagram,
  LogOut,
  Mail,
  Menu,
  Package,
  ShoppingBag,
  Sparkles,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import { addToCart, getCartCount, parsePrice } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { useStoreSettings } from "@/lib/store-settings";

import { CookieConsent } from "./CookieConsent";

export const INSTAGRAM_URL = "https://www.instagram.com/inventivequeen";

const MAIN_NAV = [
  { to: "/", label: "Home" },
  { to: "/dolls", label: "Dolls" },
  { to: "/characters", label: "Characters" },
  { to: "/flowers", label: "Flowers" },
  { to: "/orders", label: "My Orders" },
] as const;

const MORE_NAV = [
  { to: "/how-to-order", label: "How to order" },
  { to: "/reviews", label: "Reviews & Stories" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

const LEGAL_NAV = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund-policy", label: "Refund & Cancellation" },
  { to: "/cookies", label: "Cookie Policy" },
] as const;

function MoreMenu({ className = "" }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors outline-none hover:text-lilac-deep data-[state=open]:text-lilac-deep ${className}`}
      >
        More
        <ChevronDown className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="liquid-glass w-52 rounded-2xl border-0 p-2"
      >
        {MORE_NAV.map((item) => (
          <DropdownMenuItem key={item.to} asChild className="rounded-xl">
            <Link
              to={item.to}
              className="w-full cursor-pointer px-3 py-2 text-sm font-semibold text-lilac-deep"
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AnnouncementBar() {
  const { settings } = useStoreSettings();

  return (
    <div className="relative overflow-hidden bg-lilac-deep text-primary-foreground">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-xs sm:text-sm">
        {settings.announcementBadge && (
          <span className="skeu-badge inline-flex items-center gap-1">
            <Sparkles className="size-2.5 text-amber-500" />
            <span>{settings.announcementBadge.replace(/[^\w\s-]/g, "").trim()}</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Crown className="size-3.5 text-amber-300 inline shrink-0" />
          <span>{settings.announcementText.replace(/[^\w\s!?,.()'-]/g, "").trim()}</span>
        </span>
        {settings.announcementLink && (
          <Link
            to={settings.announcementLink}
            className="font-semibold underline underline-offset-4 hover:text-white/90 transition-colors"
          >
            {settings.announcementLinkLabel || "Learn more →"}
          </Link>
        )}
      </div>
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, profile, isAdmin, signOut } = useAuth();

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-x-0 border-t-0">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="relative size-11 sm:size-12 shrink-0 rounded-full p-[2px] bg-gradient-to-br from-lilac via-pink-200 to-primary shadow-sm ring-1 ring-white/60 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:ring-primary/30">
              <div className="size-full rounded-full overflow-hidden bg-[#F6EBF2] flex items-center justify-center">
                <img
                  src={logo}
                  alt="Inventive Queen"
                  width={52}
                  height={52}
                  className="size-full object-cover object-[50%_46%] scale-[1.28] transition-transform duration-300 group-hover:scale-[1.38]"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-[22px] font-black tracking-tight text-lilac-deep leading-none whitespace-nowrap transition-colors group-hover:text-primary">
                  Inventive Queen
                </span>
                <Crown className="size-3.5 text-amber-500 fill-amber-300 drop-shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9.5px] sm:text-[10px] font-extrabold tracking-[0.2em] text-primary/85 uppercase leading-none whitespace-nowrap">
                  Handmade Atelier
                </span>
                <span className="size-1 rounded-full bg-lilac/70 hidden sm:inline-block" />
                <span className="text-[9.5px] font-semibold text-muted-foreground hidden sm:inline-block whitespace-nowrap">
                  Crochet & Keepsakes
                </span>
              </div>
            </div>
          </Link>

          <span className="hidden md:inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full border border-emerald-300/70 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-emerald-800 shadow-sm">
            <span className="relative flex size-2 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>Online Store</span>
          </span>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "glass text-lilac-deep" }}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-muted-foreground transition-all hover:text-lilac-deep hover:bg-white/30"
              >
                {item.label}
              </Link>
            ))}
            <MoreMenu />
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* Basket Button */}
            <Link
              to="/checkout"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-bold shadow-md hover:scale-105 transition-transform"
            >
              <ShoppingBag className="size-4" />
              <span>Basket</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-xs font-black text-lilac-deep">
                {cartCount}
              </span>
            </Link>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-1.5">
                {isAdmin && (
                  <Link
                    to="/admin"
                    search={{ tab: "overview" }}
                    className="bg-amber-100/90 text-amber-900 border border-amber-300/80 hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black sm:inline-flex hover:bg-amber-200 transition-colors shadow-sm"
                  >
                    <Crown className="size-3.5 text-amber-700" /> CMS
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="clay hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-lilac-deep sm:inline-flex hover:bg-white/40 transition-all hover:scale-105"
                  title="Royal Account Profile & Settings"
                >
                  <UserIcon className="size-3.5" />
                  <span className="max-w-[100px] truncate">
                    {profile?.full_name || user.email?.split("@")[0] || "Account"}
                  </span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="rounded-full p-2 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="clay hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold text-lilac-deep sm:inline-flex hover:bg-white/40 transition-colors"
              >
                <UserIcon className="size-3.5" /> Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center rounded-full p-2 text-lilac-deep lg:hidden hover:bg-white/30 transition-colors cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav
          className={`flex items-center gap-1 overflow-x-auto border-t border-white/40 px-4 py-2 lg:hidden transition-all duration-300 ${mobileOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0 overflow-hidden border-t-0 py-0"}`}
        >
          {MAIN_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "glass text-lilac-deep" }}
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap text-muted-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              search={{ tab: "overview" }}
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-black whitespace-nowrap text-amber-900 bg-amber-100 inline-flex items-center gap-1.5"
              onClick={() => setMobileOpen(false)}
            >
              <Crown className="size-3.5 text-amber-700" /> CMS
            </Link>
          )}
          {user ? (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap text-lilac-deep bg-white/60 border border-lilac-deep/20 inline-flex items-center gap-1.5"
            >
              <UserIcon className="size-3.5" />
              <span className="max-w-[120px] truncate">
                {profile?.full_name || user.email?.split("@")[0] || "My Account"}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap text-lilac-deep font-bold"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
          <MoreMenu className="px-3 py-1.5" />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="aurora-rich mt-24 border-t border-white/50">

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="clay-soft rounded-full p-1">
              <img
                src={logo}
                alt="Inventive Queen logo"
                width={48}
                height={48}
                loading="lazy"
                className="size-12 rounded-full object-cover"
              />
            </span>
            <span className="sheen-text font-display text-lg font-bold">Inventive Queen</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Handmade crochet dolls, plushies and flowers that never wilt — every piece made to
            order, stitch by stitch.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Pricelists</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {MAIN_NAV.slice(1).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-lilac-deep transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Info</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {MORE_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-lilac-deep transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/profile" className="hover:text-lilac-deep transition-colors">
                My Profile & Account
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Policies</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {LEGAL_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-lilac-deep transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Say hi</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-lilac-deep transition-colors"
              >
                <Instagram className="size-4" /> @inventivequeen
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="size-4" /> hello@inventivequeen.com
            </li>
            <li className="inline-flex items-center gap-2">
              <Sparkles className="size-4" /> Ships nationwide
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/50 py-5 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground mx-auto max-w-6xl">
        <p className="inline-flex items-center gap-1.5">
          © {new Date().getFullYear()} Inventive Queen · Handmade with royal care{" "}
          <Crown className="size-3.5 text-amber-500 inline shrink-0" />
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {LEGAL_NAV.map((item) => (
            <Link key={item.to} to={item.to} className="hover:text-lilac-deep transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <section className="aurora-rich sparkle-field relative overflow-hidden border-b border-white/50">
      <div className="dotted-bg absolute inset-0 opacity-40" />
      <div
        className="blob pointer-events-none absolute -top-20 -left-20 size-72 bg-primary/40"
        aria-hidden
      />
      <div
        className="blob pointer-events-none absolute top-10 -right-16 size-60 bg-lilac/50"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-5 py-2 text-xs font-black tracking-[0.18em] text-lilac-deep uppercase shadow-md shadow-lilac/10 backdrop-blur-md transition-transform hover:scale-105">
          {icon ?? <Sparkles className="size-3.5 text-amber-500 fill-amber-300" />}
          <span>{eyebrow}</span>
        </span>
        <h1 className="sheen-text mt-5 text-4xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

export function PriceCard({
  id,
  name,
  size,
  price,
  note,
  image,
  badge,
}: {
  id?: string;
  name: string;
  size: string;
  price: string;
  note?: string;
  image: string;
  badge?: string;
}) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const numPrice = parsePrice(price);
  const productId = id || name.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: productId,
      name,
      price,
      numericPrice: numPrice || 999,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({
      id: productId,
      name,
      price,
      numericPrice: numPrice || 999,
      image,
    });
    navigate({ to: "/checkout" });
  };

  return (
    <article className="clay-glow group overflow-hidden img-hover-zoom flex flex-col justify-between transition-all duration-300 hover:shadow-xl relative">
      <Link
        to="/product/$productId"
        params={{ productId }}
        className="block relative z-10 p-2.5 cursor-pointer"
      >
        {badge && (
          <span className="skeu-badge absolute top-5 right-5 z-20 inline-flex items-center gap-1 shadow-md">
            <Sparkles className="size-3 text-amber-500" />
            <span>{badge.replace(/[^\w\s-]/g, "").trim()}</span>
          </span>
        )}
        <img
          src={image}
          alt={name}
          width={900}
          height={900}
          loading="lazy"
          className="aspect-square w-full rounded-[1.6rem] object-cover shadow-lg group-hover:scale-[1.03] transition-transform duration-500"
        />
        {/* Hover shine overlay */}
        <div className="absolute inset-2.5 rounded-[1.6rem] bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      </Link>
      <div className="relative z-10 space-y-2.5 px-6 pb-6 flex-1 flex flex-col justify-between">
        <div>
          <Link
            to="/product/$productId"
            params={{ productId }}
            className="block group/title cursor-pointer"
          >
            <h3 className="font-display text-xl font-bold text-lilac-deep group-hover/title:text-primary transition-colors">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{size}</p>
          <p className="text-lg font-extrabold text-foreground mt-1">{price}</p>
          {note ? <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note}</p> : null}
          <Link
            to="/product/$productId"
            params={{ productId }}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-2 pt-1"
          >
            <span>View details &amp; photos</span>
            <span>→</span>
          </Link>
        </div>

        <div className="pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="clay-primary liquid-btn flex-1 rounded-full py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md hover:scale-102 active:scale-95 transition-all text-center cursor-pointer"
          >
            Buy Now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className={`clay rounded-full py-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              added
                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                : "text-lilac-deep hover:bg-white/40"
            }`}
            title="Add to Basket"
          >
            {added ? (
              <span className="inline-flex items-center gap-1">
                Added <Check className="size-3.5 text-emerald-700" />
              </span>
            ) : (
              "+ Basket"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function OrderCta({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto mt-20 max-w-3xl px-4 text-center">
      <div className="liquid-glass sparkle-field relative overflow-hidden rounded-4xl px-6 py-14">
        <div className="blob absolute -top-16 -left-10 size-56 bg-lilac" />
        <div className="blob absolute -right-10 -bottom-16 size-56 bg-primary/60" />
        <div className="relative z-10">
          <h2 className="sheen-text text-3xl font-extrabold">{title}</h2>
          <p className="mt-3 text-muted-foreground">{text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/checkout"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold"
            >
              <ShoppingBag className="size-4" /> Go to Checkout
            </Link>
            <Link
              to="/how-to-order"
              className="clay inline-flex items-center rounded-full px-6 py-3 font-bold text-lilac-deep"
            >
              How ordering works →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
