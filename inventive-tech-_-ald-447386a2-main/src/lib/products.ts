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

export type ProductType = "teddy" | "bouquet" | "keychain" | "bookmark";

export interface Product {
  id: string;
  name: string;
  price: string;
  type: ProductType;
  tagline: string;
  description: string;
  images: string[];
  colors?: { name: string; value: string }[];
  flowers?: string[];
  flowerColors?: { name: string; value: string }[];
  isActive?: boolean;
  sortOrder?: number;
  isCmsProduct?: boolean;
}

export const categories = [
  { slug: "keychain", title: "Keychains", emoji: "🔑", description: "Tiny handmade companions for your bag, keys, or to gift someone special." },
  { slug: "teddy", title: "Plush Toys", emoji: "🧸", description: "Cuddly crochet friends made with love and the softest yarn." },
  { slug: "bouquet", title: "Crochet Bouquets", emoji: "💐", description: "Everlasting handmade flowers — bloom forever, never wilt." },
  { slug: "bookmark", title: "Bookmarks", emoji: "🔖", description: "Delicate page-keepers handcrafted for book lovers." },
] as const;

export const products: Product[] = [
  // ───────── Keychains ─────────
  {
    id: "panda-keychain",
    name: "Panda Keychain",
    price: "₹179",
    type: "keychain",
    tagline: "Small in size, big in love 🐼",
    description:
      "This charming panda keychain is lovingly crocheted with soft yarn. Its tiny round ears and cute face make it an irresistible gift. Clip it on and carry a piece of handmade joy with you every day.",
    images: [productPanda],
  },
  {
    id: "pink-penguin-keychain",
    name: "Pink Penguin Keychain",
    price: "₹199",
    type: "keychain",
    tagline: "A tiny companion that carries love everywhere 💕",
    description:
      "This adorable mini penguin is crocheted by hand using soft acrylic yarn. Attach it to your bag, keys, or gift it to someone special — it's a little bundle of happiness in your pocket.",
    images: [productPenguin1, productPenguin2],
  },
  {
    id: "pink-owl-keychain",
    name: "Pink Owl Keychain",
    price: "₹219",
    type: "keychain",
    tagline: "A wise little owl with the softest heart 🦉💕",
    description:
      "This adorable pink owl is hand-crocheted with cotton yarn and finished with tiny black bead eyes. Lightweight, sturdy, and ready to brighten up your bag or keys — a sweet gift that whispers 'I made this for you.'",
    images: [pinkOwlKeychain],
  },
  {
    id: "strawberry-cow-keychain",
    name: "Strawberry Cow Keychain",
    price: "₹229",
    type: "keychain",
    tagline: "A berry sweet little moo 🍓🐄",
    description:
      "This dreamy strawberry cow is hand-crocheted with soft cotton yarn — pink ears, tiny strawberry crown, and the sweetest face. A one-of-a-kind charm for your bag, keys, or as a heartfelt little gift.",
    images: [strawberryCowKeychain],
  },
  {
    id: "black-bear-keychain",
    name: "Black Bear Keychain",
    price: "₹189",
    type: "keychain",
    tagline: "A bold little bear with a soft heart 🖤",
    description:
      "A snuggly black bear crocheted from premium fluffy yarn with a tiny stitched nose and bead eyes. Sleek, charming, and the perfect everyday companion for your bag or keys.",
    images: [blackBearKeychain],
  },
  {
    id: "green-dino-keychain",
    name: "Green Dino Keychain",
    price: "₹199",
    type: "keychain",
    tagline: "A tiny prehistoric friend for your keys 🦕",
    description:
      "This chubby little dinosaur is hand-crocheted with vibrant green yarn and finished with a sturdy clip. With its round body, sweet expression, and cheerful spike, it's the perfect companion for your bag or keyring.",
    images: [greenDinoKeychain],
  },
  {
    id: "bunny-heart-keychain",
    name: "Bunny with Heart Keychain",
    price: "₹239",
    type: "keychain",
    tagline: "A bunny holding a heart full of love 🐰💗",
    description:
      "This sweet little bunny holds a tiny pink crochet heart against her chest. Soft cream yarn, floppy ears, and hand-stitched details make her a charming gift for bunny lovers of every age.",
    images: [bunnyHeartKeychain],
  },
  {
    id: "yellow-bear-keychain",
    name: "Yellow Bear Keychain",
    price: "₹209",
    type: "keychain",
    tagline: "Sunny little teddy, always smiling ☀️🧸",
    description:
      "A cheerful yellow crochet bear with tiny round ears and soft texture, handcrafted to brighten up your keyring or bag.",
    images: [yellowBearKeychain],
  },
  {
    id: "purple-bear-heart-keychain",
    name: "Purple Bear Heart Keychain",
    price: "₹239",
    type: "keychain",
    tagline: "Tiny bear, big heart 💜",
    description:
      "This mini purple bear holds a bold red crochet heart and comes with a little bell charm — a sweet keepsake for gifting or everyday carry.",
    images: [purpleBearHeartKeychain],
  },
  {
    id: "white-bear-red-overalls-keychain",
    name: "White Bear in Red Overalls",
    price: "₹229",
    type: "keychain",
    tagline: "Classic teddy style with playful charm ❤️",
    description:
      "A lovable white bear crocheted with bright red overalls, designed as an adorable handmade keychain for gifts, return favors, and everyday joy.",
    images: [whiteBearRedOveralls],
  },

  // ───────── Bouquets ─────────
  {
    id: "mixed-rose-bouquet",
    name: "Mixed Rose Bouquet",
    price: "₹699",
    type: "bouquet",
    tagline: "A full bouquet of everlasting roses for unforgettable gifting 💐",
    description:
      "A richly arranged crochet bouquet featuring hand-shaped roses in red, pink, yellow, and white. Finished with ribbon or soft wrap depending on the style, this is a lasting statement gift for birthdays, anniversaries, and heartfelt surprises.",
    images: [roseBouquetRibbon, roseBouquetTagged2, roseBouquetTagged, roseBouquetHandheld, bouquetGrand, bouquetRose, bouquetRose2, bouquetRose3, bouquetMixed1, bouquetMixed2, bouquetMixed3, bouquetMixed4, bouquetMixed5],
    flowers: ["Rose"],
    flowerColors: [
      { name: "Red", value: "hsl(0 70% 55%)" },
      { name: "Pink", value: "hsl(350 60% 75%)" },
      { name: "Yellow", value: "hsl(45 90% 60%)" },
      { name: "White", value: "hsl(0 0% 95%)" },
    ],
  },
  {
    id: "pastel-mini-bouquet",
    name: "Pastel Mini Bouquet",
    price: "₹399",
    type: "bouquet",
    tagline: "A soft little posy tied with twine and love 🤍",
    description:
      "A dainty crochet bouquet in pastel tones with blush pink, ivory, and soft cream blooms. Small, elegant, and made for sweet everyday gifting.",
    images: [bouquetPastel, bouquetPastel2],
    flowers: ["Rose"],
    flowerColors: [
      { name: "Pink", value: "hsl(350 60% 75%)" },
      { name: "Cream", value: "hsl(40 50% 88%)" },
      { name: "White", value: "hsl(0 0% 95%)" },
    ],
  },
  {
    id: "lily-rose-bouquet",
    name: "Lily & Roses Bouquet",
    price: "₹649",
    type: "bouquet",
    tagline: "A sunny bouquet pairing bold lilies with romantic roses 🌼",
    description:
      "A cheerful crochet arrangement combining a bright yellow lily with rich red roses, available in bouquet and display-ready styles. Designed as a standout handmade gift that feels fresh, warm, and memorable.",
    images: [bouquetLilyVase, bouquetLily2, bouquetLily3, bouquetLily4, bouquetLily5, bouquetLily6],
    flowers: ["Lily", "Rose"],
    flowerColors: [
      { name: "Yellow", value: "hsl(45 90% 60%)" },
      { name: "Red", value: "hsl(0 70% 55%)" },
      { name: "Pink", value: "hsl(350 60% 75%)" },
    ],
  },
  // ───────── Bookmarks ─────────
  {
    id: "peacock-bookmark",
    name: "Peacock Bookmark",
    price: "₹249",
    type: "bookmark",
    tagline: "A perfect handmade gift to make your loved ones smile 💖",
    description:
      "This delicate peacock bookmark is hand-crocheted with premium cotton yarn. Each feather detail is crafted with care, making it a unique and thoughtful gift for book lovers. Lightweight yet sturdy — it sits beautifully between pages without leaving marks.",
    images: [peacockBookmarkReal, productBookmark],
  },
];
