import { Sparkles, Heart, Flower2, Package } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const features = [
  {
    icon: Sparkles,
    iconBg: "bg-purple-100 text-purple-600",
    title: "100% Customized",
    desc: "Send reference photos of your favorite anime, game character, or loved one.",
  },
  {
    icon: Flower2,
    iconBg: "bg-pink-100 text-pink-600",
    title: "Everlasting Flowers",
    desc: "Crochet bouquets that keep their vibrant colors forever with zero maintenance.",
  },
  {
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-600",
    title: "Handmade in Atelier",
    desc: "Stitch by stitch crafted with love using quality plush & milk cotton yarn.",
  },
  {
    icon: Package,
    iconBg: "bg-indigo-100 text-indigo-600",
    title: "Nationwide Shipping",
    desc: "Packed securely with cozy aesthetic vibes and delivered safely across India.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs uppercase tracking-[0.22em] font-bold mb-4">
              <span>💜</span> Crafted with Love
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-purple-950 text-balance">
              Why order from Inventive Queen?
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm md:text-base text-purple-900/70 leading-relaxed font-normal">
              Every item is uniquely handcrafted to bring your ideas and favorite characters to life.
            </p>
          </FadeIn>
        </div>

        {/* ── 4 Feature Cards (CyDoes Craft Screenshot 4) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={0.1 + i * 0.08}>
                <div className="h-full bg-white rounded-[2rem] p-6 sm:p-7 border-2 border-purple-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${f.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-purple-950 group-hover:text-purple-700 transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-purple-900/70 leading-relaxed flex-1 font-normal">
                    {f.desc}
                  </p>
                  <div className="mt-6 pt-4 border-t border-purple-100/80 flex items-center gap-1.5 text-xs font-bold text-purple-600">
                    <span>🪄</span>
                    <span>Handmade magic</span>
                  </div>
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
