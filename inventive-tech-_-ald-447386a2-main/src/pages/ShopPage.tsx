import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowDownUp, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { addCartItem, openCartDrawer } from "@/lib/cart";

import pBear from "@/assets/p-bear.jpg";
import pBouquet from "@/assets/p-bouquet.jpg";
import pBag from "@/assets/p-bag.jpg";
import pBlanket from "@/assets/p-blanket.jpg";
import pBooties from "@/assets/p-booties.jpg";
import pCharms from "@/assets/p-charms.jpg";
import pCushion from "@/assets/p-cushion.jpg";
import pHat from "@/assets/p-hat.jpg";

import bouquetRose from "@/assets/product-bouquet-rose.png";
import bouquetGrand from "@/assets/product-bouquet-grand.png";
import bouquetPastel from "@/assets/product-bouquet-pastel.png";
import pinkOwlKeychain from "@/assets/product-pink-owl-keychain.png";
import strawberryCowKeychain from "@/assets/product-strawberry-cow-keychain.png";
import peacockBookmarkReal from "@/assets/product-peacock-bookmark-real.png";

import { products as defaultProducts } from "@/lib/products";

export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  price: string;
  rawPrice: number;
  category: "all" | "bouquet" | "doll" | "keychain" | "wear" | "home" | "bookmark";
  categoryLabel: string;
  note: string;
  img: string;
  desc: string;
  story: string;
  details: string[];
  rating: number;
  reviews: number;
  bestseller?: boolean;
  madeToOrder?: boolean;
}

const realProductsFromStore: ShopItem[] = defaultProducts.map((p) => {
  let cat: any = p.type;
  let label = "Forever Flowers";
  if (p.type === "doll" || (p.type as any) === "teddy") {
    cat = "doll";
    label = "Keepsake Dolls";
  } else if (p.type === "keychain") {
    cat = "keychain";
    label = "Pocket Charms";
  } else if (p.type === "bookmark") {
    cat = "bookmark";
    label = "Bookmarks";
  }

  return {
    id: p.id,
    slug: p.id,
    name: p.name,
    price: p.price,
    rawPrice: parseInt(p.price.replace(/[^\d]/g, "")) || 499,
    category: cat,
    categoryLabel: label,
    note: p.tagline || "Handcrafted Atelier Keepsake",
    img: p.images[0] || bouquetGrand,
    desc: p.description,
    story: "Handcrafted stitch by stitch in our private atelier with soft milk cotton yarn.",
    details: p.flowers && p.flowers.length > 0
      ? [`Artisan flowers: ${p.flowers.join(", ")}`, "100% premium milk cotton yarn", "Gift-ready luxury packaging", "Everlasting bloom"]
      : ["100% soft milk cotton yarn", "Heirloom craftsmanship", "Gift wrapped with satin ribbon", "Hand wash cold"],
    rating: 4.9,
    reviews: 35 + (p.sortOrder || 1) * 8,
    bestseller: p.sortOrder === 1 || p.isNewArrival,
    madeToOrder: true,
  };
});

