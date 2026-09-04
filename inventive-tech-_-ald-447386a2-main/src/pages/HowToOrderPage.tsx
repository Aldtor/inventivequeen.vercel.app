import { Link } from "react-router-dom";
import { Crown, Palette, MessageCircle, Clock, Package, CheckCircle2, ArrowRight, Wand2, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";

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
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Commissioning Guide</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
            How to commission your <span className="italic text-gradient">dream piece</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
            Bringing your imagination into yarn is an effortless, personal and heartwarming journey. Here is exactly how our atelier works with you.
          </p>
        </section>

        {/* 4 Steps Timeline */}
        <section className="mx-auto max-w-5xl px-6 mt-20">
          <div className="space-y-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[2.5rem] glass-card p-8 sm:p-10 border border-purple-200/80 bg-white/90 shadow-soft hover:shadow-lift transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {step.number}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none">{step.icon}</span>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-plum">{step.title}</h2>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-purple-700 font-bold mt-1">{step.subtitle}</p>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{step.desc}</p>

                    <div className="mt-5 pt-4 border-t border-purple-100 flex flex-wrap gap-4">
                      {step.details.map((d) => (
                        <span key={d} className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span>{d}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Inspiration Ideas */}
        <section className="mx-auto max-w-5xl px-6 mt-24">
          <div className="rounded-[2.5rem] glass-card p-8 sm:p-12 border border-purple-200/80 bg-white/80 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {promptIdeas.map((idea) => (
                <Link
                  key={idea}
                  to={`/custom-orders?prompt=${encodeURIComponent(idea)}`}
                  className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 text-xs font-semibold text-plum hover:bg-purple-100/70 transition-all flex items-center justify-between group"
                >
                  <span>"{idea}"</span>
                  <ArrowRight size={14} className="text-purple-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Action Launch Card */}
        <section className="mx-auto max-w-5xl px-6 mt-20">
          <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white p-10 sm:p-14 shadow-lift text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Ready to start your custom commission?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-purple-200 max-w-xl mx-auto leading-relaxed">
              Step inside our digital atelier, select your base piece, customize colors, or send your reference photos on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/custom-orders"
                className="rounded-full bg-white text-purple-950 hover:bg-purple-50 px-8 py-3.5 text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
              >
                <span>Launch Custom Orders Studio</span>
                <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I'd%20like%20to%20commission%20a%20custom%20crochet%20piece."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-purple-300 bg-purple-900/40 hover:bg-purple-900/70 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
