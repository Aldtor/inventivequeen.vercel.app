import { Link } from "react-router-dom";
import catBouquets from "@/assets/cat-bouquets.jpg";
import catPlush from "@/assets/cat-plush.jpg";
import catGifts from "@/assets/cat-gifts.jpg";
import catKeychains from "@/assets/product-panda.jpeg";
import { categories as catData } from "@/lib/products";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const imageBySlug: Record<string, string> = {
  bouquet: catBouquets,
  teddy: catPlush,
  keychain: catKeychains,
  bookmark: catGifts,
};

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 md:py-28 lg:py-32">
      <div className="container">
        <FadeIn>
          <p className="text-center text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
            Browse Collections
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="mt-3 font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-center text-foreground text-balance">
            Our Handmade Categories
          </h2>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-4 text-center text-muted-foreground max-w-lg mx-auto text-pretty leading-relaxed">
            Explore our handcrafted collections — each piece made with love and premium yarn.
          </p>
        </FadeIn>

        <StaggerChildren className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {catData.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                to={`/category/${cat.slug}`}
                className="group cursor-pointer block"
              >
                <div className="card-lift overflow-hidden rounded-2xl bg-card shadow-luxury-sm">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={imageBySlug[cat.slug]}
                      alt={cat.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
                  </div>
                  <div className="p-4 md:p-5 text-center">
                    <h3 className="font-display text-base md:text-lg font-semibold text-foreground">
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden md:block">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default CategoriesSection;
