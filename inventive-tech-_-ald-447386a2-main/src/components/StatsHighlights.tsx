import { Palette, Heart, Star, Package, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const stats = [
  {
    icon: Palette,
    iconColor: "text-purple-600 bg-purple-100",
    value: "500+",
    title: "BESPOKE COMMISSIONS",
    desc: "Handcrafted from client photos",
  },
  {
    icon: Heart,
    iconColor: "text-pink-600 bg-pink-100",
    value: "100%",
    title: "HAND-STITCHED MAGIC",
    desc: "Pure artisan milk cotton yarn",
  },
  {
    icon: Star,
    iconColor: "text-amber-600 bg-amber-100",
    value: "4.9/5",
    title: "ROYAL SATISFACTION",
    desc: "Loved by gift givers across India",
  },
  {
    icon: Package,
    iconColor: "text-indigo-600 bg-indigo-100",
    value: "Forever",
    title: "BLOOMS & KEEPSAKES",
    desc: "Never withers, preserved forever",
  },
];

const StatsHighlights = () => {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="container max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.title} delay={idx * 0.08}>
                <div className="glass-card-luxury rounded-3xl p-6 sm:p-7 border border-purple-200/80 hover:border-purple-400/80 shadow-luxury-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center group h-full">
                  <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300 ${s.iconColor}`}>
                    <Icon size={24} />
                  </div>

                  <p className="font-display text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight">
                    {s.value}
                  </p>

                  <h3 className="text-xs font-bold text-purple-900 tracking-wider uppercase mt-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-purple-800/70 font-medium mt-1">
                    {s.desc}
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

export default StatsHighlights;
