import { createFileRoute } from "@tanstack/react-router";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";

/* Real product images */
import dollsImg from "@/assets/dolls.jpg";
import minisImg from "@/assets/minis.jpg";
import catKeepsakeDolls from "@/assets/products/categories/cat-keepsake-dolls.jpg";
import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import owlKeychain from "@/assets/products/keychains/product-pink-owl-keychain.png";

export const Route = createFileRoute("/dolls")({
  component: DollsPage,
  head: () => ({
    meta: [
      { title: "Crochet Doll Pricelist — Inventive Queen" },
      {
        name: "description",
        content:
          "Pricelist for handmade crochet dolls by Inventive Queen: mini, regular, seated and chunky amigurumi dolls, all customizable.",
      },
      { property: "og:title", content: "Crochet Doll Pricelist — Inventive Queen" },
      {
        property: "og:description",
        content: "Mini, regular, seated and chunky handmade crochet dolls made to order.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/dolls" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/dolls" }],
  }),
});

const DOLLS = [
  {
    id: "regular-doll",
    name: "Regular Doll",
    size: "Small 7in · Medium 9in · Large 11in",
    price: "₹2,400 – ₹3,600",
    note: "Bigger sizes priced per inch",
    image: catKeepsakeDolls,
  },
  {
    id: "mini-regular-doll",
    name: "Mini Regular Doll",
    size: "5 inches · 12.7 cm",
    price: "₹1,600 each",
    image: dollsImg,
  },
  {
    id: "mini-doll",
    name: "Mini Doll",
    size: "3.5 – 4 inches (depends on design)",
    price: "₹1,600 each",
    badge: "Bestseller",
    image: minisImg,
  },
  {
    id: "seated-doll",
    name: "Seated Doll",
    size: "5 inches · approx. 16 cm",
    price: "₹1,600 each",
    image: whiteBearPink,
  },
  {
    id: "bear-keychain",
    name: "Keychain Doll",
    size: "3 inches with clasp",
    price: "₹900 each",
    image: bearKeychain,
  },
  {
    id: "chunky-doll",
    name: "Chunky Doll",
    size: "12 inches",
    price: "₹3,600",
    image: owlKeychain,
  },
];

/* Gallery of past work */
const GALLERY = [catKeepsakeDolls, dollsImg, minisImg, whiteBearPink, bearKeychain, owlKeychain];

import { useProducts } from "@/lib/cms-products";

function DollsPage() {
  const { products } = useProducts();
  const cmsDolls = products.filter((p) => p.type === "doll");
  const displayDolls =
    cmsDolls.length > 0
      ? cmsDolls.map((p) => ({
          id: p.id,
          name: p.name,
          size: p.size || "Custom amigurumi",
          price: p.sellingPrice || p.price,
          note: p.tagline || p.description,
          image: p.images[0] || dollsImg,
          ...(p.badge ? { badge: p.badge } : {}),
        }))
      : DOLLS;

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricelist"
        title="Crochet dolls"
        description="These are sample designs — all are customizable. Highly detailed dolls may need a small extra fee, just message me."
      />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {displayDolls.map((doll) => (
          <PriceCard key={doll.name} {...doll} />
        ))}
      </div>

      {/* Sample Gallery */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-center text-2xl font-extrabold text-lilac-deep mb-8">
          More sample designs
        </h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {GALLERY.map((src, i) => (
            <div key={i} className="clay-soft img-hover-zoom overflow-hidden rounded-2xl p-1">
              <img
                src={src}
                alt={`Sample doll design ${i + 1}`}
                width={200}
                height={200}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <OrderCta
        title="Want a doll of someone special?"
        text="Send me a reference photo and I'll let you know if I can make it."
      />
    </SiteLayout>
  );
}
