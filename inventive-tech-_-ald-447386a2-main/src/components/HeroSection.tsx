import { useState } from "react";
import { ArrowRight, Sparkles, Palette, Crown, ShieldCheck, Heart, Star, Sparkle, Eye, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion/FadeIn";

import logo from "@/assets/logo.png";
import heroLuxuryAtelier from "@/assets/hero-luxury-atelier.jpg";
import catForeverFlowers from "@/assets/cat-forever-flowers.jpg";
import catKeepsakeDolls from "@/assets/cat-keepsake-dolls.jpg";
import productBear from "@/assets/product-purple-bear-heart-keychain.png";
import productRoseBouquet from "@/assets/product-rose-bouquet-ribbon.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productPastelBouquet from "@/assets/product-bouquet-pastel.png";

interface ShowcaseSlide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  tag: string;
  price: string;
  link: string;
}

const showcaseSlides: ShowcaseSlide[] = [
  {
    id: "atelier",
    title: "The Royal Atelier",
    subtitle: "Milk-cotton yarn, bespoke crochet flowers & keepsake plushies",
    badge: "Handcrafted Studio 🪡",
    image: heroLuxuryAtelier,
    tag: "Artisan Atelier",
    price: "From ₹199",
    link: "/custom-orders",
  },
  {
    id: "flowers",
    title: "Everlasting Bouquets",
    subtitle: "Blush roses, golden lilies & eucalyptus that bloom forever",
    badge: "Forever Keepsake 💐",
    image: catForeverFlowers,
    tag: "Forever Flowers",
    price: "From ₹449",
    link: "/category/bouquet",
  },
  {
    id: "dolls",
    title: "Keepsake Dolls & Plush",
    subtitle: "Cuddly royal bears, chibi penguins & love bunnies",
    badge: "Heirloom Plush 🧸",
    image: catKeepsakeDolls,
    tag: "Crochet Dolls",
    price: "From ₹499",
    link: "/category/doll",
  },
  {
    id: "mascot",
    title: "Inventive Queen Mascot",
    subtitle: "Every creation is hand-stitched with love in India",
    badge: "Signature Icon 👑",
    image: logo,
    tag: "Atelier Signature",
    price: "Bespoke",
    link: "/custom-orders",
  },
];

const categoryPills = [
  { label: "Forever Flowers", icon: "💐", path: "/category/bouquet", price: "from ₹449" },
  { label: "Keepsake Dolls", icon: "🧸", path: "/category/doll", price: "from ₹499" },
  { label: "Pocket Charms", icon: "🔑", path: "/category/keychain", price: "from ₹199" },
  { label: "Bookmarks", icon: "🔖", path: "/category/bookmark", price: "from ₹249" },
];

