import productBookmark from "@/assets/product-bookmark.jpeg";
import productPenguin1 from "@/assets/product-penguin-1.jpeg";
import productPenguin2 from "@/assets/product-penguin-2.jpeg";
import productPanda from "@/assets/product-panda.jpeg";

import bouquetRose from "@/assets/product-bouquet-rose.png";
import bouquetRose2 from "@/assets/product-bouquet-rose-2.png";
import bouquetRose3 from "@/assets/product-bouquet-rose-3.png";
import bouquetGrand from "@/assets/product-bouquet-grand.png";
import bouquetPastel from "@/assets/product-bouquet-pastel.png";
import bouquetPastel2 from "@/assets/product-bouquet-pastel-2.png";
import bouquetLilyVase from "@/assets/product-bouquet-lily-vase.png";
import bouquetLily2 from "@/assets/product-bouquet-lily-2.png";
import bouquetLily3 from "@/assets/product-bouquet-lily-3.png";
import bouquetLily4 from "@/assets/product-bouquet-lily-4.png";
import bouquetLily5 from "@/assets/product-bouquet-lily-5.png";
import bouquetLily6 from "@/assets/product-bouquet-lily-6.png";
import bouquetMixed1 from "@/assets/product-bouquet-mixed-1.png";
import bouquetMixed2 from "@/assets/product-bouquet-mixed-2.png";
import bouquetMixed3 from "@/assets/product-bouquet-mixed-3.png";
import bouquetMixed4 from "@/assets/product-bouquet-mixed-4.png";
import bouquetMixed5 from "@/assets/product-bouquet-mixed-5.png";
import pinkOwlKeychain from "@/assets/product-pink-owl-keychain.png";
import roseBouquetHandheld from "@/assets/product-rose-bouquet-handheld.png";
import roseBouquetTagged from "@/assets/product-rose-bouquet-tagged.png";

import strawberryCowKeychain from "@/assets/product-strawberry-cow-keychain.png";
import blackBearKeychain from "@/assets/product-black-bear-keychain.png";
import roseBouquetTagged2 from "@/assets/product-rose-bouquet-tagged-2.png";
import greenDinoKeychain from "@/assets/product-green-dino-keychain.png";
import bunnyHeartKeychain from "@/assets/product-bunny-heart-keychain.png";
import yellowBearKeychain from "@/assets/product-yellow-bear-keychain.png";
import roseBouquetRibbon from "@/assets/product-rose-bouquet-ribbon.png";
import peacockBookmarkReal from "@/assets/product-peacock-bookmark-real.png";
import purpleBearHeartKeychain from "@/assets/product-purple-bear-heart-keychain.png";
import whiteBearRedOveralls from "@/assets/product-white-bear-red-overalls.png";

export type ProductType = "teddy" | "bouquet" | "keychain" | "bookmark" | "doll";

export interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  sellingPrice?: string;
  discountPercent?: number;
  type: ProductType;
  tagline: string;
  description: string;
  images: string[];
  isNewArrival?: boolean;
  newArrivalDays?: number;
  newArrivalStartedAt?: string | null;
  colors?: { name: string; value: string }[];
  flowers?: string[];
  flowerColors?: { name: string; value: string }[];
  isActive?: boolean;
  sortOrder?: number;
  isCmsProduct?: boolean;
}

export const categories = [
  { slug: "bouquet", title: "Forever Flowers", emoji: "💐", description: "Everlasting handmade crochet flowers — bloom forever, never wilt." },
  { slug: "doll", title: "Keepsake Dolls", emoji: "🧸", description: "Soft heirloom-grade crochet dolls and keepsake plushies made with love." },
  { slug: "keychain", title: "Pocket Charms", emoji: "🔑", description: "Tiny handmade companions for your bag, keys, or thoughtful gifting." },
  { slug: "bookmark", title: "Bookmarks", emoji: "🔖", description: "Delicate crochet page-keepers handcrafted for book lovers." },
] as const;

