import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Crown } from "lucide-react";
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
  { key: "all", label: "All Creations", emoji: "✨" },
  { key: "dolls", label: "Dolls & Chibis", emoji: "🧸" },
  { key: "bouquets", label: "Forever Flowers", emoji: "💐" },
  { key: "keychains", label: "Charms & Keepsakes", emoji: "🎀" },
];

const DesignsGallery = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredDesigns = activeTab === "all" ? designs : designs.filter((d) => d.category === activeTab);
  const getCount = (tab: FilterTab) => (tab === "all" ? designs.length : designs.filter((d) => d.category === tab).length);

  return (
    <section id="catalogue" className="py-20 md:py-28 relative overflow-hidden bg-purple-50/50 border-y border-purple-200/60">
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Atelier Lookbook</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Designs We Have Created
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              A gallery of our past bespoke creations. Love a design? Commission one just like it or request your own colors!
            </p>
          </FadeIn>

          {/* Interactive Filter Pills */}
          <FadeIn delay={0.2}>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-purple-200 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    activeTab === tab.key
                      ? "bg-purple-700 text-white shadow-sm"
                      : "text-purple-900/75 hover:text-purple-950 hover:bg-purple-50"
                  }`}
                >
                  <span>{tab.emoji}</span>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.key ? "bg-white/20 text-white" : "bg-purple-100 text-purple-800"}`}>
                    {getCount(tab.key)}
                  </span>
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Gallery Grid */}
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {filteredDesigns.map((d) => (
            <StaggerItem key={d.id}>
              <div className="group h-full bg-white rounded-3xl p-3 border border-purple-100/90 hover:border-purple-300 shadow-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <Link to={`/product/${d.productId}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-purple-50/60">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {d.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 text-purple-950 text-[9px] font-bold shadow-xs border border-purple-100">
                      {d.badge}
                    </span>
                  )}
                </Link>

                <div className="mt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
                      {d.categoryLabel}
                    </span>
                    <Link to={`/product/${d.productId}`} className="block mt-0.5">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-purple-950 group-hover:text-purple-700 transition-colors line-clamp-1">
                        {d.name}
                      </h4>
                    </Link>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-purple-50 flex items-center justify-between">
                    <span className="font-display text-xs sm:text-sm font-black text-purple-950">
                      {d.price}
                    </span>
                    <Link
                      to={`/product/${d.productId}`}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-950 inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight size={11} />
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

export default DesignsGallery;
