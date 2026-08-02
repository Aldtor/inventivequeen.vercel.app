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
  { slug: "keychain", title: "Keychains", emoji: "🔑", description: "Tiny handmade companions for your bag, keys, or to gift someone special." },
  { slug: "bouquet", title: "Crochet Flowers", emoji: "💐", description: "Everlasting handmade flowers — bloom forever, never wilt." },
  { slug: "doll", title: "Dolls", emoji: "🪆", description: "Soft handmade dolls and keepsake characters made for gifting." },
] as const;

export const products: Product[] = [];