export const products: Product[] = [
  // ── Bouquets ──
  {
    id: "mixed-rose-grand-bouquet",
    name: "Mixed Rose Grand Atelier Bouquet",
    price: "₹799",
    originalPrice: "₹999",
    sellingPrice: "₹799",
    discountPercent: 20,
    type: "bouquet",
    tagline: "A majestic symphony of forever roses hand-stitched in milk cotton 💐",
    description:
      "A show-stopping crochet bouquet featuring meticulously hand-shaped roses in romantic shades of crimson red, blush pink, sunny yellow, and ivory cream. Wrapped in premium layered lilac-gold tissue and finished with a shimmering silk ribbon. Unlike fresh flowers, these everlasting blooms preserve your love and memories forever without wilting.",
    images: [
      roseBouquetRibbon,
      roseBouquetTagged2,
      roseBouquetTagged,
      roseBouquetHandheld,
      bouquetGrand,
      bouquetRose,
      bouquetRose2,
      bouquetRose3,
      bouquetMixed1,
      bouquetMixed2,
      bouquetMixed3,
      bouquetMixed4,
      bouquetMixed5,
    ],
    isNewArrival: true,
    newArrivalDays: 30,
    isActive: true,
    sortOrder: 1,
    flowers: ["Rose", "Eucalyptus", "Baby's Breath"],
    flowerColors: [
      { name: "Crimson Red", value: "hsl(0 70% 55%)" },
      { name: "Blush Pink", value: "hsl(350 65% 75%)" },
      { name: "Sunny Yellow", value: "hsl(45 90% 60%)" },
      { name: "Ivory White", value: "hsl(40 40% 96%)" },
      { name: "Lavender Lilac", value: "hsl(275 60% 70%)" },
    ],
  },
  {
    id: "royal-lily-rose-bouquet",
    name: "Royal Lily & Rose Keepsake Bouquet",
    price: "₹749",
    originalPrice: "₹899",
    sellingPrice: "₹749",
    discountPercent: 17,
    type: "bouquet",
    tagline: "Radiant golden lilies paired with romantic blush roses 🌼",
    description:
      "A cheerful and elegant crochet arrangement pairing majestic yellow open lilies with sweet red and blush roses, surrounded by detailed green leaves. Perfect for birthdays, graduations, anniversaries, or room decoration that brings warmth all year round.",
    images: [bouquetLilyVase, bouquetLily2, bouquetLily3, bouquetLily4, bouquetLily5, bouquetLily6],
    isNewArrival: true,
    newArrivalDays: 20,
    isActive: true,
    sortOrder: 2,
    flowers: ["Lily", "Rose"],
    flowerColors: [
      { name: "Golden Lily", value: "hsl(45 95% 58%)" },
      { name: "Ruby Rose", value: "hsl(0 75% 52%)" },
      { name: "Pastel Pink", value: "hsl(340 70% 75%)" },
    ],
  },
  {
    id: "pastel-dream-posy",
    name: "Pastel Dream Posy Bouquet",
    price: "₹449",
    originalPrice: "₹549",
    sellingPrice: "₹449",
    discountPercent: 18,
    type: "bouquet",
    tagline: "A delicate, sweet posy tied with satin and love 🌸",
    description:
      "A dainty, charming crochet bouquet crafted in soothing pastel tones with blush pink, cream, and soft white blooms. Lightweight, beautifully wrapped, and made for thoughtful everyday gifting.",
    images: [bouquetPastel, bouquetPastel2],
    isNewArrival: false,
    isActive: true,
    sortOrder: 3,
    flowers: ["Rose", "Mini Carnation"],
    flowerColors: [
      { name: "Pastel Pink", value: "hsl(350 60% 75%)" },
      { name: "Soft Cream", value: "hsl(40 50% 88%)" },
      { name: "Pure White", value: "hsl(0 0% 98%)" },
    ],
  },

  // ── Dolls & Plushies ──
  {
    id: "royal-purple-bear-doll",
    name: "Royal Purple Bear Keepsake Doll",
    price: "₹699",
    originalPrice: "₹899",
    sellingPrice: "₹699",
    discountPercent: 22,
    type: "doll",
    tagline: "Our signature atelier mascot teddy with heart charm 💜🧸",
    description:
      "Handcrafted with heirloom-grade milk cotton yarn, this ultra-plush purple bear features an adorable snout, stitched heart badge, and a gold bell collar. Sitting comfortably on desks, shelves, or beds, it is the ultimate cuddly gift for someone special.",
    images: [purpleBearHeartKeychain, whiteBearRedOveralls],
    isNewArrival: true,
    newArrivalDays: 30,
    isActive: true,
    sortOrder: 4,
    colors: [
      { name: "Royal Purple", value: "hsl(270 70% 60%)" },
      { name: "Pastel Cream", value: "hsl(40 50% 90%)" },
      { name: "Baby Pink", value: "hsl(340 70% 80%)" },
    ],
  },
  {
    id: "penguin-chibi-doll",
    name: "Penguin Chibi Keepsake Doll",
    price: "₹649",
    originalPrice: "₹799",
    sellingPrice: "₹649",
    discountPercent: 19,
    type: "doll",
    tagline: "A chubby little arctic friend with sweet blushing cheeks 🐧✨",
    description:
      "This irresistible handmade penguin doll is crocheted with ultra-soft yarn, featuring tiny flippers, sunny orange feet, and sweet blushing cheeks. Lovingly stuffed with hypoallergenic fiberfill for endless hugs.",
    images: [productPenguin1, productPenguin2],
    isNewArrival: false,
    isActive: true,
    sortOrder: 5,
    colors: [
      { name: "Classic Tuxedo", value: "hsl(220 20% 15%)" },
      { name: "Pastel Pink", value: "hsl(340 70% 80%)" },
      { name: "Sky Blue", value: "hsl(200 80% 75%)" },
    ],
  },
  {
    id: "panda-sweetheart-doll",
    name: "Panda Sweetheart Plush Doll",
    price: "₹649",
    originalPrice: "₹799",
    sellingPrice: "₹649",
    discountPercent: 19,
    type: "doll",
    tagline: "Round ears, warm hugs, and pure handmade happiness 🐼",
    description:
      "A classic favorite! Lovingly hand-knitted with plush cotton yarn, this panda features signature round black ears, sweet expressive eyes, and huggable proportions. Designed to bring comfort wherever it sits.",
    images: [productPanda],
    isNewArrival: false,
    isActive: true,
    sortOrder: 6,
    colors: [
      { name: "Monochrome Black & White", value: "hsl(0 0% 15%)" },
      { name: "Choco Brown & Cream", value: "hsl(25 40% 30%)" },
    ],
  },

  // ── Keychains & Pocket Charms ──
  {
    id: "bunny-heart-keychain",
    name: "Bunny with Heart Pocket Charm",
    price: "₹249",
    originalPrice: "₹299",
    sellingPrice: "₹249",
    discountPercent: 17,
    type: "keychain",
    tagline: "A gentle bunny holding a tiny heart full of love 🐰💗",
    description:
      "This sweet little bunny holds a tiny pink crochet heart against her chest. Crocheted with soft cream yarn, floppy ears, and hand-stitched details. Comes equipped with a sturdy gold lobster clasp to attach to totes, backpacks, and car keys.",
    images: [bunnyHeartKeychain],
    isNewArrival: true,
    newArrivalDays: 25,
    isActive: true,
    sortOrder: 7,
    colors: [
      { name: "Cream White", value: "hsl(40 40% 95%)" },
      { name: "Blush Pink", value: "hsl(340 70% 80%)" },
      { name: "Caramel Tan", value: "hsl(30 50% 65%)" },
    ],
  },
  {
    id: "strawberry-cow-keychain",
    name: "Strawberry Cow Pocket Charm",
    price: "₹249",
    originalPrice: "₹299",
    sellingPrice: "₹249",
    discountPercent: 17,
    type: "keychain",
    tagline: "A berry sweet little moo for your daily adventures 🍓🐄",
    description:
      "This dreamy strawberry cow is hand-crocheted with soft cotton yarn — sweet pink ears, tiny strawberry crown, embroidered nostrils, and the gentlest face. A bestseller charm that brings smiles everywhere.",
    images: [strawberryCowKeychain],
    isNewArrival: true,
    newArrivalDays: 15,
    isActive: true,
    sortOrder: 8,
    colors: [
      { name: "Strawberry Pink", value: "hsl(340 70% 75%)" },
      { name: "Blueberry Lavender", value: "hsl(260 60% 75%)" },
    ],
  },
  {
    id: "pink-owl-keychain",
    name: "Pink Owl Sweetheart Charm",
    price: "₹229",
    originalPrice: "₹279",
    sellingPrice: "₹229",
    discountPercent: 18,
    type: "keychain",
    tagline: "A wise little owl with a heart of pure gold 🦉💕",
    description:
      "Hand-crocheted with fine cotton yarn and accented with cute safety eyes and delicate feathered wings. Lightweight, durable, and ready to guard your keys or personalize your favorite handbag.",
    images: [pinkOwlKeychain],
    isNewArrival: false,
    isActive: true,
    sortOrder: 9,
    colors: [
      { name: "Rose Pink", value: "hsl(340 65% 70%)" },
      { name: "Lilac Purple", value: "hsl(275 60% 72%)" },
      { name: "Mint Green", value: "hsl(150 50% 70%)" },
    ],
  },
  {
    id: "green-dino-keychain",
    name: "Green Dino Explorer Charm",
    price: "₹219",
    originalPrice: "₹269",
    sellingPrice: "₹219",
    discountPercent: 19,
    type: "keychain",
    tagline: "A chubby prehistoric buddy for everyday adventures 🦕",
    description:
      "This adorable chubby dinosaur is stitched in cheerful lime green yarn with tiny back spikes and a curled tail. A playful unisex gift that kids, teens, and adults adore.",
    images: [greenDinoKeychain],
    isNewArrival: false,
    isActive: true,
    sortOrder: 10,
    colors: [
      { name: "Lime Green", value: "hsl(100 60% 55%)" },
      { name: "Aqua Teal", value: "hsl(180 50% 60%)" },
    ],
  },
  {
    id: "yellow-bear-keychain",
    name: "Sunny Yellow Bear Charm",
    price: "₹209",
    originalPrice: "₹259",
    sellingPrice: "₹209",
    discountPercent: 19,
    type: "keychain",
    tagline: "Warm sunshine in your pocket wherever you go ☀️🧸",
    description:
      "A cheerful yellow crochet teddy bear with tiny rounded ears and velvety soft texture. Handcrafted to brighten up any bag or keyring set.",
    images: [yellowBearKeychain],
    isNewArrival: false,
    isActive: true,
    sortOrder: 11,
  },
  {
    id: "black-bear-keychain",
    name: "Midnight Bear Charm",
    price: "₹199",
    originalPrice: "₹249",
    sellingPrice: "₹199",
    discountPercent: 20,
    type: "keychain",
    tagline: "Sleek, bold teddy with a warm heart 🖤",
    description:
      "Crafted from premium fluffy black cotton yarn with contrasting white muzzle and bead eyes. Minimalist yet intensely cute.",
    images: [blackBearKeychain],
    isNewArrival: false,
    isActive: true,
    sortOrder: 12,
  },

  // ── Bookmarks ──
  {
    id: "peacock-feather-bookmark",
    name: "Peacock Feather Heirloom Bookmark",
    price: "₹249",
    originalPrice: "₹299",
    sellingPrice: "₹249",
    discountPercent: 17,
    type: "bookmark",
    tagline: "A majestic handmade page-keeper for book lovers 🦚📖",
    description:
      "This exquisite peacock feather bookmark is crocheted using fine mercerized cotton yarn with royal turquoise, emerald green, and amber gold accents. Sits flat between pages without bending the spine, making every reading session feel special.",
    images: [peacockBookmarkReal, productBookmark],
    isNewArrival: true,
    newArrivalDays: 20,
    isActive: true,
    sortOrder: 13,
    colors: [
      { name: "Royal Peacock", value: "hsl(185 80% 40%)" },
      { name: "Emerald Gold", value: "hsl(145 70% 35%)" },
      { name: "Sunset Plum", value: "hsl(300 50% 45%)" },
    ],
  },
];
