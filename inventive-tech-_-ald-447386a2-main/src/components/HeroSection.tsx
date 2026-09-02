import { ArrowRight, Sparkles, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/FadeIn";
import logo from "@/assets/logo.png";
import productBear from "@/assets/product-purple-bear-heart-keychain.png";
import productRoseBouquet from "@/assets/product-rose-bouquet-ribbon.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productPastelBouquet from "@/assets/product-bouquet-pastel.png";

const previewThumbs = [
  { name: "Royal Purple Bear", img: productBear, tag: "Keychains" },
  { name: "Everlasting Rose Bouquet", img: productRoseBouquet, tag: "Bouquets" },
  { name: "Cute Mascot Dolls", img: productPenguin, tag: "Custom Dolls" },
  { name: "Pastel Keepsake Bouquet", img: productPastelBouquet, tag: "Flowers" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-purple-100/70">
      {/* ── Soft Ambient Glows ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-300/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-[380px] h-[380px] bg-purple-200/20 rounded-full blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[320px] h-[250px] bg-fuchsia-200/15 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* ── Floating Kawaii Craft Stickers (CyDoes Craft signature style) ── */}
      <div className="absolute top-12 left-[5%] text-2xl select-none opacity-45 animate-float-gentle pointer-events-none hidden sm:block">
        🧶
      </div>
      <div className="absolute top-24 right-[8%] text-2xl select-none opacity-50 pointer-events-none hidden sm:block animate-bounce-gentle">
        🌸
      </div>
      <div className="absolute top-1/2 left-[3%] text-2xl select-none opacity-40 pointer-events-none hidden sm:block animate-float-slow">
        🧸
      </div>
      <div className="absolute bottom-16 left-[7%] text-2xl select-none opacity-40 pointer-events-none hidden sm:block animate-bounce-gentle" style={{ animationDelay: "1.2s" }}>
        💜
      </div>
      <div className="absolute bottom-20 right-[5%] text-2xl select-none opacity-45 pointer-events-none hidden sm:block animate-float-gentle" style={{ animationDelay: "2s" }}>
        🎀
      </div>
      <div className="absolute top-36 right-[28%] text-xl select-none opacity-40 pointer-events-none hidden lg:block animate-sparkle">
        ✨
      </div>

      <div className="container max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ── Left Column: Intro & CTAs ── */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/90 border border-purple-200/80 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
                <span>🌸</span>
                <span>HANDMADE IN ATELIER • BESPOKE YARN MAGIC</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4rem] font-black text-purple-950 tracking-tight leading-[1.12] text-balance">
                Custom crochet dolls,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600">
                  plushies & flowers
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.18}>
              <p className="mt-5 text-base sm:text-lg text-purple-900/80 leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance font-normal">
                Hi, I'm the <strong className="text-purple-950 font-bold">Inventive Queen</strong>! I craft bespoke amigurumi dolls and crochet flowers that never wilt. Every piece is customizable — send me a reference and I'll bring it to life in yarn.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.26}>
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
                <a
                  href="#how-to-order"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all duration-300"
                >
                  <span>How to order</span>
                  <ArrowRight size={16} />
                </a>

                <a
                  href="#pricelist"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/90 hover:bg-white text-purple-800 border-2 border-purple-200/80 font-bold text-sm shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
                >
                  <Palette size={15} className="text-purple-600" />
                  <span>See pricelist</span>
                </a>
              </div>
            </FadeIn>

            {/* Handle & Subtext */}
            <FadeIn delay={0.32}>
              <div className="mt-6 text-xs text-purple-900/60 font-semibold tracking-wide flex items-center justify-center lg:justify-start gap-2">
                <span>@inventivequeen</span>
                <span>•</span>
                <span>Amigurumi · Bouquets · Keepsakes</span>
              </div>
            </FadeIn>
          </div>

          {/* ── Right Column: Mascot Frame & Speech Bubble (CyDoes Craft style) ── */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <FadeIn delay={0.15}>
              <div className="relative max-w-md w-full flex flex-col items-center">
                {/* ── Cute Speech Bubble Badge (CyDoes Craft signature) ── */}
                <div className="relative mb-3 self-end mr-4 sm:mr-8 z-20">
                  <div className="speech-bubble-tail px-4 py-2 rounded-2xl bg-white border-2 border-purple-200 shadow-md flex items-center gap-2 text-xs font-bold text-purple-950">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Custom Orders OPEN</span>
                    <span className="text-sm">🔍</span>
                  </div>
                  <p className="text-[10px] text-purple-600 font-bold mt-1 text-right flex items-center justify-end gap-1 pr-1">
                    Accepting new custom orders! ✨
                  </p>
                </div>

                {/* ── Main Mascot Squircle Card with Thick White Border ── */}
                <div className="w-full bg-white rounded-[2.5rem] p-3 sm:p-4 shadow-xl border-4 border-white ring-2 ring-purple-200/70 overflow-hidden relative group">
                  <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-gradient-to-br from-purple-100/70 via-purple-50 to-pink-50/50 flex items-center justify-center">
                    <img
                      src={logo}
                      alt="Inventive Queen Mascot"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700"
                    />

                    {/* Subtle cute crown badge */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-purple-200/80 shadow-md flex items-center justify-center">
                      <span className="text-sm select-none">👑</span>
                    </div>

                    {/* Bottom overlay pill */}
                    <div className="absolute bottom-3.5 left-1/2 transform -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-purple-200/60 shadow-sm text-[11px] font-bold text-purple-900">
                      💜 Royal Bespoke Atelier
                    </div>
                  </div>
                </div>

                {/* ── 4 Rounded Square Thumbnails Row ── */}
                <div className="mt-4 grid grid-cols-4 gap-2.5 w-full">
                  {previewThumbs.map((t) => (
                    <div
                      key={t.name}
                      className="aspect-square rounded-2xl bg-white p-1.5 border-2 border-purple-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex items-center justify-center group/thumb cursor-pointer hover:-translate-y-1"
                      title={`${t.name} (${t.tag})`}
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
