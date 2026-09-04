import { Sparkles, ArrowRight, CheckCircle2, MessageCircle, Palette, Package, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const steps = [
  {
    number: "01",
    icon: "🎨",
    title: "Choose Style & Format",
    desc: "Pick your base item: Mini Chibi Doll, Heirloom Amigurumi, Forever Floral Bouquet, or Pocket Mascot Charm.",
    badge: "Step 1: Design Base",
    accent: "from-purple-600 to-indigo-600",
  },
  {
    number: "02",
    icon: "📸",
    title: "Share Photos & Vision",
    desc: "Have a favorite anime, game character, or wedding photo? Share reference images and custom color preferences.",
    badge: "Step 2: Personalize",
    accent: "from-pink-500 to-purple-600",
  },
  {
    number: "03",
    icon: "🪄",
    title: "Royal Crafting & Delivery",
    desc: "Stitch by stitch, your creation is brought to life in 3–5 days, packaged with royal wax seal and shipped safely across India.",
    badge: "Step 3: Heirloom Unboxing",
    accent: "from-amber-500 to-pink-500",
  },
];

const HowToOrderSection = () => {
  return (
    <section id="how-to-order" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Simple 3-Step Journey</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              How To Commission Your Piece
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Bringing your imagination into yarn is an effortless, deeply personal and heartwarming experience.
            </p>
          </FadeIn>
        </div>

        {/* 3 Step Cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <StaggerItem key={s.title}>
              <div className="h-full glass-card-luxury rounded-[2.25rem] p-8 border border-purple-200/80 hover:border-purple-400 shadow-luxury-sm hover:shadow-luxury hover:-translate-y-2 transition-all duration-400 flex flex-col justify-between group relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.accent} text-white font-black text-base flex items-center justify-center shadow-md`}>
                      {s.number}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      {s.badge}
                    </span>
                  </div>

                  <div className="text-3xl mb-4 select-none">{s.icon}</div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm text-purple-900/75 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-purple-100 flex items-center gap-2 text-xs font-bold text-purple-900">
                  <CheckCircle2 size={15} className="text-emerald-500" />
                  <span>Personal Consultation & Preview Included</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Bottom CTA Banner */}
        <FadeIn delay={0.3}>
          <div className="mt-16 p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white shadow-luxury-lg flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-amber-300" />
                <span>Bespoke Commission Atelier</span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black">
                Ready to bring your dream piece to life?
              </h3>
              <p className="text-purple-200 text-sm sm:text-base mt-2 max-w-xl font-normal leading-relaxed">
                Connect directly with our atelier. Share your vision and receive a quick confirmation and preview.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3">
              <Link
                to="/custom-orders"
                className="px-8 py-4 rounded-full btn-royal-gold text-sm font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Commission Custom Order</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowToOrderSection;
