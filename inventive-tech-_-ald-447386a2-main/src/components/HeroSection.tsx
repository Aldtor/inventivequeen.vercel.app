import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { FadeIn } from "@/components/motion/FadeIn";

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Subtle parallax on the background image
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-center">
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <img
          src={heroBanner}
          alt="Handmade crochet products arranged beautifully"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* Gradient overlay — ensures text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/10 md:to-transparent" />

      {/* Content */}
      <div className="relative container py-24 md:py-32 lg:py-40">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <FadeIn delay={0.1}>
            <p className="font-body text-xs md:text-sm uppercase tracking-[0.25em] text-primary font-semibold">
              Handcrafted with Love
            </p>
          </FadeIn>

          {/* Display heading */}
          <FadeIn delay={0.2}>
            <h1 className="mt-5 md:mt-6 font-display text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-foreground leading-[1.06] text-balance">
              Every stitch tells a story
              <br className="hidden md:block" />
              <span className="text-primary"> made just for you</span>
            </h1>
          </FadeIn>

          {/* Subheading */}
          <FadeIn delay={0.35}>
            <p className="mt-5 md:mt-6 text-base md:text-lg text-muted-foreground max-w-md leading-relaxed text-pretty">
              Unique crochet gifts crafted stitch by stitch — teddies,
              bouquets, keychains & more for your most cherished moments.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.5}>
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#categories"
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-105 active:scale-[0.97] transition-all duration-200"
              >
                Shop Collections
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
              <Link
                to="/custom-orders"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-foreground/15 text-foreground font-body font-semibold text-sm hover:border-primary/50 hover:text-primary hover:bg-primary/5 active:scale-[0.97] transition-all duration-200"
              >
                Custom Order
              </Link>
            </div>
          </FadeIn>

          {/* Craftsmanship note */}
          <FadeIn delay={0.65}>
            <p className="mt-8 text-xs text-muted-foreground font-body flex items-center gap-2">
              <span className="w-8 h-px bg-border" />
              Each piece takes 2–3 days of love to create
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
