import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Crown, Play, ShieldCheck, Heart, Flower2, Package, ArrowRight, Droplets, Sun, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

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
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Decorative Floating Orbs */}
        <div className="decorative-orb w-80 h-80 bg-purple-400/20 -top-24 -right-32" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-64 h-64 bg-pink-300/15 top-1/4 -left-24" style={{ animationDelay: "4s" }} />
        <div className="decorative-orb w-48 h-48 bg-amber-200/15 bottom-60 right-10" style={{ animationDelay: "8s" }} />

        {/* Floating Decorative Elements */}
        <div className="absolute top-56 right-10 text-3xl opacity-15 animate-float-gentle select-none pointer-events-none hidden lg:block" aria-hidden="true">🧶</div>
        <div className="absolute top-[600px] left-8 text-2xl opacity-12 animate-float-slow select-none pointer-events-none hidden lg:block" style={{ animationDelay: "3s" }} aria-hidden="true">✨</div>

        {/* Editorial Hero */}
        <section className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Behind The Craft</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
              Every loop, stitched with <span className="italic text-gradient">intention</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              Inventive Queen was born out of a love for slow, tactile artistry. In a world of fast mass-production,
              we weave heirloom keepsakes designed to be held, cherished, and passed down.
            </p>
          </FadeIn>
        </section>

        {/* Video Reels Section */}
        <section className="mx-auto max-w-6xl px-6 mt-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-plum">
                Watch The Magic <span className="italic text-gradient">Unfold</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
                Hover or tap on any video reel below to watch actual crafting loops recorded in our studio.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {videoReels.map((v) => (
              <StaggerItem key={v.title}>
                <div
                  className="group relative rounded-[2.5rem] overflow-hidden bg-white border border-purple-200/80 shadow-sm card-hover-glow gradient-border-animated transition-all duration-500"
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

                    <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase font-bold text-plum shadow-sm backdrop-blur-sm">
                      {v.tag}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
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
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        {/* The 3 Artisan Stages */}
        <section className="mx-auto max-w-6xl px-6 mt-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <FadeIn direction="left">
              <div className="tilt-scene">
                <div className="overflow-hidden rounded-[2.5rem] tilt-3d shadow-lift border border-purple-200/70 bg-white p-2">
                  <img
                    src={pBouquet}
                    alt="Crochet lavender bouquet"
                    className="aspect-square w-full rounded-[2rem] object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <div>
              <FadeIn direction="right">
                <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The Process</p>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
                  Three stages of <span className="italic text-gradient">royal devotion</span>
                </h2>
              </FadeIn>

              <div className="mt-8 space-y-4 relative">
                {/* Timeline Line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-400/40 to-purple-200/10 rounded-full hidden sm:block" />

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
                ].map((s, i) => (
                  <FadeIn key={s.num} delay={0.1 * (i + 1)} direction="right">
                    <div className="flex gap-5 rounded-2xl glass-card p-5 border border-purple-200/70 bg-white/80 shadow-sm card-hover-glow relative">
                      <span className="font-display text-2xl font-bold text-purple-600 shrink-0 relative z-10">{s.num}</span>
                      <div>
                        <h3 className="text-base font-semibold text-plum">{s.title}</h3>
                        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4 Royal Standards */}
        <section className="mx-auto max-w-6xl px-6 mt-28 border-t border-purple-200/60 pt-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Quality Guarantees</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
                Our Four <span className="italic text-gradient">Royal Standards</span>
              </h2>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {standards.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={f.title}>
                  <div className="rounded-[2rem] glass-card p-7 border border-purple-200/80 bg-white/85 shadow-sm flex flex-col justify-between card-hover-glow hover-bounce-icon group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-purple-100 text-purple-700 shadow-sm group-hover:bg-purple-200/80 transition-colors">
                        <Icon size={22} className="bounce-target" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-plum">{f.title}</h3>
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-purple-100 flex items-center gap-1.5 text-xs font-semibold text-purple-700">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Artisan Verified</span>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        {/* Care Guide */}
        <section className="mx-auto max-w-6xl px-6 mt-28 border-t border-purple-200/60 pt-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">Longevity & Love</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium text-plum">
                How To Care For <span className="italic text-gradient">Your Keepsake</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Simple steps to ensure your handmade crochet companion lasts for generations.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.12}>
            {careInstructions.map((c) => {
              const Icon = c.icon;
              return (
                <StaggerItem key={c.title}>
                  <div className="rounded-[2rem] glass-card p-8 border border-purple-200/80 bg-white/85 shadow-sm card-hover-glow hover-bounce-icon group">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-purple-100 text-purple-700 shadow-sm group-hover:bg-purple-200/80 transition-colors">
                      <Icon size={22} className="bounce-target" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-plum">{c.title}</h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        </section>

        {/* CTA — Upgraded */}
        <FadeIn delay={0.1}>
          <section className="mx-auto max-w-6xl px-6 mt-24">
            <div className="rounded-[2.5rem] p-10 sm:p-14 text-center bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 shadow-lift relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 left-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

              {/* Sparkle particles */}
              <div className="sparkle-particle top-6 right-1/4" style={{ animationDelay: "0s" }} />
              <div className="sparkle-particle bottom-8 left-1/3" style={{ animationDelay: "1.5s" }} />

              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  Ready to find a piece made <span className="italic">just for you?</span>
                </h2>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link to="/shop" className="rounded-full bg-white text-purple-950 hover:bg-purple-50 px-8 py-3.5 text-xs uppercase tracking-wider font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-600" />
                    Browse The Collection
                  </Link>
                  <Link to="/custom-orders" className="rounded-full border border-purple-300 bg-purple-900/40 hover:bg-purple-900/70 px-8 py-3.5 text-xs uppercase tracking-wider font-bold text-white transition-all hover:-translate-y-0.5">
                    Custom Orders Studio
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
