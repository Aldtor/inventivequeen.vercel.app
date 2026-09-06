import { createFileRoute } from "@tanstack/react-router";
import { Flower2, Sparkles } from "lucide-react";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import flowersEmpty from "@/assets/flowers-empty.jpg";
import { useProducts } from "@/lib/cms-products";

export const Route = createFileRoute("/flowers")({
  component: FlowersPage,
  head: () => ({
    meta: [
      { title: "Crochet Flower Pricelist — Inventive Queen" },
      {
        name: "description",
        content:
          "Handmade crochet flowers and bouquets by Inventive Queen — tulips, roses, daisies and lavender that never wilt, wrapped with ribbon.",
      },
      { property: "og:title", content: "Crochet Flowers — Inventive Queen" },
      {
        property: "og:description",
        content: "Everlasting crochet bouquets: tulips, roses, daisies and lavender.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/flowers" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/flowers" }],
  }),
});

function FlowersPage() {
  const { products } = useProducts();
  const cmsFlowers = products.filter((p) => p.type === "bouquet");
  const displayFlowers = cmsFlowers.map((p) => ({
    id: p.id,
    name: p.name,
    size: p.size || "Hand-tied stem / wrap",
    price: p.sellingPrice || p.price,
    note: p.tagline || p.description,
    image: p.images[0] || bouquetRose,
    ...(p.badge ? { badge: p.badge } : {}),
  }));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Everlasting Floral Collection"
        icon={<Flower2 className="size-3.5 text-pink-500 fill-pink-200" />}
        title="Crochet flowers"
        description="All prices include basic wrapping and ribbon. Want a flower that isn't listed? Send a photo and I'll see if I can make it."
      />
      {displayFlowers.length > 0 ? (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {displayFlowers.map((flower) => (
            <PriceCard key={flower.id || flower.name} {...flower} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="liquid-glass relative mx-auto mb-8 max-w-md overflow-hidden rounded-3xl p-6 shadow-xl border border-white/80">
            <div className="relative mx-auto mb-5 size-48 sm:size-56 overflow-hidden rounded-2xl shadow-lg ring-4 ring-lilac/30">
              <img
                src={flowersEmpty}
                alt="Handcrafted crochet everlasting bouquet"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-lilac-deep shadow-sm flex items-center gap-1">
                <Flower2 className="size-3 text-pink-500 fill-pink-200" />
                <span>Never Wilts</span>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              Everlasting Flowers Coming Soon
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Our atelier is crafting vibrant new everlasting bouquet arrangements with satin ribbons and wrapping. You can also customize your own bouquet colorway via WhatsApp!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I'd%20like%20to%20order%20a%20custom%20crochet%20bouquet."
                target="_blank"
                rel="noopener noreferrer"
                className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm shadow-md"
              >
                Customize Bouquet on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}

      <OrderCta
        title="Build your own bouquet"
        text="Tell me the flowers and colours you want and I'll wrap them up for you."
      />
    </SiteLayout>
  );
}
