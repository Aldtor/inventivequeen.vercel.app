import { ArrowRight, Sparkles, Heart, Flower2, Gift, Palette } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

import catPlush from "@/assets/cat-plush.jpg";
import catBouquets from "@/assets/cat-bouquets.jpg";
import productBunny from "@/assets/product-bunny-heart-keychain.png";

const categories = [
  {
    title: "Crochet Dolls",
    desc: "Mini chibi, classic amigurumi, seated plushies, and custom anime dolls — all made-to-order.",
    image: catPlush,
    targetId: "pricelist",
    badge: "Most Popular",
    price: "From ₹699",
  },
  {
    title: "Characters & Plushies",
    desc: "Cute mascots, adorable animals, and non-human bespoke creatures crafted lovingly in yarn.",
    image: productBunny,
    targetId: "pricelist",
    badge: "Bespoke Requests",
    price: "From ₹299",
  },
  {
    title: "Crochet Flowers",
    desc: "Everlasting floral arrangements and romantic bouquets that preserve moments forever.",
    image: catBouquets,
    targetId: "pricelist",
    badge: "Forever Keepsake",
    price: "From ₹499",
  },
];

const values = [
  {
    icon: Palette,
    iconBg: "bg-purple-100 text-purple-600",
    title: "100% Customized",
    desc: "Send reference photos of your favorite anime, game character, or loved one.",
  },
  {
    icon: Flower2,
    iconBg: "bg-pink-100 text-pink-600",
    title: "Everlasting Blooms",
    desc: "Crochet bouquets that keep their vibrant colors forever — zero watering needed.",
  },
  {
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-600",
    title: "Royal Atelier Care",
    desc: "Stitch by stitch crafted with love using ultra-soft milk cotton yarn.",
  },
  {
    icon: Gift,
    iconBg: "bg-amber-100 text-amber-600",
    title: "Aesthetic Gifting",
    desc: "Packed with ribbons, wax seal notes, and delivered safely all over India.",
  },
];

const CategoriesSection = () => {
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="categories" className="py-20 md:py-28 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-premium-mesh pointer-events-none opacity-40" />

      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs uppercase tracking-[0.22em] font-bold mb-4">
              <span>🌸</span> Catalogue
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-purple-950 text-balance">
              What I make
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm md:text-base text-purple-900/70 leading-relaxed font-normal">
              Every category has its own pricelist page with sizes, prices and sample designs.
            </p>
          </FadeIn>
        </div>

        {/* ── 3 Category Cards ── */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c) => (
            <StaggerItem key={c.title}>
              <div className="h-full bg-card rounded-3xl overflow-hidden border border-border/60 hover:border-primary/30 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500 flex flex-col group">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  <span className="absolute top-3.5 left-3.5 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-primary/90 text-white shadow-sm backdrop-blur-sm">
                    {c.badge}
                  </span>

                  <span className="absolute bottom-3.5 right-3.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur-sm">
                    {c.price}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">
                    {c.desc}
                  </p>

                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                    <button
                      onClick={() => handleScrollTo(c.targetId)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-all group-hover:gap-2.5"
                    >
                      <span>Explore pricelist & gallery</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    <span className="text-sm select-none opacity-60">👑</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* ── 4 Value Cards ── */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <FadeIn key={v.title} delay={0.1}>
                <div className="h-full glass-card rounded-2xl p-5 hover:shadow-luxury transition-all duration-300 flex flex-col group">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${v.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon size={19} />
                  </div>
                  <h4 className="font-display text-base font-bold text-foreground">
                    {v.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed flex-1">
                    {v.desc}
                  </p>
                  <div className="mt-4 pt-2.5 border-t border-border/30 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>Atelier Guarantee</span>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