const baseRemixItems: ShopItem[] = [
  {
    id: "lavender-bear",
    slug: "lavender-bear",
    name: "Lavender Bear",
    price: "₹1,499",
    rawPrice: 1499,
    category: "doll",
    categoryLabel: "Keepsake Dolls",
    note: "Amigurumi · 22 cm",
    img: pBear,
    desc: "A cotton-soft companion with a hand-tied bow and embroidered smile.",
    story: "Worked in one continuous spiral so there are no seams to come loose, stuffed firmly enough to sit on a shelf and softly enough to sleep beside.",
    details: ["22 cm tall", "100% Oeko-Tex cotton yarn", "Safety-embroidered eyes", "Hand wash cold"],
    rating: 4.9,
    reviews: 128,
    bestseller: true,
  },
  {
    id: "everlasting-bouquet",
    slug: "everlasting-bouquet",
    name: "Everlasting Lavender Bouquet",
    price: "₹1,899",
    rawPrice: 1899,
    category: "bouquet",
    categoryLabel: "Forever Flowers",
    note: "Bouquet · 18 stems",
    img: pBouquet,
    desc: "Lavender stems that never wilt, wrapped in satin ribbon.",
    story: "Eighteen stems, each one individually wired so it holds its natural graceful curve, wrapped in layered tissue and satin ribbon.",
    details: ["18 hand-shaped stems", "Wired for custom posing", "Satin ribbon wrap", "Personalized gift note included"],
    rating: 5.0,
    reviews: 74,
    bestseller: true,
    madeToOrder: true,
  },
  {
    id: "lilac-stripe-tote",
    slug: "lilac-stripe-tote",
    name: "Lilac Stripe Tote",
    price: "₹2,199",
    rawPrice: 2199,
    category: "wear",
    categoryLabel: "Bags & Wear",
    note: "Bag · Cotton yarn",
    img: pBag,
    desc: "Dense stitch work, lined interior, made for everyday carry.",
    story: "A tight single-crochet body that keeps its shape under weight, lined in fine cotton so small items never slip through the stitches.",
    details: ["34 × 30 cm", "Soft cotton lining", "Reinforced handles", "Holds up to 5 kg"],
    rating: 4.8,
    reviews: 56,
  },
  {
    id: "granny-square-throw",
    slug: "granny-square-throw",
    name: "Granny Square Throw",
    price: "₹4,499",
    rawPrice: 4499,
    category: "home",
    categoryLabel: "Home Throws",
    note: "Blanket · 120 × 150 cm",
    img: pBlanket,
    desc: "Ninety-six squares, joined by hand over three weeks.",
    story: "Ninety-six squares crocheted individually, steam-blocked flat, then joined and bordered by hand with seamless scalloped edges.",
    details: ["120 × 150 cm", "96 hand-joined squares", "3-week artisan make time", "Machine-free craftsmanship"],
    rating: 5.0,
    reviews: 41,
    bestseller: true,
    madeToOrder: true,
  },
  {
    id: "baby-bootie-set",
    slug: "baby-bootie-set",
    name: "Baby Bootie Keepsake Set",
    price: "₹1,199",
    rawPrice: 1199,
    category: "doll",
    categoryLabel: "Keepsake Dolls",
    note: "Gifts · Booties + Bonnet",
    img: pBooties,
    desc: "Newborn keepsake booties in ultra-soft cream cotton with lilac trim.",
    story: "A gentle heirloom newborn set crafted with milk-cotton yarn that gets softer with every wash.",
    details: ["Newborn to 6 months", "Hypoallergenic yarn", "Matching bonnet included", "Gift boxed"],
    rating: 4.9,
    reviews: 32,
  },
  {
    id: "pocket-charms-set",
    slug: "pocket-charms-set",
    name: "Pastel Pocket Charms",
    price: "₹599",
    rawPrice: 599,
    category: "keychain",
    categoryLabel: "Pocket Charms",
    note: "Charm · Set of 2",
    img: pCharms,
    desc: "Hand-stitched pocket companions for tote bags, keys, or thoughtful gifts.",
    story: "Compact, joyful miniatures sculpted stitch-by-stitch to add warmth to your daily essentials.",
    details: ["Set of 2 charms", "Sturdy gold-tone keyrings", "Tightly knotted yarn", "Lightweight"],
    rating: 4.8,
    reviews: 64,
  },
  {
    id: "lilac-cushion",
    slug: "lilac-cushion",
    name: "Lilac Petal Cushion",
    price: "₹2,699",
    rawPrice: 2699,
    category: "home",
    categoryLabel: "Home Throws",
    note: "Home · 40 × 40 cm",
    img: pCushion,
    desc: "Sculptural crochet cushion cover with plush tactile petal motif.",
    story: "Textured floral motif creating a dimensional centerpiece for reading corners and sofas.",
    details: ["40 × 40 cm", "Concealed zipper closure", "Cushion insert included", "Dry flat"],
    rating: 4.7,
    reviews: 29,
  },
  {
    id: "sunflower-summer-hat",
    slug: "sunflower-summer-hat",
    name: "Vintage Crochet Sun Hat",
    price: "₹1,399",
    rawPrice: 1399,
    category: "wear",
    categoryLabel: "Bags & Wear",
    note: "Wear · Breathable Cotton",
    img: pHat,
    desc: "Breathable scalloped brim hat hand-crocheted for sunny strolls.",
    story: "Airy scalloped eyelets offer breathability and gentle sun shade with a romantic Parisian vintage aesthetic.",
    details: ["One size fits all", "Packable & shape-retaining", "100% natural cotton", "Hand wash cold"],
    rating: 4.9,
    reviews: 38,
  },
  {
    id: "mixed-rose-grand-bouquet",
    slug: "mixed-rose-grand-bouquet",
    name: "Mixed Rose Grand Atelier Bouquet",
    price: "₹799",
    rawPrice: 799,
    category: "bouquet",
    categoryLabel: "Forever Flowers",
    note: "Bouquet · Multi-Stem",
    img: bouquetGrand,
    desc: "Majestic forever roses in romantic shades of crimson, blush, and cream.",
    story: "Hand-sculpted petals wrapped in layered lilac tissue paper and finished with a shimmering silk ribbon.",
    details: ["Everlasting milk cotton blooms", "Layered tissue gift wrap", "Never wilts", "Dust with gentle cool blow dryer"],
    rating: 5.0,
    reviews: 95,
    bestseller: true,
  },
  {
    id: "pink-owl-keychain",
    slug: "pink-owl-keychain",
    name: "Sweet Blossom Pink Owl Charm",
    price: "₹249",
    rawPrice: 249,
    category: "keychain",
    categoryLabel: "Pocket Charms",
    note: "Charm · 7 cm",
    img: pinkOwlKeychain,
    desc: "Delicate pink owl charm with safety eyes and golden lobster clasp.",
    story: "Meticulously hand-crocheted miniature companion perfect for backpacks and keys.",
    details: ["7 cm height", "Anti-rust golden hardware", "Soft cotton stuffing", "Pocket-sized"],
    rating: 4.9,
    reviews: 81,
  },
  {
    id: "strawberry-cow-keychain",
    slug: "strawberry-cow-keychain",
    name: "Strawberry Milk Cow Charm",
    price: "₹299",
    rawPrice: 299,
    category: "keychain",
    categoryLabel: "Pocket Charms",
    note: "Charm · 8 cm",
    img: strawberryCowKeychain,
    desc: "Adorable pink-and-white strawberry cow plush charm with mini horns.",
    story: "A fan-favorite handmade cutie with stitched pink patches and sturdy clasp.",
    details: ["8 cm height", "Reinforced loop", "Soft velvet touch", "Collector's favorite"],
    rating: 5.0,
    reviews: 112,
    bestseller: true,
  },
  {
    id: "peacock-bookmark",
    slug: "peacock-bookmark",
    name: "Royal Peacock Crochet Bookmark",
    price: "₹249",
    rawPrice: 249,
    category: "bookmark",
    categoryLabel: "Bookmarks",
    note: "Bookmark · 25 cm",
    img: peacockBookmarkReal,
    desc: "Intricately crocheted peacock feather bookmark with dangling tail tassel.",
    story: "Designed for book lovers, flat enough to rest between pages without straining book spines.",
    details: ["25 cm total length", "Vibrant peacock teal & gold tones", "Silk tail tassel", "Steam-blocked flat"],
    rating: 4.9,
  },
];

