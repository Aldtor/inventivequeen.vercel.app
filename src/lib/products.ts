import bouquetGrand from "@/assets/products/bouquets/product-bouquet-grand.png";
import bouquetLily2 from "@/assets/products/bouquets/product-bouquet-lily-2.png";
import bouquetLilyVase from "@/assets/products/bouquets/product-bouquet-lily-vase.png";
import bouquetMixed1 from "@/assets/products/bouquets/product-bouquet-mixed-1.png";
import bouquetPastel from "@/assets/products/bouquets/product-bouquet-pastel.png";
import bouquetPastel2 from "@/assets/products/bouquets/product-bouquet-pastel-2.png";
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bouquetRose2 from "@/assets/products/bouquets/product-bouquet-rose-2.png";
import bouquetRose3 from "@/assets/products/bouquets/product-bouquet-rose-3.png";
import bouquetSunflower from "@/assets/products/bouquets/product-bouquet-sunflower.jpg";
import bouquetTulip from "@/assets/products/bouquets/product-bouquet-tulip.jpg";
import roseBouquetHandheld from "@/assets/products/bouquets/product-rose-bouquet-handheld.png";
import roseBouquetRibbon from "@/assets/products/bouquets/product-rose-bouquet-ribbon.png";
import roseBouquetTagged from "@/assets/products/bouquets/product-rose-bouquet-tagged.png";

import catKeepsakeDolls from "@/assets/products/categories/cat-keepsake-dolls.jpg";
import catForeverFlowers from "@/assets/products/categories/cat-forever-flowers.jpg";
import catPlush from "@/assets/products/categories/cat-plush.jpg";

import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import bunnyKeychain from "@/assets/products/keychains/product-bunny-heart-keychain.png";
import dinoKeychain from "@/assets/products/keychains/product-green-dino-keychain.png";
import owlKeychain from "@/assets/products/keychains/product-pink-owl-keychain.png";
import strawberryCow from "@/assets/products/keychains/product-strawberry-cow-keychain.png";
import blackBear from "@/assets/products/keychains/product-black-bear-keychain.png";

import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import whiteBearRed from "@/assets/products/plushies/product-white-bear-red-overalls.png";
import panda from "@/assets/products/plushies/product-panda.jpeg";
import penguin1 from "@/assets/products/plushies/product-penguin-1.jpeg";
import penguin2 from "@/assets/products/plushies/product-penguin-2.jpeg";

import bookmark from "@/assets/products/misc/product-peacock-bookmark-real.png";
import dollsImg from "@/assets/dolls.jpg";
import minisImg from "@/assets/minis.jpg";

export type ProductType = "doll" | "bouquet" | "keychain" | "plushie" | "misc";

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
  size?: string;
  badge?: string;
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
  { slug: "doll", title: "Crochet Dolls", emoji: "👑", description: "Handmade amigurumi dolls customizable to your reference photo." },
  { slug: "bouquet", title: "Forever Flowers", emoji: "💐", description: "Everlasting crochet bouquets that keep their vibrant colour forever." },
  { slug: "plushie", title: "Characters & Animals", emoji: "🧸", description: "Cute custom animal plushies, mascots and companions." },
  { slug: "keychain", title: "Charms & Keychains", emoji: "🔑", description: "Pocket-sized crochet charms perfect for bag accessories & gifts." },
] as const;

