import { useState } from "react";
import { ChevronDown, Crown, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimatePresence, motion } from "framer-motion";

const terms = [
  {
    title: "Order Processing & Turnaround Time",
    content: "Every crochet creation is handmade to order. Standard crafting takes 3–5 business days depending on complexity and commission volume. For urgent birthdays or anniversary deadlines, please notify us during order placement for priority atelier processing.",
  },
  {
    title: "Transparent Pricing & Payment",
    content: "All listed rates are baseline prices and cover materials, crafting time, and complimentary royal packaging. We accept UPI, Net Banking, credit/debit cards, and secure checkout via Razorpay SSL protection.",
  },
  {
    title: "Customization & Mockup Approval",
    content: "We celebrate bespoke creativity! Send us reference photos, custom outfit colors, or personalized hairstyles. We will confirm color details with you before crafting begins. As each piece is individually hand-stitched, tiny artistic nuances make each creation one-of-a-kind.",
  },
  {
    title: "Pan-India Shipping & Packaging",
    content: "We deliver across all pincodes in India via express insured couriers. Every package is enclosed in aesthetic gift wrapping with satin ribbons, wax-sealed royal note, and heavy protective bubble wrap to ensure safe arrival.",
  },
  {
    title: "Care & Preservation Guide",
    content: "Crafted with premium milk cotton and velvet yarns. For care, gently spot clean with mild soap and a damp cloth. Never machine wash, wring, or tumble dry. Keep bouquets out of harsh direct midday sunlight to maintain rich yarn pigmentation for decades.",
  },
  {
    title: "Returns & Damaged In Transit Policy",
    content: "Due to the custom and personalized nature of commissioned crochet art, orders cannot be returned once crafted. If your parcel incurs any transit damage, reach out to us with an unboxing video/photo within 48 hours for an immediate complimentary remake or resolution.",
  },
];

const TermsSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="terms" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-4xl relative z-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Policies & Atelier Care</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Terms & Ordering Policies
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Everything you need to know about processing timelines, gift packaging, shipping, and yarn care.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="space-y-3.5">
            {terms.map((term, i) => (
              <div
                key={term.title}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === i
                    ? "bg-white border-purple-400 shadow-luxury"
                    : "bg-white/80 border-purple-100 hover:border-purple-300 shadow-sm"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <h3 className={`font-display text-base sm:text-lg font-bold transition-colors ${openIndex === i ? "text-purple-700" : "text-purple-950"}`}>
                    {term.title}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-purple-600 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 sm:px-6 pb-6 text-sm text-purple-900/80 leading-relaxed font-normal">
                        {term.content}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TermsSection;
