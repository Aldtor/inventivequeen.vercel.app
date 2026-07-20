import { Heart, Palette, Gem, Gift } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const reasons = [
  {
    icon: Heart,
    title: "Handmade with Care",
    desc: "Every piece is crocheted by hand, stitch by stitch — no two are ever exactly alike.",
    highlight: "100% handcrafted",
  },
  {
    icon: Palette,
    title: "Customizable Gifts",
    desc: "Pick your colours, flowers, and tiny details so your gift feels truly personal.",
    highlight: "Made to order",
  },
  {
    icon: Gem,
    title: "Premium Yarn Quality",
    desc: "We use soft, durable yarn so your keepsake stays beautiful for years to come.",
    highlight: "Lasts forever",
  },
  {
    icon: Gift,
    title: "Perfect for Gifting",
    desc: "Lovingly packed and ready to delight — birthdays, anniversaries, or just because.",
    highlight: "Gift-ready packaging",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="custom" className="py-20 md:py-28 lg:py-32">
      <div className="container">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
            Why Inventive Queen
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-center text-foreground text-balance">
            Crafted with Love, Made to Last
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-4 text-center text-muted-foreground max-w-lg mx-auto text-pretty leading-relaxed">
            What makes every Inventive Queen creation special — and worth gifting.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {reasons.map((r) => (
            <StaggerItem key={r.title}>
              <div className="group relative flex flex-col items-center text-center p-7 md:p-8 rounded-2xl bg-card shadow-luxury-sm border border-border/40 hover:border-primary/20 hover:shadow-luxury transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-blush/60 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
                  <r.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {r.title}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {r.desc}
                </p>
                <span className="mt-5 inline-block text-[10px] uppercase tracking-wider font-semibold text-primary/80 bg-brand-blush/40 rounded-full px-3 py-1">
                  {r.highlight}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default WhyChooseUs;
