import { Sparkles, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const steps = [
  {
    number: "1",
    icon: "🎨",
    title: "Choose Base Style & Size",
    desc: "Browse our atelier collections. Select your favorite format — Mini Chibi, Classic Doll, Forever Floral Bouquet, or Pocket Charm.",
    badge: "Step 1: Style",
    accent: "from-purple-500 to-pink-500",
  },
  {
    number: "2",
    icon: "📸",
    title: "Share Your Vision or Photo",
    desc: "Got a photo, favorite character, or color aesthetic? Send reference pictures and personal details for your bespoke creation.",
    badge: "Step 2: Customize",
    accent: "from-pink-500 to-amber-500",
  },
  {
    number: "3",
    icon: "🪄",
    title: "Handcrafted & Delivered",
    desc: "We weave every single stitch with royal attention to detail and safely ship your keepsake in aesthetic gift packaging in 3–7 days.",
    badge: "Step 3: Royal Delivery",
    accent: "from-amber-500 to-purple-500",
  },
];

const HowToOrderSection = () => {
  return (
    <section id="how-to-order" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-5xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>📋</span> Simple Commission Journey
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground text-balance">
              How To Order Your Piece
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Bringing your imagination to life in yarn is easy, personalized, and fun.
            </p>
          </FadeIn>
        </div>

        {/* Steps */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, idx) => (
            <StaggerItem key={s.title}>
              <div className="h-full bg-card rounded-3xl p-7 border border-border/50 hover:border-primary/25 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500 flex flex-col group relative">
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${s.accent} text-white font-bold flex items-center justify-center shadow-md text-sm`}>
                    {s.number}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                    {s.badge}
                  </span>
                </div>

                <div className="text-3xl mb-3">{s.icon}</div>

                <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed flex-1">
                  {s.desc}
                </p>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-2 text-xs text-primary font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Stitch-by-stitch precision</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* CTA Banner */}
        <FadeIn delay={0.3}>
          <div className="mt-14 p-7 md:p-10 rounded-3xl bg-gradient-to-r from-purple-100/50 via-pink-50/50 to-amber-50/50 border border-border/40 shadow-luxury flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                <span>👑</span> Bespoke Atelier Service
              </div>
              <p className="font-display text-lg md:text-xl font-bold text-foreground">
                Ready to bring your custom dream piece to life?
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Send us your idea or reference photo and get a free mockup preview & quote within 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="#pricelist"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-card border border-border/60 text-foreground text-xs font-semibold hover:border-primary/30 hover:text-primary transition-all shadow-sm"
              >
                <span>View Pricelist</span>
                <ArrowUpRight size={14} />
              </a>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full btn-gradient text-white text-xs font-bold shadow-royal-glow hover:shadow-luxury-lg active:scale-95 transition-all"
              >
                <Sparkles size={14} className="text-amber-200" />
                <span>Custom Order ✨</span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HowToOrderSection;
