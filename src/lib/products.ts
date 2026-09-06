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
  {
    slug: "doll",
    title: "Crochet Dolls",
    iconName: "Crown",
    description: "Handmade amigurumi dolls customizable to your reference photo.",
  },
  {
    slug: "bouquet",
    title: "Forever Flowers",
    iconName: "Flower",
    description: "Everlasting crochet bouquets that keep their vibrant colour forever.",
  },
  {
    slug: "plushie",
    title: "Characters & Animals",
    iconName: "Heart",
    description: "Cute custom animal plushies, mascots and companions.",
  },
  {
    slug: "keychain",
    title: "Charms & Keychains",
    iconName: "Key",
    description: "Pocket-sized crochet charms perfect for bag accessories & gifts.",
  },
] as const;

/**
 * Default catalogue starts empty. Products are managed dynamically via the Admin Panel
 * and synchronized in real-time with the Supabase `cms_products` table.
 */
export const products: Product[] = [];
