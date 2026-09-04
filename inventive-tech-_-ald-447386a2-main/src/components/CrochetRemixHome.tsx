import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Crown,
  Check,
  ArrowRight,
  Star,
  Heart,
  Palette,
  ShieldCheck,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { addCartItem, openCartDrawer } from "@/lib/cart";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";

import logo from "@/assets/logo.png";
import hero from "@/assets/hero.jpg";
import pBear from "@/assets/p-bear.jpg";
import pBouquet from "@/assets/p-bouquet.jpg";
import pCharms from "@/assets/p-charms.jpg";
import catForeverFlowers from "@/assets/cat-forever-flowers.jpg";
import catKeepsakeDolls from "@/assets/cat-keepsake-dolls.jpg";
import heroLuxuryAtelier from "@/assets/hero-luxury-atelier.jpg";
import bouquetGrand from "@/assets/product-bouquet-grand.png";
import strawberryCowKeychain from "@/assets/product-strawberry-cow-keychain.png";
import peacockBookmarkReal from "@/assets/product-peacock-bookmark-real.png";
import videoTeddy1 from "@/assets/video-teddy-1.mp4";

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

const categoryCards = [
  {
    title: "Forever Flowers",
    subtitle: "18-Stem Bouquets & Single Blooms",
    image: catForeverFlowers,
    href: "/category/bouquet",
    count: "12+ Designs",
    tag: "Most Gifted",
  },
  {
    title: "Keepsake Dolls",
    subtitle: "Amigurumi Bears, Bunnies & Plushies",
    image: catKeepsakeDolls,
    href: "/category/doll",
    count: "8+ Companions",
    tag: "Heirloom",
  },
  {
    title: "Pocket Charms",
    subtitle: "Strawberry Cows, Dinos & Owls",
    image: pCharms,
    href: "/category/keychain",
    count: "10+ Charms",
    tag: "From ₹249",
  },
  {
    title: "Artisan Bookmarks",
    subtitle: "Peacock Feathers & Floral Ribbons",
    image: peacockBookmarkReal,
    href: "/category/bookmark",
    count: "Hand-Spun",
    tag: "Pure Cotton",
  },
];

const yarnSwatches = [
  { name: "Royal Plum", color: "#541B5C", desc: "Signature deep regal hue" },
  { name: "Lavender Mist", color: "#C084FC", desc: "Soothing pastel purple" },
  { name: "Strawberry Cream", color: "#F472B6", desc: "Soft blush pink" },
  { name: "Pearl White", color: "#FDF8F3", desc: "Pure combed milk cotton" },
  { name: "Buttercup Gold", color: "#FBBF24", desc: "Warm sunny glow" },
  { name: "Sage Meadow", color: "#34D399", desc: "Calming leafy green" },
];

