import { ShieldCheck, Heart, Sparkles, Zap, Crown, Package } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const features = [
  {
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-600",
    title: "Handmade with Love",
    desc: "Every single stitch is crafted by hand with care, patience, and creative passion.",
  },
  {
    icon: ShieldCheck,
    iconBg: "bg-emerald-100 text-emerald-600",
    title: "Quality Promise",
    desc: "Premium milk cotton yarn and secure stitching that lasts for years to come.",
  },
  {
    icon: Sparkles,
    iconBg: "bg-amber-100 text-amber-600",
    title: "100% Customizable",
    desc: "Send any reference photo — anime, pet, loved one — and we'll bring it to life.",
  },
  {
    icon: Crown,
    iconBg: "bg-purple-100 text-purple-600",
    title: "Royal Packaging",
    desc: "Gift-ready packaging with ribbons, tissue, and handwritten notes on every order.",
  },
  {
    icon: Package,
    iconBg: "bg-blue-100 text-blue-600",
    title: "Safe Pan-India Shipping",
    desc: "Carefully bubble-wrapped and shipped securely to any pincode across India.",
  },
  {
    icon: Zap,
    iconBg: "bg-pink-100 text-pink-600",
    title: "Fast Turnaround",
    desc: "Most orders are handcrafted and shipped within 3–7 business days.",
  },
];

const stats = [
  { value: "1,200+", label: "Pieces Crafted" },
  { value: "300+", label: "Happy Customers" },
  { value: "4.9★", label: "Average Rating" },
  { value: "3–7", label: "Days Delivery" },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-secondary/20 border-t border-border/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-craft-dots opacity-[0.025] pointer-events-none" />

      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>👑</span> Why Inventive Queen
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground text-balance">
              Why Customers Choose Us
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Every piece leaving our atelier carries a promise of quality, care, and artisan craftsmanship.
            </p>
          </FadeIn>
        </div>

        {/* Stats Bar */}
        <FadeIn delay={0.2}>
          <div className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center py-6 px-4 rounded-2xl glass-card shadow-luxury-sm"
              >
                <p className="font-display text-2xl md:text-3xl font-bold text-gradient-royal">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={0.1 + i * 0.05}>
                <div className="h-full bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/20 shadow-luxury-sm hover:shadow-luxury transition-all duration-400 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon size={20} />
                  </div>
                  <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
