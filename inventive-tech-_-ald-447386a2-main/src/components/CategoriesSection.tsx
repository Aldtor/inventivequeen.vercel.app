import { ArrowRight, Sparkles, Heart, Flower2, Gift, Palette, Crown, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

import catForeverFlowers from "@/assets/cat-forever-flowers.jpg";
import catKeepsakeDolls from "@/assets/cat-keepsake-dolls.jpg";
import productBunny from "@/assets/product-bunny-heart-keychain.png";
import peacockBookmarkReal from "@/assets/product-peacock-bookmark-real.png";

const categories = [
  {
    title: "Forever Flower Bouquets",
    desc: "Exquisite everlasting bouquets, single romantic stems, and lush mixed florals wrapped in satin and craft paper.",
    image: catForeverFlowers,
    slug: "bouquet",
    targetId: "catalogue",
    badge: "Forever Keepsake 💐",
    price: "From ₹449",
  },
  {
    title: "Crochet Dolls & Plushies",
    desc: "Mini chibi dolls, classic heirloom bears, seated plushies, and anime figures tailored to your reference.",
    image: catKeepsakeDolls,
    slug: "doll",
    targetId: "catalogue",
    badge: "Most Popular ⭐️",
    price: "From ₹499",
  },
  {
    title: "Mascots & Pocket Charms",
    desc: "Adorable animal key fobs, sweet cows, bunnies, and cute bag accessories fitted with gold-plated lobster clasps.",
    image: productBunny,
    slug: "keychain",
    targetId: "catalogue",
    badge: "Pocket Keepsakes 🎀",
    price: "From ₹199",
  },
  {
    title: "Heirloom Bookmarks",
    desc: "Delicate peacock feathers and floral page markers hand-stitched with fine mercerized cotton for book lovers.",
    image: peacockBookmarkReal,
    slug: "bookmark",
    targetId: "catalogue",
    badge: "Artisan Gift 🔖",
    price: "From ₹249",
  },
];

const values = [
  {
    icon: Palette,
    iconBg: "bg-purple-100 text-purple-700",
    title: "100% Customized For You",
    desc: "Send your favourite characters, wedding attire, or reference photos and watch them come to life.",
  },
  {
    icon: Flower2,
    iconBg: "bg-pink-100 text-pink-700",
    title: "Everlasting Floral Art",
    desc: "Keepsake blooms that never wither or fade — a timeless memory that lasts forever.",
  },
  {
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-700",
    title: "Royal Artisan Touch",
    desc: "Crafted stitch by stitch with gentle hands using ultra-soft hypoallergenic milk cotton yarn.",
  },
  {
    icon: Gift,
    iconBg: "bg-amber-100 text-amber-700",
    title: "Heirloom Gift Presentation",
    desc: "Wrapped with royal satin ribbon, scented sachet, and personalized wax-sealed royal note.",
  },
];

const CategoriesSection = () => {
  return (
    <section id="categories" className="py-20 md:py-28 relative overflow-hidden">
      {/* Soft Ambient Mesh Background */}
      <div className="absolute inset-0 bg-fairytale-mesh opacity-50 pointer-events-none -z-10" />

      <div className="container max-w-7xl relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Royal Collections</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              What We Craft in Yarn
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Explore our core atelier collections. Every piece is handcrafted upon order with full customization of colors, expressions, and sizes.
            </p>
          </FadeIn>
        </div>

        {/* ── 4 Category Cards ── */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <StaggerItem key={c.title}>
              <div className="h-full glass-card-luxury rounded-[2.25rem] overflow-hidden border border-purple-200/80 hover:border-purple-400 shadow-luxury-sm hover:shadow-luxury-lg hover:-translate-y-2 transition-all duration-400 flex flex-col group">
                {/* Image Container */}
                <div className="aspect-[4/3] overflow-hidden relative bg-purple-50">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge */}
                  <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-purple-950 text-xs font-bold shadow-md border border-purple-100">
                    {c.badge}
                  </span>

                  {/* Price Tag */}
                  <span className="absolute bottom-4 right-4 px-3.5 py-1 rounded-full bg-purple-900/90 backdrop-blur-md text-amber-200 text-xs font-black shadow-md border border-purple-700">
                    {c.price}
                  </span>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-purple-950 group-hover:text-purple-700 transition-colors duration-200">
                      {c.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-purple-900/75 leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-purple-100 flex items-center justify-between">
                    <Link
                      to={`/category/${c.slug}`}
                      className="text-xs font-bold text-purple-900 hover:text-purple-600 transition-colors inline-flex items-center gap-1.5 group/btn"
                    >
                      <span>Explore Designs</span>
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      to="/custom-orders"
                      className="px-3.5 py-1.5 rounded-full bg-purple-100/90 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-all"
                    >
                      Customize ✨
                    </Link>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default CategoriesSection;
