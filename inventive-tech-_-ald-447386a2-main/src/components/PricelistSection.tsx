import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Ruler, Crown, Clock, CheckCircle2 } from "lucide-react";
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
  { id: "mini-doll", name: "Mini Chibi Character Doll", category: "dolls", badge: "⭐️ Bestseller", size: "3.5 – 4.5 in (9 – 11 cm)", price: "Rs. 699", notes: "Compact desktop or pocket companion. Customized hairstyles, outfits & accessories.", image: productWhiteBear, productId: "prod_021" },
  { id: "regular-doll", name: "Classic Heirloom Amigurumi", category: "dolls", badge: "👑 Royal Choice", size: "8 – 10 in (20 – 25 cm)", price: "Rs. 1,299", notes: "Detailed character doll with removable wardrobe, shoes, and hand-embroidered facial charm.", image: productPenguin, productId: "prod_003" },
  { id: "chunky-teddy", name: "Chunky Velvet Cuddle Bear", category: "dolls", badge: "Super Soft", size: "10 – 12 in (25 – 30 cm)", price: "Rs. 1,499", notes: "Crocheted from luxury chenille velvet yarn. Incredibly soft, huggable and snuggly.", image: productBear, productId: "prod_002" },
  { id: "seated-doll", name: "Seated Figurine / Mascot Doll", category: "dolls", badge: "Custom Order", size: "5 in (13 cm)", price: "Rs. 899", notes: "Stands or sits steadily on study desks, car dashboards, or display shelves.", image: productPanda, productId: "prod_004" },
  { id: "single-flower", name: "Single Everlasting Rose Stem", category: "flowers", badge: "Sweet Gift", size: "10 – 12 in stem length", price: "Rs. 199", notes: "Hand-crocheted stem wrapped in craft paper & satin ribbon. Never wilts, blooms forever.", image: productRoseBouquet, productId: "prod_005" },
  { id: "mixed-bouquet", name: "Signature Pastel Flower Bouquet", category: "flowers", badge: "⭐️ Bestseller", size: "Medium (5 – 7 blooms)", price: "Rs. 899", notes: "Lush blend of pastel roses, lilies, lavender sprigs and eucalyptus with royal wrapping.", image: productPastelBouquet, productId: "prod_001" },
  { id: "grand-bouquet", name: "Grand Royal Keepsake Bouquet", category: "flowers", badge: "👑 Luxury", size: "Large (9 – 12 blooms)", price: "Rs. 1,599", notes: "The ultimate handcrafted anniversary or birthday statement bouquet with fairy lights.", image: productLilyBouquet, productId: "prod_006" },
  { id: "animal-keychain", name: "Amigurumi Bag Charm / Mascot", category: "keychains", badge: "⭐️ Bestseller", size: "2.5 – 3.5 in (6 – 9 cm)", price: "Rs. 249", notes: "Fitted with durable gold-plated lobster clasp, bell or miniature crocheted heart.", image: productBunny, productId: "prod_008" },
  { id: "dino-keychain", name: "Mini Dino / Animal Charm", category: "keychains", badge: "Cute & Quirky", size: "3 in (8 cm)", price: "Rs. 299", notes: "Vibrant and cheerful accessory for school backpacks, tote bags, and car fobs.", image: productDino, productId: "prod_010" },
  { id: "peacock-bookmark", name: "Peacock Feather Lace Bookmark", category: "keychains", badge: "Artisan Gem", size: "8 in cord + tassel", price: "Rs. 199", notes: "Intricate lacework bookmark in jewel-tone threads. An exquisite gift for readers.", image: productBookmark, productId: "prod_012" },
];

const filterTabs: { key: CategoryTab; label: string; emoji: string }[] = [
  { key: "all", label: "All Rates", emoji: "✨" },
  { key: "dolls", label: "Dolls & Plushies", emoji: "🧸" },
  { key: "flowers", label: "Floral Bouquets", emoji: "💐" },
  { key: "keychains", label: "Charms & Keepsakes", emoji: "🎀" },
];

const PricelistSection = () => {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const filteredItems = activeTab === "all" ? pricelistItems : pricelistItems.filter((i) => i.category === activeTab);

  return (
    <section id="pricelist" className="py-20 md:py-28 relative overflow-hidden">
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Crown size={13} className="text-amber-500" />
              <span>Transparent Atelier Rates</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Pricelist & Specifications
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Clear, transparent sizing and baseline pricing. Every creation can be further tailored with unique colorways, personal accessories, and custom name tags.
            </p>
          </FadeIn>

          {/* Filter Tabs */}
          <FadeIn delay={0.2}>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white border border-purple-200 shadow-sm">
              {filterTabs.map((tab) => (
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
                </button>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Pricing Cards Grid */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <StaggerItem key={item.id}>
              <div className="glass-card-luxury rounded-3xl p-6 border border-purple-200/80 hover:border-purple-400 shadow-luxury-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between h-full group">
                <div>
                  {/* Card Header: Thumb & Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-purple-50 p-2 border border-purple-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      {item.badge && (
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 mb-1">
                          {item.badge}
                        </span>
                      )}
                      <h3 className="font-display text-base font-bold text-purple-950 group-hover:text-purple-700 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-purple-900/70 font-semibold mt-1">
                        <Ruler size={13} className="text-purple-600" />
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <p className="mt-4 text-xs text-purple-900/75 leading-relaxed">
                    {item.notes}
                  </p>

                  <div className="mt-4 pt-3 border-t border-purple-100/70 space-y-1.5 text-[11px] text-purple-900/80">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      <span>100% Ultra-Soft Milk Cotton Yarn</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-purple-500" />
                      <span>Ready in 3–5 Business Days</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & CTA */}
                <div className="mt-6 pt-4 border-t border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-purple-600 block">Baseline Rate</span>
                    <span className="font-display text-xl font-black text-purple-950">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.productId && (
                      <Link
                        to={`/product/${item.productId}`}
                        className="px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-all"
                      >
                        View
                      </Link>
                    )}
                    <Link
                      to="/custom-orders"
                      className="px-4 py-2 rounded-full btn-gradient text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 flex items-center gap-1"
                    >
                      <Sparkles size={12} className="text-amber-200" />
                      <span>Order</span>
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

export default PricelistSection;
