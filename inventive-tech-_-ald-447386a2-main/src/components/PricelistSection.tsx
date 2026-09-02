import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Ruler } from "lucide-react";
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

type CategoryTab = "all" | "dolls" | "flowers" | "keychains";

interface PricelistItem {
  id: string;
  name: string;
  category: "dolls" | "flowers" | "keychains";
  badge?: string;
  size: string;
  price: string;
  notes: string;
  image: string;
  productId?: string;
}

const pricelistItems: PricelistItem[] = [
  { id: "mini-doll", name: "Mini Doll / Chibi Character", category: "dolls", badge: "⭐️ Bestseller", size: "3.5 – 4.5 inches (9 – 11 cm)", price: "Rs. 699", notes: "Perfect pocket companion or desk buddy. Fully customizable hair & outfits.", image: productWhiteBear, productId: "prod_021" },
  { id: "regular-doll", name: "Classic Amigurumi Doll", category: "dolls", badge: "👑 Royal Favorite", size: "8 – 10 inches (20 – 25 cm)", price: "Rs. 1,299", notes: "Detailed heirloom doll with customized clothing, accessories & floral touch.", image: productPenguin, productId: "prod_003" },
  { id: "chunky-teddy", name: "Chunky Velvet Bear", category: "dolls", badge: "Super Soft", size: "10 – 12 inches (25 – 30 cm)", price: "Rs. 1,499", notes: "Ultra-plush velvet/chenille yarn. Irresistibly huggable keepsake.", image: productBear, productId: "prod_002" },
  { id: "seated-doll", name: "Seated Figurine / Funko Style", category: "dolls", badge: "Custom Order", size: "5 inches (13 cm)", price: "Rs. 899", notes: "Stands or sits cleanly on bedside tables, car dash, or bookshelves.", image: productPanda, productId: "prod_004" },
  { id: "single-flower", name: "Single Everlasting Stem", category: "flowers", badge: "Sweet Gift", size: "10 – 12 inches stem length", price: "Rs. 199", notes: "Wrapped with craft paper & satin ribbon. Never withers, blooms forever.", image: productRoseBouquet, productId: "prod_005" },
  { id: "mixed-bouquet", name: "Signature Pastel Flower Bouquet", category: "flowers", badge: "⭐️ Bestseller", size: "Medium (5 – 7 blooms)", price: "Rs. 899", notes: "Harmony of crochet roses, lilies, and leafy eucalyptus in luxury wrap.", image: productPastelBouquet, productId: "prod_001" },
  { id: "grand-bouquet", name: "Grand Royal Keepsake Bouquet", category: "flowers", badge: "👑 Luxury", size: "Large (9 – 12 blooms)", price: "Rs. 1,599", notes: "The ultimate handcrafted anniversary or birthday statement bouquet.", image: productLilyBouquet, productId: "prod_006" },
  { id: "animal-keychain", name: "Handmade Amigurumi Bag Charm", category: "keychains", badge: "⭐️ Bestseller", size: "2.5 – 3.5 inches (6 – 9 cm)", price: "Rs. 249", notes: "Includes durable gold-plated lobster clasp & bell or mini heart charm.", image: productBunny, productId: "prod_008" },
  { id: "dino-keychain", name: "Mini Dino / Animal Mascot Charm", category: "keychains", badge: "Cute & Quirky", size: "3 inches (8 cm)", price: "Rs. 299", notes: "Fun vibrant yarn charm for backpacks, totes, and car key fobs.", image: productDino, productId: "prod_010" },
  { id: "peacock-bookmark", name: "Peacock Feather Keepsake Bookmark", category: "keychains", badge: "Artisan Favorite", size: "8 inches cord with tassel", price: "Rs. 199", notes: "Intricate lacework bookmark crocheted with vibrant jewel-tone threads.", image: productBookmark, productId: "prod_012" },
];

const filterTabs: { key: CategoryTab; label: string; emoji: string }[] = [
  { key: "all", label: "All Items", emoji: "✨" },
  { key: "dolls", label: "Dolls & Plush", emoji: "🧸" },
  { key: "flowers", label: "Flowers", emoji: "💐" },
  { key: "keychains", label: "Charms", emoji: "🔑" },
];

const getBadgeClass = (badge: string) => {
  if (badge.includes("Bestseller")) return "bg-amber-500 text-white";
  if (badge.includes("Royal") || badge.includes("Luxury")) return "bg-primary text-white";
  return "bg-foreground/75 text-white";
};

const PricelistSection = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const filteredItems = activeTab === "all" ? pricelistItems : pricelistItems.filter((i) => i.category === activeTab);

  return (
    <section id="pricelist" className="py-20 md:py-28 bg-background relative">
      <div className="absolute inset-0 bg-premium-mesh pointer-events-none opacity-50" />

      <div className="container max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
              <span>🏷️</span> Transparent Rates
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-foreground text-balance">
              Pricelist & Specs
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
              Every creation is customizable. Here are our standard designs, sizes, and base prices.
            </p>
          </FadeIn>

          {/* Filter Tabs */}
          <FadeIn delay={0.2}>
            <div className="mt-8 inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-card border border-border/50 shadow-luxury-sm">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-body font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? "btn-gradient text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Pricelist Grid */}
        <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <StaggerItem key={item.id}>
              <div className="h-full bg-card rounded-3xl p-5 border border-border/50 hover:border-primary/25 shadow-luxury-sm hover:shadow-luxury-lg transition-all duration-500 flex flex-col group">
                {/* Image */}
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-amber-50/20 mb-4 flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-500"
                  />
                  {item.badge && (
                    <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-sm ${getBadgeClass(item.badge)}`}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/6 text-xs text-primary font-medium">
                    <Ruler size={13} className="flex-shrink-0" />
                    <span>{item.size}</span>
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    {item.notes}
                  </p>
                </div>

                {/* Price + Action */}
                <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">
                      Starting At
                    </span>
                    <span className="font-display text-xl font-bold text-foreground">
                      {item.price}
                    </span>
                  </div>

                  {item.productId ? (
                    <Link
                      to={`/product/${item.productId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full btn-gradient text-white text-xs font-semibold shadow-sm hover:shadow-luxury active:scale-95 transition-all"
                    >
                      <span>Order</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  ) : (
                    <Link
                      to="/custom-orders"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/8 hover:bg-primary text-primary hover:text-white text-xs font-semibold transition-all active:scale-95"
                    >
                      <span>Custom</span>
                      <Sparkles size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
};

export default PricelistSection;
