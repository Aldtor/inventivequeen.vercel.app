import { ArrowRight, Sparkles, Crown, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/FadeIn";
import logo from "@/assets/logo.png";
import productBear from "@/assets/product-purple-bear-heart-keychain.png";
import productRoseBouquet from "@/assets/product-rose-bouquet-ribbon.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productPastelBouquet from "@/assets/product-bouquet-pastel.png";

const previewThumbs = [
  { name: "Plush Bear", img: productBear },
  { name: "Everlasting Rose", img: productRoseBouquet },
  { name: "Handmade Penguin", img: productPenguin },
  { name: "Pastel Bouquet", img: productPastelBouquet },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-fairytale-mesh py-16 md:py-24 lg:py-28 border-b border-border/40">
      {/* ── Ambient Orbs ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-primary/12 via-purple-300/15 to-amber-200/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-pink-300/8 rounded-full blur-[70px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-amber-200/10 rounded-full blur-[60px] pointer-events-none -z-10" />

      {/* ── Floating Decorative Elements ── */}
      <div className="absolute top-16 left-[6%] text-3xl select-none opacity-40 animate-float-gentle pointer-events-none hidden sm:block">🧶</div>
      <div className="absolute top-28 right-[10%] text-2xl select-none opacity-35 pointer-events-none hidden sm:block animate-bounce-gentle">👑</div>
      <div className="absolute bottom-24 left-[4%] text-2xl select-none opacity-35 pointer-events-none hidden sm:block animate-float-gentle" style={{ animationDelay: "1s" }}>🌸</div>
      <div className="absolute bottom-16 right-[6%] text-2xl select-none opacity-35 pointer-events-none hidden sm:block animate-float-gentle" style={{ animationDelay: "2s" }}>🧸</div>

      <div className="container max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* ── Left Column ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card shadow-luxury-sm text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-6">
                <Crown size={13} className="text-amber-500 animate-sparkle" />
                <span className="font-bold">ROYAL CROCHET ATELIER • HANDMADE MAGIC</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem] font-extrabold text-foreground tracking-tight leading-[1.1] text-balance">
                Custom crochet dolls,{" "}
                <span className="text-gradient-royal">plushies & flowers</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance">
                Hi, I'm the <strong className="text-foreground font-semibold">Inventive Queen</strong>! I create bespoke amigurumi dolls, cherished keepsakes, and forever-blooming floral bouquets. Send me any reference photo and I'll bring it to life in dreamy yarn.
              </p>
            </FadeIn>

            {/* Feature Pills */}
            <FadeIn delay={0.24}>
              <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {[
                  { emoji: "✨", text: "100% Handcrafted", color: "bg-purple-500/8 border-purple-500/15 text-purple-700" },
                  { emoji: "🎀", text: "Milk Cotton Yarn", color: "bg-pink-500/8 border-pink-500/15 text-pink-700" },
                  { emoji: "👑", text: "Royal Bespoke Care", color: "bg-amber-500/8 border-amber-500/15 text-amber-700" },
                  { emoji: "✈️", text: "Pan-India Shipping", color: "bg-emerald-500/8 border-emerald-500/15 text-emerald-700" },
                ].map((pill) => (
                  <span
                    key={pill.text}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-medium ${pill.color}`}
                  >
                    <span>{pill.emoji}</span> {pill.text}
                  </span>
                ))}
              </div>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.3}>
              <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#how-to-order"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full btn-gradient text-white font-body text-sm font-semibold shadow-royal-glow hover:shadow-luxury-lg active:scale-95 transition-all duration-300"
                >
                  <span>How to order</span>
                  <ArrowRight size={16} />
                </a>

                <a
                  href="#pricelist"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full glass-card hover:bg-white text-foreground font-body text-sm font-semibold shadow-luxury-sm hover:shadow-luxury active:scale-95 transition-all duration-300"
                >
                  <Palette size={15} className="text-primary" />
                  <span>See pricelist</span>
                </a>
              </div>
            </FadeIn>

            {/* Trust Metrics */}
            <FadeIn delay={0.36}>
              <div className="mt-9 pt-6 border-t border-border/40 flex items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 font-bold">★★★★★</span>
                  <span className="text-foreground font-semibold">4.9/5</span>
                  <span>(300+ Reviews)</span>
                </div>
                <div className="h-3.5 w-px bg-border" />
                <div>
                  <span className="text-foreground font-semibold">1,200+</span> Handcrafted Pieces
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column: Mascot Card ── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <FadeIn delay={0.2}>
              <div className="relative group max-w-sm w-full">
                {/* Floating status badge */}
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap px-4 py-1.5 rounded-full glass-card shadow-luxury flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-700 font-bold">Accepting Bespoke Commissions 🪄</span>
                </div>

                {/* Main Hero Card */}
                <div className="glass-card rounded-3xl p-7 shadow-luxury-lg text-center mt-2 relative overflow-hidden group hover:shadow-royal transition-shadow duration-500">
                  {/* Subtle gradient background inside card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-50/20 to-amber-50/20 pointer-events-none" />

                  <div className="relative">
                    <div className="relative mx-auto mt-3 w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-primary via-pink-400 to-amber-400 shadow-royal animate-glow-pulse">
                      <img
                        src={logo}
                        alt="Inventive Queen"
                        className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute -bottom-1 right-5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border-2 border-primary/20 flex items-center justify-center shadow-lg">
                        <span className="text-base select-none animate-bounce-gentle">👑</span>
                      </div>
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                      Inventive Queen
                    </h3>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-bold mt-1">
                      ROYAL CROCHET ATELIER
                    </p>
                    <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed px-2">
                      Every piece is crafted stitch by stitch with pure heart, heirloom milk cotton yarn, and royal precision.
                    </p>

                    <div className="mt-5 pt-4 border-t border-border/40">
                      <Link
                        to="/custom-orders"
                        className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl btn-gradient text-white text-xs font-bold shadow-md hover:shadow-luxury active:scale-95 transition-all"
                      >
                        <Sparkles size={14} className="text-amber-200" />
                        <span>Start Custom Commission ✨</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Mini preview gallery */}
                <div className="mt-4 grid grid-cols-4 gap-2.5">
                  {previewThumbs.map((t) => (
                    <div
                      key={t.name}
                      className="aspect-square rounded-2xl glass-card p-1.5 hover:shadow-luxury transition-all overflow-hidden flex items-center justify-center group/thumb cursor-pointer hover:scale-[1.03]"
                      title={t.name}
                    >
                      <img
                        src={t.img}
                        alt={t.name}
                        className="w-full h-full object-contain group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
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
