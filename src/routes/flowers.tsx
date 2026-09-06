import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
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
        eyebrow="Pricelist"
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
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="liquid-glass mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-lilac/30 text-lilac-deep">
            <Sparkles className="size-8 text-lilac-deep" />
          </div>
          <h2 className="font-display text-2xl font-bold text-lilac-deep">Everlasting Flowers Coming Soon</h2>
          <p className="mt-3 text-muted-foreground">
            Our atelier is crafting vibrant new everlasting bouquet arrangements. You can also customize your own bouquet colorway via WhatsApp!
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I'd%20like%20to%20order%20a%20custom%20crochet%20bouquet."
              target="_blank"
              rel="noopener noreferrer"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
            >
              Customize Bouquet on WhatsApp →
            </a>
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