export const products: Product[] = [
  // ── Dolls ──
  {
    id: "regular-doll",
    name: "Regular Doll",
    price: "₹2,400",
    originalPrice: "₹2,800",
    sellingPrice: "₹2,400",
    discountPercent: 14,
    type: "doll",
    size: "Small 7in · Medium 9in · Large 11in",
    tagline: "Custom keepsake doll hand-stitched from your reference photo",
    description: "Detailed amigurumi doll created from soft milk cotton yarn. Fully customizable clothing, hair, and accessories.",
    images: [catKeepsakeDolls, dollsImg],
    badge: "⭐ Bestseller",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "mini-regular-doll",
    name: "Mini Regular Doll",
    price: "₹1,600",
    sellingPrice: "₹1,600",
    type: "doll",
    size: "5 inches · 12.7 cm",
    tagline: "Compact adorable doll with custom outfit",
    description: "Our signature 5-inch miniature amigurumi doll with intricate detailing and posable charm.",
    images: [dollsImg],
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "mini-doll",
    name: "Mini Doll",
    price: "₹1,600",
    sellingPrice: "₹1,600",
    type: "doll",
    size: "3.5 – 4 inches",
    tagline: "Cute pocket-sized keepsake",
    description: "Sweet miniature doll made to match your loved one or favorite character.",
    images: [minisImg],
    badge: "⭐ Bestseller",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "seated-doll",
    name: "Seated Doll",
    price: "₹1,600",
    sellingPrice: "₹1,600",
    type: "doll",
    size: "5 inches · approx. 16 cm",
    tagline: "Desk or shelf buddy in seated pose",
    description: "Designed to sit comfortably on your study table, car dashboard, or bookshelf.",
    images: [whiteBearPink],
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "chunky-doll",
    name: "Chunky Doll",
    price: "₹3,600",
    originalPrice: "₹4,200",
    sellingPrice: "₹3,600",
    discountPercent: 14,
    type: "doll",
    size: "12 inches",
    tagline: "Substantial plush doll crafted in thick chenille yarn",
    description: "Ultra-cuddly 12-inch chunky crochet doll that feels like a warm hug.",
    images: [owlKeychain],
    isActive: true,
    sortOrder: 5,
  },

  // ── Flowers ──
  {
    id: "mixed-rose-grand-bouquet",
    name: "Grand Rose Bouquet",
    price: "₹1,499",
    originalPrice: "₹1,799",
    sellingPrice: "₹1,499",
    discountPercent: 17,
    type: "bouquet",
    size: "Multi-stem full wrap",
    tagline: "A majestic symphony of forever roses hand-stitched in milk cotton 💐",
    description: "A show-stopping crochet bouquet featuring meticulously hand-shaped roses wrapped in premium layered lilac-gold tissue and silk ribbon.",
    images: [bouquetGrand, bouquetRose, bouquetRose2, roseBouquetHandheld],
    badge: "💐 Popular",
    isActive: true,
    sortOrder: 6,
  },
  {
    id: "sunflower-bouquet",
    name: "Sunflower Stem / Wrap",
    price: "₹500",
    sellingPrice: "₹500",
    type: "bouquet",
    size: "4×4 in · 6×6 in",
    tagline: "Bright cheerful sunflower that never wilts",
    description: "Vibrant yellow petals with realistic textured seed centre, wired stem and leaf detail.",
    images: [bouquetSunflower],
    isActive: true,
    sortOrder: 7,
  },
  {
    id: "tulip-stem",
    name: "Tulip Stem",
    price: "₹260",
    sellingPrice: "₹260",
    type: "bouquet",
    size: "Single stem with ribbon",
    tagline: "Elegant Dutch-style crochet tulip",
    description: "Soft pastel tulip blossom with graceful stem, wrapped in translucent frosted paper.",
    images: [bouquetTulip],
    isActive: true,
    sortOrder: 8,
  },
  {
    id: "rose-stem",
    name: "Rose Stem",
    price: "₹300",
    sellingPrice: "₹300",
    type: "bouquet",
    size: "Single stem",
    tagline: "Classic romantic rose wrapped with ribbon",
    description: "Deep red or blush pink everlasting rose with delicate leaf and bow.",
    images: [bouquetRose, roseBouquetRibbon],
    badge: "💐 Popular",
    isActive: true,
    sortOrder: 9,
  },
  {
    id: "pastel-bouquet",
    name: "Pastel Meadow Bouquet",
    price: "₹990",
    originalPrice: "₹1,200",
    sellingPrice: "₹990",
    discountPercent: 18,
    type: "bouquet",
    size: "Medium arrangement",
    tagline: "Dreamy lavender, daisies and blush blossoms",
    description: "Curated harmonious arrangement in lilac and baby pink tones, wrapped with matching ribbon.",
    images: [bouquetPastel, bouquetPastel2],
    isActive: true,
    sortOrder: 10,
  },
  {
    id: "lily-vase-bouquet",
    name: "Lily & Foliage Arrangement",
    price: "₹1,250",
    sellingPrice: "₹1,250",
    type: "bouquet",
    size: "Large arrangement",
    tagline: "Pristine white lilies and emerald greens",
    description: "Graceful bell-shaped lilies with yellow stamens and surrounding foliage.",
    images: [bouquetLilyVase, bouquetLily2],
    isActive: true,
    sortOrder: 11,
  },

  // ── Plushies & Animals ──
  {
    id: "white-bear-overalls",
    name: "White Bear in Overalls",
    price: "₹1,200",
    sellingPrice: "₹1,200",
    type: "plushie",
    size: "6 inches",
    tagline: "Cozy teddy bear wearing custom dungarees",
    description: "Fluffy amigurumi bear with safety eyes and adorable removable overalls.",
    images: [whiteBearPink, whiteBearRed],
    badge: "🎁 Great gift",
    isActive: true,
    sortOrder: 12,
  },
  {
    id: "panda-plushie",
    name: "Panda Plushie",
    price: "₹1,350",
    sellingPrice: "₹1,350",
    type: "plushie",
    size: "6.5 inches",
    tagline: "Chubby bamboo panda amigurumi",
    description: "Round black and white panda with sweet embroidered nose and plush ears.",
    images: [panda],
    isActive: true,
    sortOrder: 13,
  },
  {
    id: "penguin-plushie",
    name: "Penguin Plushie",
    price: "₹950",
    sellingPrice: "₹950",
    type: "plushie",
    size: "5 inches",
    tagline: "Waddling cutie with yellow beak and flippers",
    description: "Cute little penguin companion made from super-soft cotton yarn.",
    images: [penguin1, penguin2],
    isActive: true,
    sortOrder: 14,
  },

  // ── Keychains ──
  {
    id: "bear-keychain",
    name: "Yellow Bear Keychain",
    price: "₹700",
    sellingPrice: "₹700",
    type: "keychain",
    size: "3 inches with gold clasp",
    tagline: "Pocket-sized bear charm for bags & keys",
    description: "Sturdy stitched bear charm fitted with a durable metallic swivel clasp.",
    images: [bearKeychain],
    badge: "🎁 Great gift",
    isActive: true,
    sortOrder: 15,
  },
  {
    id: "bunny-heart-keychain",
    name: "Bunny Heart Keychain",
    price: "₹700",
    sellingPrice: "₹700",
    type: "keychain",
    size: "3 inches",
    tagline: "White bunny holding a pastel heart",
    description: "Sweet rabbit amigurumi holding a tiny stuffed heart.",
    images: [bunnyKeychain],
    isActive: true,
    sortOrder: 16,
  },
  {
    id: "dino-keychain",
    name: "Green Dino Keychain",
    price: "₹700",
    sellingPrice: "₹700",
    type: "keychain",
    size: "3.2 inches",
    tagline: "Friendly little dinosaur with back ridges",
    description: "Playful crochet dino charm in mint green with cute back scales.",
    images: [dinoKeychain],
    isActive: true,
    sortOrder: 17,
  },
  {
    id: "strawberry-cow-keychain",
    name: "Strawberry Cow Keychain",
    price: "₹750",
    sellingPrice: "₹750",
    type: "keychain",
    size: "3 inches",
    tagline: "Pink spotted cow with strawberry horn detail",
    description: "Viral favorite strawberry cow charm with floppy ears and snout.",
    images: [strawberryCow],
    isActive: true,
    sortOrder: 18,
  },
  {
    id: "peacock-bookmark",
    name: "Peacock Bookmark",
    price: "₹450",
    sellingPrice: "₹450",
    type: "misc",
    size: "8 inches length",
    tagline: "Lace feather tail bookmark for novel lovers",
    description: "Exquisite crochet bookmark with peacock fan motif that drapes down the book spine.",
    images: [bookmark],
    isActive: true,
    sortOrder: 19,
  },
];
