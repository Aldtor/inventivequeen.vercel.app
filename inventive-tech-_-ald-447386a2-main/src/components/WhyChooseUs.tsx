import { Sparkles, Heart, Flower2, Package, Crown, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const features = [
  {
    icon: Sparkles,
    iconBg: "bg-purple-100 text-purple-700",
    title: "100% Bespoke Customization",
    desc: "From anime characters and video game mascots to couple portrait dolls, any reference photo can be hand-stitched into yarn.",
  },
  {
    icon: Flower2,
    iconBg: "bg-pink-100 text-pink-700",
    title: "Everlasting Floral Romance",
    desc: "Crochet flowers preserve special anniversaries and birthdays forever. Vibrant colors, zero wilting, and no water needed.",
  },
  {
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-700",
    title: "Handmade in Private Atelier",
    desc: "Every single stitch is crafted with royal devotion using premium milk cotton yarn that feels velvety soft to touch.",
  },
  {
    icon: Package,
    iconBg: "bg-indigo-100 text-indigo-700",
    title: "Insured Nationwide Delivery",
    desc: "Packaged securely in aesthetic gift boxes complete with ribbons and wax seal. Shipped with love all across India.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-20 md:py-28 relative overflow-hidden bg-purple-50/40">
      <div className="container max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Royal Standards</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Why Choose Inventive Queen?
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Unlike mass-manufactured toys, our creations are heirloom art pieces crafted with timeless dedication and heartfelt care.
            </p>
          </FadeIn>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.title} delay={0.1 + i * 0.08}>
                <div className="h-full bg-white rounded-[2rem] p-7 border border-purple-100/90 shadow-sm hover:shadow-luxury hover:-translate-y-2 transition-all duration-400 flex flex-col justify-between group">
                  <div>
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-6 ${f.iconBg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                      {f.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-purple-900/75 leading-relaxed font-normal">
                      {f.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-100 flex items-center gap-1.5 text-xs font-bold text-purple-700">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Royal Atelier Quality</span>
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
