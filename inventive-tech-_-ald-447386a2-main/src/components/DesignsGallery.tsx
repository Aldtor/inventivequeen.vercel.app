import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

import productBear from "@/assets/product-purple-bear-heart-keychain.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productRoseBouquet from "@/assets/product-rose-bouquet-ribbon.png";
import productLilyBouquet from "@/assets/product-bouquet-lily-2.png";
import productPastelBouquet from "@/assets/product-bouquet-pastel.png";
import productBunny from "@/assets/product-bunny-heart-keychain.png";
import productDino from "@/assets/product-green-dino-keychain.png";
import productBookmark from "@/assets/product-peacock-bookmark-real.png";
import productPanda from "@/assets/product-panda.jpeg";
import productWhiteBear from "@/assets/product-white-bear-pink-overalls.png";

type FilterTab = "all" | "dolls" | "bouquets" | "keychains";

interface DesignItem {
  id: string;
  name: string;
  category: "dolls" | "bouquets" | "keychains";
  categoryLabel: string;
  price: string;
  image: string;
  productId: string;
  badge?: string;
}

const designs: DesignItem[] = [
  { id: "d1", name: "Classic Amigurumi Teddy Bear", category: "dolls", categoryLabel: "Mini Dolls & Plush", price: "Rs. 799", image: productWhiteBear, productId: "prod_021", badge: "⭐️ Bestseller" },
  { id: "d2", name: "Handcrafted Penguin Explorer", category: "dolls", categoryLabel: "Mini Dolls & Plush", price: "Rs. 699", image: productPenguin, productId: "prod_003" },
  { id: "d3", name: "Royal Velvet Bear with Heart", category: "dolls", categoryLabel: "Mini Dolls & Plush", price: "Rs. 899", image: productBear, productId: "prod_002", badge: "👑 Royal Choice" },
  { id: "d4", name: "Cozy Panda Amigurumi", category: "dolls", categoryLabel: "Mini Dolls & Plush", price: "Rs. 749", image: productPanda, productId: "prod_004" },
  { id: "d5", name: "Everlasting Rose Bouquet in Ribbon", category: "bouquets", categoryLabel: "Bouquets & Flowers", price: "Rs. 699", image: productRoseBouquet, productId: "prod_005", badge: "Everlasting" },
  { id: "d6", name: "Signature Pastel Garden Bouquet", category: "bouquets", categoryLabel: "Bouquets & Flowers", price: "Rs. 899", image: productPastelBouquet, productId: "prod_001", badge: "⭐️ Bestseller" },
  { id: "d7", name: "Grand Lily & Blossom Arrangement", category: "bouquets", categoryLabel: "Bouquets & Flowers", price: "Rs. 1,499", image: productLilyBouquet, productId: "prod_006" },
  { id: "d8", name: "Pastel Bunny Heart Charm", category: "keychains", categoryLabel: "Keychains & Charms", price: "Rs. 249", image: productBunny, productId: "prod_008", badge: "Popular" },
  { id: "d9", name: "Mini Dinosaur Bag Charm", category: "keychains", categoryLabel: "Keychains & Charms", price: "Rs. 299", image: productDino, productId: "prod_010" },
  { id: "d10", name: "Peacock Lace Keepsake Bookmark", category: "keychains", categoryLabel: "Keychains & Charms", price: "Rs. 199", image: productBookmark, productId: "prod_012" },
];

const tabs: { key: FilterTab; label: string; emoji: string }[] = [
  { key: "all", label: "All Designs", emoji: "✨" },
  { key: "dolls", label: "Dolls & Plush", emoji: "🧸" },
  { key: "bouquets", label: "Bouquets", emoji: "💐" },
  { key: "keychains", label: "Charms", emoji: "🔑" },
];

const DesignsGallery = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredDesigns = activeTab === "all" ? designs : designs.filter((d) => d.category === activeTab);

  const getCount = (tab: FilterTab) => (tab === "all" ? designs.length : designs.filter((d) => d.category === tab).length);

  const getBadgeClass = (badge: string) => {
    if (badge.includes("Bestseller")) return "bg-amber-500 text-white";
    if (badge.includes("Royal")) return "bg-primary text-white";
    return "bg-foreground/80 text-white";
  };

  return (
    <section id="catalogue" className="py-20 md:py-28 bg-secondary/20 border-t border-border/30 relative">
      <div className="absolute inset-0 bg-craft-dots opacity-[0.03] pointer-events-none" />

      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>🎨</span> CATALOGUE
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance">
              Designs I've Made
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              A peek at past orders — all designs are customizable and can be tailored in your favorite colors.
            </p>
          </FadeIn>

          {/* Filter Tabs */}
          <FadeIn delay={0.2}>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-body font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? "btn-gradient text-white shadow-md shadow-primary/20"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {tab.emoji} {tab.label} ({getCount(tab.key)})
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Product Grid */}
        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredDesigns.map((item) => (
            <StaggerItem key={item.id}>
              <div className="h-full bg-card rounded-3xl p-3.5 border border-border/50 hover:border-primary/30 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-400 flex flex-col group">
                {/* Image */}
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-gradient-to-br from-purple-50/60 via-pink-50/30 to-amber-50/20 mb-3.5 flex items-center justify-center p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-500"
                  />
                  {item.badge && (
                    <span className={`absolute top-2.5 left-2.5 text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full shadow-sm ${getBadgeClass(item.badge)}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold block">
                    {item.categoryLabel}
                  </span>
                  <h3 className="font-display text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mt-0.5">
                    {item.name}
                  </h3>
                </div>

                {/* Price + CTA */}
                <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
                  <span className="font-display text-base font-bold text-foreground">
                    {item.price}
                  </span>
                  <Link
                    to={`/product/${item.productId}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-primary/8 group-hover:bg-primary text-primary group-hover:text-white text-xs font-semibold transition-all duration-200"
                  >
                    <span>Order</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Bottom Jump Pills */}
        <FadeIn delay={0.3}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Mini Dolls", to: "/category/dolls" },
              { label: "Crochet Bouquets", to: "/category/bouquets" },
              { label: "Keychains & Charms", to: "/category/keychains" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-5 py-2.5 rounded-full bg-card hover:bg-primary hover:text-white text-foreground text-xs font-semibold border border-border/60 hover:border-primary transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{link.label}</span>
                <ArrowRight size={13} />
              </Link>
            ))}
            <Link
              to="/custom-orders"
              className="px-6 py-2.5 rounded-full btn-gradient text-white text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-luxury active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>Request Custom Design</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default DesignsGallery;