const patronReviews = [
  {
    name: "Aanya S.",
    city: "Mumbai",
    rating: 5,
    piece: "Mixed Rose Grand Bouquet",
    text: "The bouquet arrived in the most gorgeous wax-sealed box! You can feel the hours of patient love poured into every single petal. It will never wither!",
  },
  {
    name: "Rohan & Meera",
    city: "Bengaluru",
    rating: 5,
    piece: "Lavender Bear + Custom Initials",
    text: "Ordered a custom lavender bear with our daughter's initials embroidered. It's so velvety soft and sturdy. Definitely our family's favorite keepsake.",
  },
  {
    name: "Priyanka M.",
    city: "Delhi NCR",
    rating: 5,
    piece: "Strawberry Cow & Peacock Bookmark",
    text: "The details on the peacock feather bookmark are mind-blowing! And the strawberry cow charm is my everyday bag companion. 10/10 craftsmanship.",
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
      initial={{ opacity: 0, y: 35, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function CrochetRemixHome() {
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [activeSwatch, setActiveSwatch] = useState(yarnSwatches[0]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bar = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);

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
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-[#461c48] selection:bg-purple-200 selection:text-purple-900 font-sans">
      {/* ── Top Scroll Progress Bar ── */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left btn-royal"
        style={{ scaleX: bar }}
      />

      {/* ── Master Floating Header ── */}
      <SiteHeader />

      {/* ── Ambient Background Lighting ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-tr from-purple-400/25 via-pink-200/20 to-amber-200/30 blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-purple-300/20 via-pink-300/15 to-transparent blur-[130px]" />
        <div className="absolute top-[65%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-100/30 via-purple-200/20 to-transparent blur-[140px]" />
      </div>

      <main className="pt-24 sm:pt-32">
        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION
           ══════════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative mx-auto max-w-6xl px-6 pb-20 pt-6 sm:pt-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2.5 rounded-full border border-purple-300/80 bg-gradient-to-r from-purple-50/90 via-white to-amber-50/70 px-4 py-1.5 shadow-[0_4px_16px_rgba(84,27,92,0.06)] backdrop-blur-xl"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400/20 text-amber-600 shadow-inner">
                  <Crown size={12} className="fill-amber-400 text-amber-500" />
                </span>
                <span className="text-[10.5px] font-black uppercase tracking-[0.24em] text-purple-950">
                  Royal Haute Crochet Atelier
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 font-display text-5xl leading-[1.05] text-plum sm:text-6xl md:text-7xl font-extrabold tracking-tight"
              >
                Stitched slowly,
                <span className="block font-serif italic font-normal bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  kept forever.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#542a58]/85 font-normal"
              >
                Everlasting floral bouquets, heirloom amigurumi companions, and bespoke keepsakes — each one
                sculpted stitch-by-stitch with combed milk cotton yarn and pure devotion.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-9 flex flex-wrap items-center gap-3.5"
              >
                <Link
                  to="/shop"
                  className="rounded-full btn-royal px-8 py-3.5 text-sm font-bold tracking-wide shadow-[0_12px_28px_-6px_rgba(84,27,92,0.35)] hover:shadow-[0_18px_38px_-6px_rgba(84,27,92,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Explore The Collection</span>
                </Link>
                <Link
                  to="/custom-orders"
                  className="rounded-full border border-purple-300/90 bg-white/95 px-6 py-3.5 text-sm font-bold text-plum hover:bg-purple-50 transition-colors shadow-[0_4px_16px_rgba(84,27,92,0.06)] hover:shadow-md flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Bespoke Studio</span>
                  <ArrowRight size={13} className="text-purple-600" />
                </Link>
              </motion.div>

              {/* Trust Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="mt-9 flex flex-wrap items-center gap-3 text-xs font-bold text-purple-950"
              >
                <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-purple-200/80 shadow-xs backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready to ship in 3–5 days</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-purple-200/80 shadow-xs backdrop-blur-md">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span>500+ Verified Patron Gifts</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-purple-200/80 shadow-xs backdrop-blur-md">
                  <ShieldCheck size={14} className="text-purple-600" />
                  <span>Pan-India Delivery</span>
                </div>
              </motion.div>
            </div>

            {/* Right Hero Visual Showcase (Royal Haute Atelier Brand Emblem & Floating Badges) */}
            <motion.div
              style={{ y: heroY, scale: heroScale }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* Radiant Ambient Royal Aura Behind */}
                <div className="absolute -inset-6 rounded-[3.5rem] bg-gradient-to-tr from-purple-500/30 via-pink-300/30 to-amber-300/35 blur-3xl -z-10" />

                {/* Decorative Dashed Embroidery Stitch Ring */}
                <div className="absolute -inset-3.5 rounded-[3.4rem] border-2 border-dashed border-purple-300/60 pointer-events-none -z-10 animate-pulse" />

                {/* Main Royal Atelier Emblem Showcase Card */}
                <div className="relative overflow-hidden rounded-[3rem] glass-card border-2 border-white/95 shadow-[0_24px_70px_-15px_rgba(84,27,92,0.22)] bg-gradient-to-b from-white/95 via-purple-50/60 to-white/95 backdrop-blur-2xl p-6 sm:p-7 text-center group">
                  {/* Subtle Inner Ambient Glow */}
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-200/40 to-transparent pointer-events-none -z-10" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none -z-10" />

                  {/* Top Atelier Ribbon Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 border border-purple-200/80 shadow-xs mb-3">
                    <Sparkles size={11} className="text-amber-500 fill-amber-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-950">
                      Signature Royal Crest
                    </span>
                    <Sparkles size={11} className="text-amber-500 fill-amber-400" />
                  </div>

                  {/* High-Resolution Brand Character Emblem */}
                  <div className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-[2.2rem] overflow-hidden bg-gradient-to-b from-purple-100/60 via-white to-pink-50/60 border border-purple-200/60 shadow-inner flex items-center justify-center p-2 transition-transform duration-700 group-hover:scale-[1.03]">
                    <img
                      src={logo}
                      alt="Inventive Queen Royal Crochet Atelier Emblem"
                      className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(84,27,92,0.18)]"
                    />
                    {/* Delicate Corner Embroidery Accent */}
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 text-amber-500">
                      <Crown size={14} className="fill-amber-400" />
                    </div>
                  </div>

                  {/* Atelier Brand Title & Credo */}
                  <div className="mt-4">
                    <h2 className="font-display text-xl sm:text-2xl font-black tracking-wider text-plum">
                      INVENTIVE QUEEN
                    </h2>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600 bg-clip-text text-transparent mt-0.5">
                      Haute Crochet Atelier
                    </p>
                    <div className="mt-2.5 flex items-center justify-center gap-2 text-[10px] font-semibold text-purple-900/70">
                      <span>✦ 100% Hand-Stitched</span>
                      <span>•</span>
                      <span>✦ Heirloom Keepsakes</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: 5-Star Patron Rating */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute -right-3 sm:-right-6 -top-3 glass-card px-4 py-2 rounded-2xl border border-white/95 shadow-xl bg-white/95 flex items-center gap-2 backdrop-blur-xl"
                >
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-black text-plum">5.0 Heirloom</span>
                </motion.div>

                {/* Floating Badge 2: 100% Milk Cotton Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65, duration: 0.6 }}
                  className="absolute -left-4 sm:-left-8 bottom-12 glass-card px-4 py-3 rounded-2xl border border-purple-200/90 shadow-xl bg-white/95 flex items-center gap-3 backdrop-blur-xl max-w-[210px]"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-sm shrink-0">
                    🧶
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-plum leading-tight">100% Milk Cotton</p>
                    <p className="text-[9.5px] text-muted-foreground leading-tight mt-0.5">Velvety soft & skin safe</p>
                  </div>
                </motion.div>

                {/* Floating Badge 3: Wax-Sealed Unboxing */}
                <motion.div
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.6 }}
                  className="absolute -right-2 sm:-right-4 bottom-4 glass-card px-3.5 py-2 rounded-2xl border border-amber-300/80 shadow-lg bg-white/95 flex items-center gap-2 backdrop-blur-md text-left"
                >
                  <span className="text-base select-none">🎁</span>
                  <div>
                    <p className="text-[10.5px] font-bold text-plum leading-tight">Wax-Sealed Unboxing</p>
                    <p className="text-[9px] text-purple-700 font-semibold">Signature ribbon pack</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            MARQUEE CRAFT TICKER
           ══════════════════════════════════════════════════════════════ */}
        <div className="relative border-y border-purple-200/70 bg-white/60 py-4 backdrop-blur-md overflow-hidden">
          <motion.div
            className="flex w-max gap-12 whitespace-nowrap text-xs sm:text-sm uppercase tracking-[0.3em] text-purple-950/75 font-bold"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-12 items-center">
                <span>100% Combed Cotton Yarn</span>
                <span className="text-amber-500">✦</span>
                <span>Hand-Stitched in Atelier</span>
                <span className="text-amber-500">✦</span>
                <span>Wax-Sealed Luxury Packaging</span>
                <span className="text-amber-500">✦</span>
                <span>Insured Nationwide Delivery</span>
                <span className="text-amber-500">✦</span>
                <span>Custom Name Embroidery</span>
                <span className="text-amber-500">✦</span>
                <span>500+ Verified Commissions</span>
                <span className="text-amber-500">✦</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VISUAL CATEGORY EXPLORER
           ══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-purple-700 font-bold">Curated Categories</p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-plum">
                  Explore by <span className="italic text-gradient">Creations</span>
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-950 flex items-center gap-1.5 transition-colors self-start md:self-auto"
              >
                <span>View Full Atelier Catalog (25+ Items)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryCards.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 0.1}>
                <Link
                  to={cat.href}
                  className="group relative overflow-hidden rounded-[2rem] glass-card border border-purple-200/80 bg-white/90 shadow-soft hover:shadow-lift transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative overflow-hidden aspect-[4/3] w-full bg-purple-50">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-plum shadow-sm">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-bold text-plum group-hover:text-purple-700 transition-colors">
                          {cat.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
                          {cat.count}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:text-purple-950">
                      <span>Explore pieces</span>
                      <ArrowRight size={13} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            SIGNATURE 4-PIECE SHOWCASE
           ══════════════════════════════════════════════════════════════ */}
        <section id="collection" className="mx-auto max-w-6xl px-6 py-16 sm:py-20 border-t border-purple-200/60">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Signature Curations</p>
                <h2 className="mt-3 max-w-xl font-display text-3xl sm:text-4xl md:text-5xl font-bold text-plum">
                  Pieces made to be <span className="italic text-gradient">cherished</span>
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 transition-colors self-start md:self-auto"
              >
                <span>Browse all 25+ pieces</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {signaturePieces.map((p, i) => (
              <Reveal key={p.id} delay={(i % 4) * 0.08}>
                <article className="group overflow-hidden rounded-[2rem] glass-card border border-purple-200/80 shadow-soft bg-white/90 hover:bg-white hover:shadow-lift transition-all duration-500 flex flex-col justify-between h-full">
                  <Link to={`/product/${p.id}`} className="relative overflow-hidden aspect-[4/3] sm:h-64 w-full block bg-purple-50">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold text-plum shadow-sm">
                      {p.note}
                    </span>
                  </Link>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <Link to={`/product/${p.id}`}>
                        <h3 className="font-display text-lg text-plum font-bold tracking-tight group-hover:text-purple-700 transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-3">
                      <span className="font-display text-xl font-black text-plum">
                        {p.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(p)}
                        className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center gap-1.5 ${
                          addedItem === p.id
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-purple-300/80 bg-purple-50 text-plum hover:btn-royal hover:border-transparent shadow-xs"
                        }`}
                        aria-label={`Add ${p.name} to basket`}
                      >
                        {addedItem === p.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            YARN & COLOR ATELIER SWATCHES
           ══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-6xl px-6 py-20 bg-purple-50/50 rounded-[3rem] border border-purple-200/70 my-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
                <Palette size={13} className="text-purple-700" />
                <span>The Material Story</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-plum">
                Crafted with Certified <span className="italic text-gradient">Milk Cotton</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                We select combed 5-ply milk cotton yarn for its velvety touch, hypoallergenic qualities, and rich color fastness.
              </p>
            </div>
          </Reveal>

          {/* Color Swatches Grid */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {yarnSwatches.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => setActiveSwatch(swatch)}
                className={`p-4 rounded-2xl glass-card border transition-all text-center flex flex-col items-center gap-2.5 ${
                  activeSwatch.name === swatch.name
                    ? "border-purple-500 shadow-md bg-white ring-2 ring-purple-300"
                    : "border-purple-200/80 bg-white/70 hover:bg-white"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full shadow-inner border border-black/10"
                  style={{ backgroundColor: swatch.color }}
                />
                <div>
                  <p className="text-xs font-bold text-plum leading-tight">{swatch.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{swatch.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-950"
            >
              <span>Need custom color combination? Request in Custom Studio</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            THE CRAFT & VIDEO REELS SHOWCASE
           ══════════════════════════════════════════════════════════════ */}
        <section id="craft" className="relative overflow-hidden py-24 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-2">
            <Reveal className="tilt-scene">
              <div className="relative overflow-hidden rounded-[2.5rem] tilt-3d shadow-lift border border-purple-200/80 bg-white p-2">
                <video
                  src={videoTeddy1}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full rounded-[2rem] object-cover max-h-[500px]"
                />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 backdrop-blur-md p-3.5 border border-purple-200/80 shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-plum">Handcrafted in Atelier</p>
                    <p className="text-[10px] text-muted-foreground">Every stitch shaped by hand</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-[10px] font-bold text-purple-900 uppercase">
                    Reel
                  </span>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The craft</p>
                <h2 className="mt-4 font-display text-4xl text-plum sm:text-5xl font-bold">
                  Every loop, <span className="italic text-gradient">by hand</span>
                </h2>
                <p className="mt-5 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
                  No factory assembly lines, no shortcuts. Yarn is chosen skein by skein for softness
                  and color, then worked into shape across quiet evenings in our studio.
                </p>
              </Reveal>

              <div className="mt-8 space-y-3.5">
                {[
                  ["01", "Select Premium Yarn", "Combed milk cotton in lilac, plum, rosewater and cream."],
                  ["02", "Precise Tension Stitching", "Tight, even tension so sculpted dolls and flowers hold their form for years."],
                  ["03", "Wax-Seal Finishing", "Personalized note card, tissue paper and silk ribbon unboxing."],
                ].map(([n, t, d], i) => (
                  <Reveal key={n} delay={i * 0.1}>
                    <div className="flex gap-4 rounded-2xl glass-card p-4 border border-purple-200/70 bg-white/90 shadow-xs">
                      <span className="font-display text-xl font-black text-purple-600">{n}</span>
                      <div>
                        <h3 className="text-sm font-bold text-plum">{t}</h3>
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
                  <span>Explore full atelier story & care guide</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            PATRON PRAISE & REVIEWS
           ══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-t border-purple-200/60">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.4em] text-purple-700 font-bold">Patron Love</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl font-bold text-plum">
                Loved Across <span className="italic text-gradient">India</span>
              </h2>
              <div className="mt-3 flex items-center justify-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-xs font-bold text-plum">4.9 / 5.0 (500+ Reviews)</span>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {patronReviews.map((rev, i) => (
              <Reveal key={rev.name} delay={i * 0.1}>
                <div className="rounded-[2rem] glass-card p-6 sm:p-7 border border-purple-200/80 bg-white/90 shadow-soft flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} size={14} className="fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Patron
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-plum/90 leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-plum">{rev.name}</p>
                      <p className="text-[10px] text-muted-foreground">{rev.city}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                      {rev.piece}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-950"
            >
              <span>Read all 500+ customer reviews</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════
            BESPOKE COMMISSIONS CARD
           ══════════════════════════════════════════════════════════════ */}
        <section id="care" className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] glass-card px-8 py-16 sm:py-20 text-center border border-purple-200/80 shadow-lift bg-gradient-to-b from-white/95 to-purple-50/80">
              <img
                src={logo}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-15 float-slow object-contain"
              />
              <h2 className="mx-auto max-w-xl font-display text-3xl sm:text-4xl md:text-5xl font-bold text-plum">
                Looking for something <span className="italic text-gradient">only yours?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
                Custom colours, sizes, personalized flower arrangements and little embroidered names — tell us what you
                imagine and we'll crochet it for you.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/custom-orders"
                  className="inline-block rounded-full btn-royal px-8 py-3.5 text-xs uppercase tracking-wider font-bold shadow-md hover:shadow-xl transition-all"
                >
                  Request a custom piece
                </Link>
                <a
                  href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20would%20like%20to%20order%20a%20custom%20crochet%20piece."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Chat on WhatsApp (+91 7892305330)</span>
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── Global Luxury Atelier Footer ── */}
      <Footer />
    </div>
  );
}
