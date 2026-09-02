import { Star, ShieldCheck, Heart, Sparkles, Truck } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const testimonials = [
  {
    handle: "@ananya_r",
    location: "Mumbai",
    text: "“The custom amigurumi doll turned out EXACTLY like my reference photo! Super high quality and details, my friend was in tears!”",
    rating: 5,
    tag: "Verified Order",
  },
  {
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "“The bouquet arrived perfectly wrapped with lovely ribbons. My mom loved that the flowers will stay beautiful forever!”",
    rating: 5,
    tag: "Verified Order",
  },
  {
    handle: "@riya_s",
    location: "Delhi",
    text: "“Super accommodating artist and clean stitches. The purple bear is so soft and well made. Will definitely order again for giftings!”",
    rating: 5,
    tag: "Verified Order",
  },
];

const trustBadges = [
  { icon: Heart, label: "500+ Happy Gifts" },
  { icon: ShieldCheck, label: "Quality Promise" },
  { icon: Sparkles, label: "100% Handmade" },
  { icon: Truck, label: "Carefully Packed" },
];

const SocialProof = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs uppercase tracking-[0.22em] font-bold mb-4">
              <span>💬</span> Customer Love
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-purple-950 text-balance">
              Loved by Handmade Lovers
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-sm md:text-base text-purple-900/70 leading-relaxed font-normal">
              Real reviews from customers who've gifted (and kept) our bespoke crochet creations.
            </p>
          </FadeIn>
        </div>

        {/* ── Trust Badges ── */}
        <FadeIn delay={0.2}>
          <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-full bg-white/90 border border-purple-150 px-4 py-2 shadow-sm">
                <Icon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-950">{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ── 3 Review Cards (CyDoes Craft Screenshot 5 style) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <FadeIn key={t.handle} delay={0.1 + idx * 0.08}>
              <div className="h-full bg-white rounded-[2rem] p-7 sm:p-8 border-2 border-purple-100/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                {/* 5 Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Italic quote */}
                <p className="text-sm text-purple-950/85 italic leading-relaxed flex-1 font-normal">
                  {t.text}
                </p>

                {/* Bottom handle & verified badge */}
                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-900">{t.handle}</span>
                  <span className="text-purple-600/80 font-medium">{t.tag}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
