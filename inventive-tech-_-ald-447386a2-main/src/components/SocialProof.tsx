import { Star, ShieldCheck, Heart, Sparkles, Truck, Crown } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";

const testimonials = [
  {
    handle: "@ananya_r",
    location: "Mumbai",
    text: "“The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was literally in tears!”",
    rating: 5,
    item: "Custom Chibi Doll",
    tag: "Verified Commission",
  },
  {
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "“The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.”",
    rating: 5,
    item: "Signature Pastel Bouquet",
    tag: "Verified Commission",
  },
  {
    handle: "@riya_s",
    location: "New Delhi",
    text: "“Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!”",
    rating: 5,
    item: "Velvet Cuddle Bear",
    tag: "Verified Commission",
  },
];

const trustBadges = [
  { icon: Heart, label: "500+ Bespoke Orders" },
  { icon: ShieldCheck, label: "Artisan Quality Promise" },
  { icon: Sparkles, label: "100% Milk Cotton Yarn" },
  { icon: Truck, label: "Aesthetic Gift Packaging" },
];

const SocialProof = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-7xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Customer Love & Reviews</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Cherished Across India
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Heartwarming stories and verified feedback from patrons who have gifted our handcrafted creations.
            </p>
          </FadeIn>
        </div>

        {/* Trust Badges */}
        <FadeIn delay={0.2}>
          <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 shadow-sm border border-purple-150 hover:border-purple-300 transition-colors"
              >
                <Icon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-950">{label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <FadeIn key={t.handle} delay={0.1 + idx * 0.08}>
              <div className="h-full glass-card-luxury rounded-[2.25rem] p-8 border border-purple-200/80 shadow-luxury-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-purple-950/85 italic leading-relaxed font-normal">
                    {t.text}
                  </p>
                </div>

                {/* Footer User Info */}
                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-purple-950">{t.handle}</p>
                    <p className="text-[11px] text-purple-800/60">{t.location}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100/60 px-2.5 py-1 rounded-full">
                    {t.item}
                  </span>
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