const previewThumbs = [
  { name: "Royal Purple Bear", img: productBear, tag: "Pocket Charm", price: "₹249" },
  { name: "Everlasting Rose Grand", img: productRoseBouquet, tag: "Bouquets", price: "₹799" },
  { name: "Penguin Chibi Doll", img: productPenguin, tag: "Dolls", price: "₹649" },
  { name: "Pastel Dream Posy", img: productPastelBouquet, tag: "Posy", price: "₹449" },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState<ShowcaseSlide>(showcaseSlides[0]);

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24">
      {/* ── Soft Ambient Ethereal Glow Backdrops ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-br from-purple-300/20 via-pink-200/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-20 right-[5%] w-[450px] h-[450px] bg-purple-400/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-[5%] w-[400px] h-[350px] bg-pink-300/15 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="container max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ── Left Column: Royal Narrative, Category Quick Jumps & CTAs ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-purple-200/90 shadow-sm text-purple-900 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
                </span>
                <Crown size={13} className="text-amber-500" />
                <span>Royal Atelier • 100% Hand-Crocheted in India</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-black text-purple-950 tracking-tight leading-[1.08] text-balance">
                Handmade crochet dolls,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600">
                  forever flowers
                </span>{" "}
                & keepsake plushies
              </h1>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p className="mt-5 text-base sm:text-lg text-purple-900/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-balance font-normal">
                Welcome to <strong className="text-purple-950 font-bold">Inventive Queen</strong>. Every single piece is stitched by hand in our private atelier using heirloom-grade milk cotton yarn. From eternal roses that never wilt to custom character dolls, we turn your precious memories into soft yarn magic.
              </p>
            </FadeIn>

            {/* Quick Category Navigation Pills */}
            <FadeIn delay={0.22}>
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {categoryPills.map((pill) => (
                  <Link
                    key={pill.label}
                    to={pill.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-purple-200 text-xs font-semibold text-purple-950 shadow-xs hover:shadow-sm hover:border-purple-300 transition-all active:scale-95"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                    <span className="text-[11px] text-purple-600 font-bold opacity-80">({pill.price})</span>
                  </Link>
                ))}
              </div>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.28}>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full btn-gradient text-white font-bold text-sm shadow-luxury hover:shadow-luxury-lg active:scale-95 transition-all duration-300"
                >
                  <Sparkles size={16} className="text-amber-200" />
                  <span>Commission Bespoke Piece</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href="#catalogue"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/95 hover:bg-white text-purple-950 border-2 border-purple-200/90 font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
                >
                  <Palette size={16} className="text-purple-600" />
                  <span>Explore Collections</span>
                </a>
              </div>
            </FadeIn>

            {/* Trust Metrics Bar */}
            <FadeIn delay={0.34}>
              <div className="mt-10 pt-6 border-t border-purple-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-purple-900/75 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-purple-950 font-bold">4.9/5</span>
                  <span>Royal Rating (1,200+ Reviews)</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-purple-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Heart size={14} className="text-pink-500 fill-pink-500" />
                  <span>100% Milk Cotton Yarn</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-purple-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-purple-600" />
                  <span>Insured All-India Dispatch</span>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column: Interactive Atelier Showcase Card ── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <FadeIn delay={0.15}>
              <div className="relative max-w-md w-full flex flex-col items-center">
                {/* ── Floating Speech Bubble Pill ── */}
                <div className="relative mb-3 self-end mr-4 sm:mr-6 z-20">
                  <div className="speech-bubble-tail px-4 py-2 rounded-2xl bg-white border-2 border-purple-200 shadow-luxury-sm flex items-center gap-2 text-xs font-bold text-purple-950">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Bespoke Commission Slots Open</span>
                    <span className="text-sm">✨</span>
                  </div>
                </div>

                {/* ── Main Interactive Showcase Frame ── */}
                <div className="w-full bg-white/95 rounded-[2.75rem] p-3.5 sm:p-4 shadow-luxury-lg border-4 border-white ring-2 ring-purple-200/70 overflow-hidden relative group">
                  <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[2.25rem] overflow-hidden bg-gradient-to-br from-purple-100/80 via-pink-50/60 to-purple-50 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeSlide.id}
                        src={activeSlide.image}
                        alt={activeSlide.title}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover object-center"
                      />
                    </AnimatePresence>

                    {/* Royal Badge Overlay */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200 shadow-md flex items-center gap-1.5 text-xs font-bold text-purple-950">
                      <Crown size={13} className="text-amber-500" />
                      <span>{activeSlide.badge}</span>
                    </div>

                    {/* Slide Caption Pill */}
                    <div className="absolute bottom-3 left-3 right-3 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-purple-200/80 shadow-md flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-purple-950 truncate">{activeSlide.title}</p>
                        <p className="text-[10px] text-purple-900/70 truncate">{activeSlide.subtitle}</p>
                      </div>
                      <Link
                        to={activeSlide.link}
                        className="flex-shrink-0 text-xs font-bold text-purple-700 hover:text-purple-950 inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ── Slide Selectors: 4 Interactive Showcase Tabs ── */}
                <div className="mt-4 grid grid-cols-4 gap-2 w-full">
                  {showcaseSlides.map((slide) => {
                    const isCurrent = slide.id === activeSlide.id;
                    return (
                      <button
                        key={slide.id}
                        onClick={() => setActiveSlide(slide)}
                        className={`aspect-square rounded-2xl p-1.5 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden border ${
                          isCurrent
                            ? "bg-purple-100/90 border-purple-500 ring-2 ring-purple-300 shadow-md"
                            : "bg-white/90 border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-sm"
                        }`}
                        title={slide.title}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] sm:text-[9px] font-bold text-purple-950 bg-white/95 px-1 py-0.5 rounded shadow-xs whitespace-nowrap">
                          {slide.tag.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Quick Bestseller Thumbnails ── */}
                <div className="mt-4 w-full bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-purple-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>Popular Picks:</span>
                  </span>
                  <div className="flex items-center gap-2">
                    {previewThumbs.map((t) => (
                      <Link
                        key={t.name}
                        to="/custom-orders"
                        className="group flex items-center gap-1 text-[11px] text-purple-800 hover:text-purple-950 font-semibold transition-colors"
                        title={`${t.name} - ${t.price}`}
                      >
                        <img src={t.img} alt={t.name} className="w-5 h-5 rounded-full object-cover border border-purple-200" />
                        <span className="hidden sm:inline">{t.price}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
