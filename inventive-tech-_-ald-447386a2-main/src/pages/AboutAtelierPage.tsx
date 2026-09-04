import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Crown, Play, ShieldCheck, Heart, Flower2, Package, Check, ArrowRight, Droplets, Sun, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";

import logo from "@/assets/logo.png";
import pBouquet from "@/assets/p-bouquet.jpg";
import hero from "@/assets/hero.jpg";
import videoTeddy1 from "@/assets/video-teddy-1.mp4";
import videoTeddy2 from "@/assets/video-teddy-2.mp4";
import videoBookmark from "@/assets/video-bookmark.mp4";

const videoReels = [
  {
    src: videoTeddy1,
    title: "Velvet Teddy Crafting",
    subtitle: "Stitch by stitch — bringing a cuddle bear to life",
    tag: "Amigurumi Process",
  },
  {
    src: videoTeddy2,
    title: "Bespoke Doll Detail",
    subtitle: "Hand-sculpting expressions in pure milk cotton yarn",
    tag: "Character Sculpting",
  },
  {
    src: videoBookmark,
    title: "Peacock Lace Bookmark",
    subtitle: "Intricate lacework in jewel-toned artisan threads",
    tag: "Fine Lace Detail",
  },
];

const standards = [
  {
    icon: Sparkles,
    title: "100% Bespoke Customization",
    desc: "From anime characters and game mascots to couple portrait dolls, any reference photo can be hand-stitched into yarn with immaculate detail.",
  },
  {
    icon: Flower2,
    title: "Everlasting Floral Romance",
    desc: "Crochet flowers preserve special anniversaries and birthdays forever. Vibrant colors, zero wilting, and no water needed.",
  },
  {
    icon: Heart,
    title: "Handmade in Private Atelier",
    desc: "Every single stitch is crafted with royal devotion using premium milk cotton yarn that feels velvety soft to touch and hypoallergenic.",
  },
  {
    icon: Package,
    title: "Insured Nationwide Delivery",
    desc: "Packaged securely in aesthetic gift boxes complete with ribbons, wax seal, and handwritten cards. Shipped with love all across India.",
  },
];

const careInstructions = [
  {
    icon: Droplets,
    title: "Hand Wash Gently in Cold Water",
    desc: "Submerge in cool water with a drop of mild wool-friendly detergent. Press gently without wringing or scrubbing.",
  },
  {
    icon: Sun,
    title: "Dry Flat in Shade",
    desc: "Reshape your piece while damp and lay it flat on a dry towel away from direct harsh sunlight to preserve yarn luster.",
  },
  {
    icon: Wind,
    title: "Dusting Flower Bouquets",
    desc: "Use a cool setting on a hair dryer or a soft makeup brush to gently remove dust from crochet flower petals.",
  },
];

export default function AboutAtelierPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Editorial Hero */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Behind The Craft</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
            Every loop, stitched with <span className="italic text-gradient">intention</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
            Inventive Queen was born out of a love for slow, tactile artistry. In a world of fast mass-production,
            we weave heirloom keepsakes designed to be held, cherished, and passed down.
          </p>
        </section>

        {/* Video Reels Section */}
        <section className="mx-auto max-w-6xl px-6 mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-plum">
              Watch The Magic <span className="italic text-gradient">Unfold</span>
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
              Hover or tap on any video reel below to watch actual crafting loops recorded in our studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoReels.map((v) => (
              <div
                key={v.title}
                className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-purple-200/80 shadow-soft hover:shadow-lift transition-all duration-500"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-black/5">
                  <video
                    src={v.src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={(e) => {
                      const vid = e.target as HTMLVideoElement;
                      vid.pause();
                      vid.currentTime = 0;
                    }}
                    onClick={(e) => {
                      const vid = e.target as HTMLVideoElement;
                      if (vid.paused) vid.play();
                      else vid.pause();
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/85 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase font-bold text-plum shadow-sm">
                    {v.tag}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-lg">
                      <Play size={20} className="text-white ml-0.5" fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white text-lg font-bold font-display">{v.title}</h3>
                    <p className="text-purple-200 text-xs mt-1 leading-relaxed">{v.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The 3 Artisan Stages */}
        <section className="mx-auto max-w-6xl px-6 mt-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="tilt-scene">
              <div className="overflow-hidden rounded-[2.5rem] tilt-3d shadow-lift border border-purple-200/70 bg-white p-2">
                <img
                  src={pBouquet}
                  alt="Crochet lavender bouquet"
                  className="aspect-square w-full rounded-[2rem] object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The Process</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
                Three stages of <span className="italic text-gradient">royal devotion</span>
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  {
                    num: "01",
                    title: "Curating The Yarn",
                    desc: "We exclusively source Oeko-Tex certified cotton and premium milk cotton for supreme softness, vibrant colorfast hues, and zero static.",
                  },
                  {
                    num: "02",
                    title: "Tension & Micro-Stitching",
                    desc: "Every amigurumi and petal is worked with uniform, firm tension to ensure shapes retain their sculptured form over decades.",
                  },
                  {
                    num: "03",
                    title: "Heirloom Finishing & Wax-Seal Wrap",
                    desc: "Hand-stitched eyes, wired stems, silk ribbon bows, tissue wrap, and a personalized royal wax-sealed certificate of craft.",
                  },
                ].map((s) => (
                  <div key={s.num} className="flex gap-5 rounded-2xl glass-card p-5 border border-purple-200/70 bg-white/80 shadow-sm">
                    <span className="font-display text-2xl font-bold text-purple-600">{s.num}</span>
                    <div>
                      <h3 className="text-base font-semibold text-plum">{s.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4 Royal Standards */}
        <section className="mx-auto max-w-6xl px-6 mt-28 border-t border-purple-200/60 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Quality Guarantees</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
              Our Four <span className="italic text-gradient">Royal Standards</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-[2rem] glass-card p-7 border border-purple-200/80 bg-white/85 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-purple-100 text-purple-700 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-plum">{f.title}</h3>
                    <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-100 flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Artisan Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Care Guide */}
        <section className="mx-auto max-w-6xl px-6 mt-28 border-t border-purple-200/60 pt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Longevity & Love</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
              How To Care For <span className="italic text-gradient">Your Keepsake</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Simple steps to ensure your handmade crochet companion lasts for generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careInstructions.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-[2rem] glass-card p-8 border border-purple-200/80 bg-white/85 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-purple-100 text-purple-700 shadow-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-plum">{c.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="rounded-[2.5rem] glass-card p-10 sm:p-14 text-center border border-purple-200/80 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 shadow-soft">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-plum">
              Ready to find a piece made <span className="italic text-gradient">just for you?</span>
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/shop" className="rounded-full btn-royal px-8 py-3.5 text-xs uppercase tracking-wider font-semibold shadow-md">
                Browse The Collection
              </Link>
              <Link to="/custom-orders" className="rounded-full border border-purple-300 bg-white px-8 py-3.5 text-xs uppercase tracking-wider font-semibold text-plum hover:bg-purple-50">
                Custom Orders Studio
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/60 py-12 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-display text-plum font-semibold text-base">Inventive Queen</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-600 font-medium">Royal Crochet Atelier</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Inventive Queen — Crocheted with love & care</p>
        </div>
      </footer>
    </div>
  );
}