// Combine all real inventory from store with signature atelier keepsakes
const combinedCatalogMap = new Map<string, ShopItem>();
[...realProductsFromStore, ...baseRemixItems].forEach((item) => {
  combinedCatalogMap.set(item.id, item);
});

export const allCatalogItems: ShopItem[] = Array.from(combinedCatalogMap.values());

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";


export default function ShopPage({ initialCategory = "All" }: { initialCategory?: string }) {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || initialCategory;
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    { id: "All", label: "All Pieces" },
    { id: "bouquet", label: "Forever Flowers" },
    { id: "doll", label: "Keepsake Dolls" },
    { id: "keychain", label: "Pocket Charms" },
    { id: "wear", label: "Bags & Wear" },
    { id: "home", label: "Home Throws" },
    { id: "bookmark", label: "Bookmarks" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allCatalogItems.filter((p) => {
      const matchCat =
        activeCategory === "All" ||
        p.category === activeCategory ||
        (activeCategory === "bouquet" && p.category === "bouquet") ||
        (activeCategory === "doll" && p.category === "doll");
      const matchQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.rawPrice - b.rawPrice);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.rawPrice - a.rawPrice);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));

    return list;
  }, [activeCategory, sort, query]);

  const handleAddToCart = (product: ShopItem) => {
    addCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
      type: "bouquet",
      tagline: product.desc,
      description: product.desc,
      images: [product.img],
      isActive: true,
    });

    setAddedItem(product.id);
    toast.success(`Added ${product.name} to basket!`, {
      description: `${product.price} · Handcrafted in our atelier`,
    });
    openCartDrawer();

    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Editorial Heading */}
        <section className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.42em] text-purple-700 font-bold">The collection</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl text-plum sm:text-5xl md:text-6xl font-medium">
            Pieces made to be <span className="italic text-gradient">held</span>
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted-foreground text-sm sm:text-base">
            Every piece is crocheted by hand in small batches with milk-cotton yarn. Filter, sort and find the
            keepsake that feels like yours.
          </p>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-20 z-30 mt-12 border-y border-purple-200/60 bg-[#FAF8F5]/85 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 hidden items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-purple-800/60 sm:flex font-semibold">
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "btn-royal shadow-sm"
                      : "border border-purple-200/80 bg-white/70 text-plum hover:border-purple-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1.5 text-xs text-plum shadow-sm">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces..."
                  className="bg-transparent outline-none placeholder:text-muted-foreground text-xs w-28 sm:w-36"
                />
              </label>

              <label className="flex items-center gap-1.5 rounded-full border border-purple-200/80 bg-white/70 px-3.5 py-1.5 text-xs text-plum shadow-sm">
                <ArrowDownUp className="h-3 w-3 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="bg-transparent text-xs outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-6xl px-6 mt-12">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-purple-200/70 bg-white/60 p-16 text-center backdrop-blur-md">
              <p className="text-base text-plum font-medium">No pieces found matching your filter.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setQuery("");
                }}
                className="mt-4 rounded-full btn-royal px-6 py-2 text-xs uppercase tracking-wider font-semibold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-8 tilt-scene sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl glass-card tilt-3d border border-purple-200/70 shadow-soft bg-white/80 hover:bg-white transition-all duration-500 flex flex-col"
                >
                  <Link to={`/product/${product.slug}`} className="relative overflow-hidden aspect-[4/3] w-full block">
                    <img
                      src={product.img}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.2em] font-medium text-plum backdrop-blur shadow-sm border border-white/60">
                      {product.note}
                    </span>
                    {product.bestseller && (
                      <span className="absolute right-4 top-4 rounded-full btn-royal px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold shadow-sm">
                        Bestseller
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-col flex-1 justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider text-purple-700 font-semibold">
                          {product.categoryLabel}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          ★ {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <Link to={`/product/${product.slug}`}>
                        <h3 className="font-display text-xl text-plum font-medium tracking-tight mt-1.5 group-hover:text-purple-700 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {product.desc}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-purple-100 pt-4">
                      <span className="font-display text-xl font-bold text-purple-950">
                        {product.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                          addedItem === product.id
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-purple-300/80 bg-purple-50/60 text-plum hover:btn-royal hover:border-transparent"
                        }`}
                        aria-label={`Add ${product.name} to basket`}
                      >
                        {addedItem === product.id ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3 w-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Custom Order CTA Ribbon */}
        <section className="mx-auto max-w-6xl px-6 mt-20">
          <div className="rounded-3xl border border-purple-200/80 bg-gradient-to-r from-white via-purple-50/70 to-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-700 font-bold">Need custom colors or design?</p>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-plum mt-2">
                Create a bespoke piece in our <span className="italic text-gradient">Custom Studio</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg">
                Choose yarn hues, personalized names, and special bouquet arrangements crafted just for you.
              </p>
            </div>
            <Link
              to="/custom-orders"
              className="rounded-full btn-royal px-8 py-3.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Launch Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/60 py-12 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-display text-plum font-semibold text-base">Inventive Queen</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-600 font-medium">Royal Crochet Atelier</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Inventive Queen — Crocheted with love & care</p>
        </div>
      </footer>
    </div>
  );
}
