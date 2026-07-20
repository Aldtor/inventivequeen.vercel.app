import { useState, useCallback, useEffect } from "react";
import { Star, ShieldCheck, Heart, Sparkles, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    name: "Ananya R.",
    location: "Mumbai",
    initial: "A",
    text: "The crochet bouquet I ordered was absolutely stunning! My friend cried happy tears when she opened it. Worth every rupee.",
    rating: 5,
    product: "Mixed Rose Bouquet",
  },
  {
    name: "Kavya M.",
    location: "Bengaluru",
    initial: "K",
    text: "Such beautiful handmade work — the penguin keychain is even cuter in person. The stitching is so neat and the yarn feels lovely. Will absolutely order again!",
    rating: 5,
    product: "Pink Penguin Keychain",
  },
  {
    name: "Riya S.",
    location: "Delhi",
    initial: "R",
    text: "Ordered a custom tulip bouquet for my mom's birthday. She was so happy she put it on her bedside table. Truly a heartfelt gift.",
    rating: 5,
    product: "Custom Tulip Bouquet",
  },
];

const trustBadges = [
  { icon: Heart, label: "500+ Happy Gifts" },
  { icon: ShieldCheck, label: "Quality Promise" },
  { icon: Sparkles, label: "100% Handmade" },
  { icon: Truck, label: "Carefully Packed" },
];

const SocialProof = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-brand-blush/15">
      <div className="container">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
            Happy Customers
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-center text-foreground text-balance">
            Loved by Handmade Lovers
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-4 text-center text-muted-foreground max-w-lg mx-auto text-pretty leading-relaxed">
            Real reviews from customers who've gifted (and kept) our crochet creations.
          </p>
        </FadeIn>

        {/* Trust badges */}
        <FadeIn delay={0.2}>
          <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-luxury-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="font-body text-xs md:text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Carousel */}
        <FadeIn delay={0.25}>
          <div className="mt-12 md:mt-14 relative">
            {/* Navigation arrows — desktop */}
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-luxury items-center justify-center text-foreground/60 hover:text-foreground hover:shadow-luxury-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card shadow-luxury items-center justify-center text-foreground/60 hover:text-foreground hover:shadow-luxury-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>

            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-5">
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="flex-[0_0_100%] md:flex-[0_0_calc(33.333%-14px)] min-w-0"
                  >
                    <div className="h-full bg-card rounded-2xl p-6 md:p-7 shadow-luxury-sm flex flex-col">
                      {/* Quotation mark */}
                      <span className="font-display text-5xl text-primary/15 leading-none select-none mb-1">
                        &ldquo;
                      </span>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-primary/80">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </span>
                      </div>

                      <p className="font-body text-sm text-foreground/80 leading-relaxed text-pretty flex-1">
                        {t.text}
                      </p>

                      <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-blush flex items-center justify-center font-display text-base font-semibold text-primary">
                          {t.initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground leading-tight">
                            {t.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground leading-tight mt-0.5">
                            {t.location} · {t.product}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-6 md:hidden">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-primary/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default SocialProof;
