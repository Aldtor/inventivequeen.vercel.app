import { Palette, Heart, Star, Package } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const stats = [
  {
    icon: Palette,
    iconColor: "text-purple-600 bg-purple-100/90",
    value: "500+",
    title: "CUSTOM CREATIONS",
    desc: "Made from reference photos",
  },
  {
    icon: Heart,
    iconColor: "text-pink-600 bg-pink-100/90",
    value: "100%",
    title: "HANDCRAFTED WITH LOVE",
    desc: "100% handmade in Atelier",
  },
  {
    icon: Star,
    iconColor: "text-amber-500 bg-amber-100/90",
    value: "5/5",
    title: "LOVE & RATING",
    desc: "5-star customer reviews",
  },
  {
    icon: Package,
    iconColor: "text-indigo-600 bg-indigo-100/90",
    value: "100%",
    title: "EVERLASTING GIFTS",
    desc: "Crochet flowers & dolls that last forever",
  },
];

const StatsHighlights = () => {
  return (
    <section className="py-12 sm:py-16 relative overflow-hidden">
      <div className="container max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <FadeIn key={s.title} delay={idx * 0.08}>
                <div className="bg-white rounded-[2rem] p-6 sm:p-7 border-2 border-purple-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center flex flex-col items-center group h-full">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3.5 shadow-sm group-hover:scale-110 transition-transform duration-300 ${s.iconColor}`}>
                    <Icon size={22} />
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
