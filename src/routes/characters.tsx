import { createFileRoute } from "@tanstack/react-router";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";

/* Real product images */
import plushiesImg from "@/assets/plushies.jpg";
import minisImg from "@/assets/minis.jpg";
import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import whiteBearRed from "@/assets/products/plushies/product-white-bear-red-overalls.png";
import panda from "@/assets/products/plushies/product-panda.jpeg";
import penguin1 from "@/assets/products/plushies/product-penguin-1.jpeg";
import penguin2 from "@/assets/products/plushies/product-penguin-2.jpeg";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import bunnyKeychain from "@/assets/products/keychains/product-bunny-heart-keychain.png";
import dinoKeychain from "@/assets/products/keychains/product-green-dino-keychain.png";
import owlKeychain from "@/assets/products/keychains/product-pink-owl-keychain.png";
import strawberryCow from "@/assets/products/keychains/product-strawberry-cow-keychain.png";
import blackBear from "@/assets/products/keychains/product-black-bear-keychain.png";
import catPlush from "@/assets/products/categories/cat-plush.jpg";

export const Route = createFileRoute("/characters")({
  component: CharactersPage,
  head: () => ({
    meta: [
      { title: "Characters & Plushies Pricelist — Inventive Queen" },
      {
        name: "description",
        content:
          "Handmade crochet animals, mascots and character plushies by Inventive Queen, priced per inch and made from your reference photo.",
      },
      { property: "og:title", content: "Characters & Plushies — Inventive Queen" },
      {
        property: "og:description",
        content: "Crochet animals, mascots and plushies made to order in any size.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/characters" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/characters" }],
  }),
});

const ITEMS = [
  {
    name: "Animal Crochet",
    size: "3 inches up to any size",
    price: "₹340 per inch",
    note: "Option 1: chunky yarn · Option 2: soft polyester yarn",
    image: whiteBearPink,
  },
  {
    name: "Plushie Crochet",
    size: "4 inches up to any size",
    price: "₹340 per inch",
    note: "Any design — send me a reference photo",
    image: panda,
  },
  {
    name: "Charms & Keychains",
    size: "2 – 3 inches",
    price: "₹700 each",
    note: "Perfect for bag charms and party favours",
    badge: "🎁 Great gift",
    image: bearKeychain,
  },
];

/* Gallery of all character/plushie products */
const GALLERY = [
  { src: whiteBearPink, alt: "White bear pink overalls" },
  { src: whiteBearRed, alt: "White bear red overalls" },
  { src: panda, alt: "Panda plushie" },
  { src: penguin1, alt: "Penguin plushie" },
  { src: penguin2, alt: "Penguin pair" },
  { src: bearKeychain, alt: "Yellow bear keychain" },
  { src: bunnyKeychain, alt: "Bunny heart keychain" },
  { src: dinoKeychain, alt: "Green dino keychain" },
  { src: owlKeychain, alt: "Pink owl keychain" },
  { src: strawberryCow, alt: "Strawberry cow keychain" },
  { src: blackBear, alt: "Black bear keychain" },
  { src: catPlush, alt: "Category plush" },
];

import { useProducts } from "@/lib/cms-products";

function CharactersPage() {
  const { products } = useProducts();
  const cmsCharacters = products.filter((p) => p.type === "plushie" || p.type === "keychain");
  const displayItems =
    cmsCharacters.length > 0
      ? cmsCharacters.map((p) => ({
          name: p.name,
          size: p.size || "Custom amigurumi",
          price: p.sellingPrice || p.price,
          note: p.tagline || p.description,
          image: p.images[0] || whiteBearPink,
          badge: p.badge,
        }))
      : ITEMS;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricelist"
        title="Characters & plushies"
        description="For crochet pieces other than the human doll style — animals, mascots, characters, anything you can send me a photo of."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <PriceCard key={item.name} {...item} />
        ))}
      </div>

      {/* Sample Gallery */}
      <section className="aurora-rich border-y border-white/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-extrabold text-lilac-deep mb-2">
            Sample designs
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-8">
            All designs are customizable — send a reference photo and I'll make it yours.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {GALLERY.map((item) => (
              <div key={item.alt} className="liquid-glass img-hover-zoom overflow-hidden p-1.5 hover-lift">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="aspect-square w-full rounded-[1.2rem] object-cover"
                />
                <p className="relative z-10 mt-2 pb-1 text-center text-xs font-bold text-lilac-deep">
                  {item.alt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderCta
        title="Got a design in mind?"
        text="Send me a reference photo and I'll let you know if I can make it."
      />
    </SiteLayout>
  );
}
