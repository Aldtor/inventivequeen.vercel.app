import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimatePresence, motion } from "framer-motion";

const terms = [
  {
    title: "Order Processing Time",
    content: "All crochet creations are handmade to order. Standard processing time is 3–7 business days depending on complexity. Custom or bulk orders may take longer — we'll confirm timeline before starting.",
  },
  {
    title: "Pricing & Payment",
    content: "All prices listed are base prices and may vary based on customization, size upgrades, or additional details. Full payment is required before we begin crafting. We accept UPI, bank transfer, and Razorpay.",
  },
  {
    title: "Customization Policy",
    content: "We welcome custom requests! Send us reference photos, color preferences, and size requirements. A preview mockup will be shared for approval before crafting begins. Minor variations are natural in handmade work.",
  },
  {
    title: "Shipping & Delivery",
    content: "We ship Pan-India via trusted courier services. Shipping charges are calculated at checkout based on location. Every order is carefully bubble-wrapped and packed in aesthetic gift packaging.",
  },
  {
    title: "Returns & Refunds",
    content: "Due to the handmade and custom nature of our products, we do not accept returns or exchanges. If your item arrives damaged during shipping, please contact us within 48 hours with photos for resolution.",
  },
  {
    title: "Care Instructions",
    content: "Crochet items are made with high-quality milk cotton yarn. Spot clean gently with mild soap and cold water. Do not machine wash, wring, or tumble dry. Keep away from direct sunlight for color preservation.",
  },
];

const TermsSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="terms" className="py-20 md:py-28 bg-background relative">
      <div className="container max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>📜</span> Policies
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-balance">
              Terms & Conditions
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Please read through our policies before placing an order.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="space-y-3">
            {terms.map((term, i) => (
              <div
                key={term.title}
                className={`rounded-2xl border transition-all duration-300 ${
                  openIndex === i
                    ? "bg-card border-primary/20 shadow-luxury"
                    : "bg-card/60 border-border/50 shadow-luxury-sm hover:border-border/80"
                }`}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <h3 className={`font-display text-base font-bold transition-colors ${openIndex === i ? "text-primary" : "text-foreground"}`}>
                    {term.title}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-muted-foreground transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? "rotate-180 text-primary" : ""}`}
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
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
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
