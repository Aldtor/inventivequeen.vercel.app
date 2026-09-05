import { Link } from "react-router-dom";
import { Crown, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const steps = [
  {
    number: "01",
    icon: "🎨",
    title: "Choose Your Base Design",
    subtitle: "Select the format that fits your idea",
    desc: "Start by picking a foundation: an everlasting bouquet (roses, lilies, sunflowers), a keepsake doll or chibi amigurumi, a plush pocket charm, or a fine lace bookmark.",
    details: ["Over 25+ base formats available", "Single stems to grand bouquets", "Pocket to shelf sizes"],
  },
  {
    number: "02",
    icon: "📸",
    title: "Share Photos & Personalize",
    subtitle: "Colors, characters & embroidered names",
    desc: "Have a favourite anime character, video game mascot, wedding outfit, or colour theme? Upload or message us your reference photos. You can also specify embroidered names and custom ribbon colors.",
    details: ["Custom yarn palettes", "Embroidered letters/dates", "Reference photo matching"],
  },
  {
    number: "03",
    icon: "🪄",
    title: "Artisan Crafting in Atelier",
    subtitle: "Hand-stitched in 3 to 5 business days",
    desc: "Our artisan weaves your keepsake stitch by stitch using certified soft milk cotton yarn. We maintain uniform tension so sculptured shapes hold firmly for years.",
    details: ["Zero mass machines", "Photo preview before dispatch", "Hypoallergenic filling"],
  },
  {
    number: "04",
    icon: "🎁",
    title: "Wax-Sealed Gift Unboxing",
    subtitle: "Pan-India express courier delivery",
    desc: "Every order arrives gift-wrapped in signature tissue, tied with satin ribbon, scented subtly, and stamped with our royal wax seal. Ready to gift straight from the box.",
    details: ["Protective aesthetic gift box", "Tracking number via SMS/Email", "Insured courier shipping"],
  },
];

const promptIdeas = [
  "Lavender & cream roses with satin ribbon bow",
  "Chibi anime character with blue hair & cat ears",
  "Couple portrait dolls in traditional wedding attire",
  "Initials 'S & R' embroidered on baby booties",
  "Yellow sunflower bouquet with warm fairy lights",
  "Matching pastel dinosaur charms for best friends",
];

export default function HowToOrderPage() {
  return (
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Decorative Floating Orbs */}
        <div className="decorative-orb w-80 h-80 bg-purple-400/20 -top-16 -right-32" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-56 h-56 bg-pink-300/15 top-1/2 -left-20" style={{ animationDelay: "4s" }} />
        <div className="decorative-orb w-44 h-44 bg-amber-200/20 bottom-32 right-16" style={{ animationDelay: "8s" }} />

        {/* Floating Decorative Emojis */}
        <div className="absolute top-48 right-8 text-3xl opacity-20 animate-float-gentle select-none pointer-events-none hidden lg:block" aria-hidden="true">🧶</div>
        <div className="absolute top-96 left-6 text-2xl opacity-15 animate-float-slow select-none pointer-events-none hidden lg:block" style={{ animationDelay: "2s" }} aria-hidden="true">🪄</div>
        <div className="absolute bottom-80 right-20 text-2xl opacity-15 animate-float-gentle select-none pointer-events-none hidden lg:block" style={{ animationDelay: "4s" }} aria-hidden="true">🎁</div>

        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Commissioning Guide</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
              How to commission your <span className="italic text-gradient">dream piece</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
              Bringing your imagination into yarn is an effortless, personal and heartwarming journey. Here is exactly how our atelier works with you.
            </p>
          </FadeIn>
        </section>

        {/* 4 Steps — Connected Vertical Timeline */}
        <section className="mx-auto max-w-5xl px-6 mt-20 relative">
          {/* Timeline Vertical Line */}
          <div className="timeline-line hidden md:block" style={{ top: '40px', bottom: '40px', left: '67px' }} />

          <StaggerChildren className="space-y-6 relative z-10" staggerDelay={0.12}>
            {steps.map((step, i) => (
              <StaggerItem key={step.number}>
                <div
                  className="rounded-[2.5rem] glass-card p-8 sm:p-10 border border-purple-200/80 bg-white/90 shadow-sm card-hover-glow relative group"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Step Number with Pulse Dot */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-xl transition-shadow">
                        {step.number}
                      </div>
                      {/* Pulsing Indicator */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 pulse-dot hidden md:block" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl select-none group-hover:scale-110 transition-transform inline-block">{step.icon}</span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-plum">{step.title}</h2>
                      </div>
                      <p className="text-xs uppercase tracking-wider text-purple-700 font-bold mt-1.5">{step.subtitle}</p>
                      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>

                      <div className="mt-5 pt-4 border-t border-purple-100 flex flex-wrap gap-3">
                        {step.details.map((d) => (
                          <span key={d} className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-200/60 hover:bg-purple-100 transition-colors">
                            <CheckCircle2 size={13} className="text-emerald-500" />
                            <span>{d}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        {/* Popular Inspiration Ideas */}
        <FadeIn delay={0.1}>
          <section className="mx-auto max-w-5xl px-6 mt-24">
            <div className="rounded-[2.5rem] glass-card p-8 sm:p-12 border border-purple-200/80 bg-white/80 shadow-sm relative overflow-hidden">
              {/* Sparkle Decorations */}
              <div className="sparkle-particle top-8 right-16" style={{ animationDelay: "0s" }} />
              <div className="sparkle-particle top-14 right-32" style={{ animationDelay: "1s" }} />

              <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles size={12} className="text-purple-600" />
                  <span>Need Inspiration?</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-plum">
                  Popular Custom Ideas
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Click any of these ideas to open them directly in the Custom Orders Studio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                {promptIdeas.map((idea) => (
                  <Link
                    key={idea}
                    to={`/custom-orders?prompt=${encodeURIComponent(idea)}`}
                    className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 text-xs font-semibold text-plum hover:bg-purple-100/70 transition-all flex items-center justify-between group hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span>"{idea}"</span>
                    <ArrowRight size={14} className="text-purple-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Action Launch Card — Upgraded with Glow */}
        <FadeIn delay={0.1}>
          <section className="mx-auto max-w-5xl px-6 mt-20">
            <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white p-10 sm:p-14 shadow-lift text-center relative overflow-hidden">
              {/* Background glow spots */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

              {/* Sparkle particles */}
              <div className="sparkle-particle top-8 left-1/3" style={{ animationDelay: "0s" }} />
              <div className="sparkle-particle top-16 right-1/3" style={{ animationDelay: "1.2s" }} />
              <div className="sparkle-particle bottom-12 left-1/4" style={{ animationDelay: "2s" }} />

              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl font-bold">
                  Ready to start your custom commission?
                </h2>
                <p className="mt-3 text-sm sm:text-base text-purple-200 max-w-xl mx-auto leading-relaxed">
                  Step inside our digital atelier, select your base piece, customize colors, and securely place your royal order with live tracking.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link
                    to="/custom-orders"
                    className="rounded-full bg-white text-purple-950 hover:bg-purple-50 px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>Launch Custom Orders Studio</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    to="/shop"
                    className="rounded-full border border-purple-300 bg-purple-900/40 hover:bg-purple-900/70 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    <Sparkles size={14} className="text-amber-300" />
                    <span>Browse Ready Creations</span>
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
