import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Crown,
  Check,
  ArrowRight,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { getCartCount, addCartItem, openCartDrawer, CART_UPDATED_EVENT } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

import logo from "@/assets/logo.png";
import hero from "@/assets/hero.jpg";
import pBear from "@/assets/p-bear.jpg";
import pBouquet from "@/assets/p-bouquet.jpg";
import bouquetGrand from "@/assets/product-bouquet-grand.png";
import strawberryCowKeychain from "@/assets/product-strawberry-cow-keychain.png";
import peacockBookmarkReal from "@/assets/product-peacock-bookmark-real.png";

interface SignaturePiece {
  id: string;
  name: string;
  price: string;
  note: string;
  img: string;
  desc: string;
}

const signaturePieces: SignaturePiece[] = [
  {
    id: "mixed-rose-grand-bouquet",
    name: "Mixed Rose Grand Atelier Bouquet",
    price: "₹799",
    note: "Forever Bouquet · 18 Stems",
    img: bouquetGrand,
    desc: "A majestic symphony of forever roses hand-stitched in milk cotton, wrapped in silk ribbon.",
  },
  {
    id: "lavender-bear",
    name: "Lavender Bear",
    price: "₹1,499",
    note: "Amigurumi · 22 cm",
    img: pBear,
    desc: "A cotton-soft companion with a hand-tied bow and embroidered smile.",
  },
  {
    id: "strawberry-cow-keychain",
    name: "Strawberry Milk Cow Charm",
    price: "₹299",
    note: "Pocket Charm · 8 cm",
    img: strawberryCowKeychain,
    desc: "Adorable pink-and-white strawberry cow plush charm with mini horns and gold clasp.",
  },
  {
    id: "peacock-bookmark",
    name: "Royal Peacock Bookmark",
    price: "₹249",
    note: "Bookmark · Mercerized Cotton",
    img: peacockBookmarkReal,
    desc: "Intricately crocheted peacock feather bookmark with dangling silk tail tassel.",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function CrochetRemixHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bar = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "24%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroRotate = useTransform(heroProgress, [0, 1], [0, -4]);

  useEffect(() => {
    const updateCount = () => setCartCount(getCartCount());
    updateCount();
    window.addEventListener(CART_UPDATED_EVENT, updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  const handleAddToCart = (product: SignaturePiece) => {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      type: "bouquet",
      tagline: product.desc,
      description: product.desc,
      images: [product.img],
      isActive: true,
    });

    setAddedItem(product.id);
    toast.success(`Added ${product.name} to basket!`, {
      description: `${product.price} · Prepared in our royal atelier`,
    });
    openCartDrawer();

    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#461c48] selection:bg-purple-200 selection:text-purple-900 font-sans">
      {/* ── Top Scroll Progress Bar ── */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left btn-royal"
        style={{ scaleX: bar }}
      />

      {/* ── Top Royal Announcement Ribbon ── */}
      <AnimatePresence>
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden relative z-40"
          >
            <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white text-center py-2 px-4 text-xs font-medium tracking-wide flex items-center justify-center gap-2 border-b border-purple-600/30 shadow-sm">
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

      {/* ── Floating Capsule Header ── */}
      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:pt-4 pointer-events-none" style={{ top: bannerVisible ? "34px" : "0px" }}>
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
                Royal Crochet Atelier
              </span>
            </div>
          </Link>

          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground lg:flex">
            <Link className="transition-colors hover:text-primary" to="/shop">
              Collection
            </Link>
            <Link className="transition-colors hover:text-primary" to="/about">
              The Craft
            </Link>
            <Link className="transition-colors hover:text-primary" to="/reviews">
              Reviews
            </Link>
            <Link className="transition-colors hover:text-primary" to="/how-to-order">
              How to Order
            </Link>
            <Link className="transition-colors hover:text-primary" to="/faq">
              FAQ
            </Link>
            <Link className="transition-colors hover:text-primary font-semibold text-purple-700" to="/custom-orders">
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
              {cartCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-plum shadow-inner animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── Parallax Hero Section ── */}
      <section id="top" ref={heroRef} className="relative flex min-h-screen items-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale, opacity: heroFade, rotate: heroRotate }}
        >
          <img
            src={hero}
            alt="Lavender crochet toys, yarn balls and hooks on silk"
            width={1600}
            height={1104}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/80 sm:via-[#FAF8F5]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-transparent opacity-90" />
        </motion.div>

        <div className="relative mx-auto w-full max-w-6xl px-6 pt-36 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-3.5 py-1 text-xs uppercase tracking-[0.32em] text-purple-800 backdrop-blur-md shadow-sm"
          >
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Handmade in Bengaluru · Shipped Pan-India</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl font-display text-5xl leading-[1.06] text-plum sm:text-6xl md:text-7xl font-medium tracking-tight"
          >
            Stitched slowly,
            <span className="block italic text-gradient font-normal">kept forever.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground font-normal"
          >
            Amigurumi, everlasting flower bouquets, mascots and heirloom throws — each one crocheted
            by hand in soft milk cotton, one loop at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="rounded-full btn-royal px-8 py-3.5 text-sm font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all"
            >
              Explore the collection
            </Link>
            <Link
              to="/custom-orders"
              className="rounded-full border border-purple-300/80 bg-white/80 px-6 py-3.5 text-sm font-semibold text-plum hover:bg-purple-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Custom Commissions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 ml-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Ready to ship in 3–5 days
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <div className="relative border-y border-purple-200/60 bg-white/50 py-4 backdrop-blur-md overflow-hidden">
        <motion.div
          className="flex w-max gap-12 whitespace-nowrap text-xs sm:text-sm uppercase tracking-[0.3em] text-purple-900/70 font-semibold"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-12 items-center">
              <span>100% Cotton Yarn</span>
              <span className="text-purple-400">·</span>
              <span>Made to Order</span>
              <span className="text-purple-400">·</span>
              <span>Gift Wrapped with Satin Ribbon</span>
              <span className="text-purple-400">·</span>
              <span>Pan-India Delivery</span>
              <span className="text-purple-400">·</span>
              <span>500+ Verified Commissions</span>
              <span className="text-purple-400">·</span>
              <span>One of a Kind</span>
              <span className="text-purple-400">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Curated 4-Piece Signature Showcase ── */}
      <section id="collection" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Signature Curations</p>
              <h2 className="mt-3 max-w-xl font-display text-4xl sm:text-5xl font-medium text-plum">
                Pieces made to be <span className="italic text-gradient">held</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <span>Explore all 25+ pieces in collection</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 tilt-scene sm:grid-cols-2 lg:grid-cols-4">
          {signaturePieces.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08}>
              <article className="group overflow-hidden rounded-3xl glass-card tilt-3d border border-purple-200/70 shadow-soft bg-white/80 hover:bg-white transition-all duration-500 flex flex-col justify-between">
                <Link to={`/product/${p.id}`} className="relative overflow-hidden aspect-[4/3] sm:h-64 w-full block">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold text-plum shadow-sm">
                    {p.note}
                  </span>
                </Link>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <Link to={`/product/${p.id}`}>
                      <h3 className="font-display text-lg text-plum font-semibold tracking-tight group-hover:text-purple-700 transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-purple-100 pt-3">
                    <span className="font-display text-lg font-bold text-purple-950">
                      {p.price}
                    </span>
                    <button
                      onClick={() => handleAddToCart(p)}
                      className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1 ${
                        addedItem === p.id
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-purple-300/80 bg-purple-50/60 text-plum hover:btn-royal hover:border-transparent"
                      }`}
                      aria-label={`Add ${p.name} to basket`}
                    >
                      {addedItem === p.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Added</span>
                        </>
                      ) : (
                        <span>Add</span>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── The Craft Preview Section ── */}
      <section id="craft" className="relative overflow-hidden py-24 sm:py-28 bg-purple-50/40 border-y border-purple-200/60">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
          <Reveal className="tilt-scene">
            <div className="overflow-hidden rounded-[2.5rem] tilt-3d shadow-lift border border-purple-200/60 bg-white p-2">
              <img
                src={pBouquet}
                alt="Crochet lavender bouquet wrapped in satin ribbon"
                loading="lazy"
                width={912}
                height={1104}
                className="h-full w-full rounded-[2rem] object-cover max-h-[520px]"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The craft</p>
              <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl font-medium">
                Every loop, <span className="italic text-gradient">by hand</span>
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground font-normal text-sm sm:text-base">
                No machines, no shortcuts. Yarn is chosen skein by skein for softness
                and color, then worked into shape across quiet evenings in our studio.
              </p>
            </Reveal>

            <div className="mt-8 space-y-3.5">
              {[
                ["01", "Choose the yarn", "Oeko-Tex certified cotton in lilac, plum, blush and cream."],
                ["02", "Work the stitch", "Tight, even tension so sculpted shapes hold securely for years."],
                ["03", "Finish & wrap", "Hand-sewn fine details, tissue paper and silk ribbon packaging."],
              ].map(([n, t, d], i) => (
                <Reveal key={n} delay={i * 0.1}>
                  <div className="flex gap-4 rounded-2xl glass-card p-4 border border-purple-200/60 bg-white/80 shadow-sm">
                    <span className="font-display text-xl font-bold text-purple-600">{n}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-plum">{t}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-8">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-950 transition-colors"
              >
                <span>Watch video reels & explore our studio story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bespoke Custom Commissions Card ── */}
      <section id="care" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] glass-card px-8 py-20 text-center border border-purple-200/80 shadow-lift bg-gradient-to-b from-white/90 to-purple-50/70">
            <img
              src={logo}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-15 float-slow object-contain"
            />
            <h2 className="mx-auto max-w-xl font-display text-4xl text-plum sm:text-5xl font-medium">
              Looking for something <span className="italic text-gradient">only yours?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
              Custom colours, sizes, personalized flower arrangements and little embroidered names — tell us what you
              imagine and we'll crochet it for you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/custom-orders"
                className="inline-block rounded-full btn-royal px-8 py-3.5 text-xs uppercase tracking-wider font-semibold shadow-md hover:shadow-xl transition-all"
              >
                Request a custom piece
              </Link>
              <a
                href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20would%20like%20to%20order%20a%20custom%20crochet%20piece."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Chat on WhatsApp (+91 7892305330)</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-purple-200/50 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
              <Link to="/reviews" className="hover:text-purple-700 transition-colors font-medium">★ 500+ Verified Patron Reviews</Link>
              <span>·</span>
              <Link to="/how-to-order" className="hover:text-purple-700 transition-colors font-medium">How to Order Guide</Link>
              <span>·</span>
              <Link to="/faq" className="hover:text-purple-700 transition-colors font-medium">Frequently Asked Questions</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Clean Elegant Atelier Footer ── */}
      <footer className="border-t border-purple-200/60 py-12 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-purple-100">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Inventive Queen" className="h-9 w-9 rounded-full object-cover border border-purple-200" />
              <div>
                <span className="font-display text-plum font-semibold text-base">Inventive Queen</span>
                <p className="text-[10px] uppercase tracking-wider text-purple-600 font-bold">Royal Crochet Atelier</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-plum">
              <Link to="/shop" className="hover:text-purple-700 transition-colors">The Collection</Link>
              <Link to="/about" className="hover:text-purple-700 transition-colors">The Craft & Studio</Link>
              <Link to="/reviews" className="hover:text-purple-700 transition-colors">Reviews</Link>
              <Link to="/how-to-order" className="hover:text-purple-700 transition-colors">How to Order</Link>
              <Link to="/custom-orders" className="hover:text-purple-700 transition-colors">Custom Studio</Link>
              <Link to="/faq" className="hover:text-purple-700 transition-colors">FAQ</Link>
              <Link to="/policy/shipping-policy" className="hover:text-purple-700 transition-colors">Policies</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Inventive Queen — Crocheted with love & royal care in India</p>
            <p>Direct Support: <a href="tel:+917892305330" className="underline font-bold text-plum">+91 7892305330</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
