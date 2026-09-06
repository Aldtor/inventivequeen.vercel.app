import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";
import dollsImg from "@/assets/dolls.jpg";
import { useProducts } from "@/lib/cms-products";

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

function DollsPage() {
  const { products } = useProducts();
  const cmsDolls = products.filter((p) => p.type === "doll");
  const displayDolls = cmsDolls.map((p) => ({
    id: p.id,
    name: p.name,
    size: p.size || "Custom amigurumi",
    price: p.sellingPrice || p.price,
    note: p.tagline || p.description,
    image: p.images[0] || dollsImg,
    ...(p.badge ? { badge: p.badge } : {}),
  }));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricelist"
        title="Crochet dolls"
        description="These are sample designs — all are customizable. Highly detailed dolls may need a small extra fee, just message me."
      />
      {displayDolls.length > 0 ? (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {displayDolls.map((doll) => (
            <PriceCard key={doll.id || doll.name} {...doll} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="liquid-glass mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-lilac/30 text-lilac-deep">
            <Sparkles className="size-8 text-lilac-deep" />
          </div>
          <h2 className="font-display text-2xl font-bold text-lilac-deep">Artisanal Dolls Coming Soon</h2>
          <p className="mt-3 text-muted-foreground">
            Our atelier is currently hand-crafting bespoke amigurumi doll designs. You can also request a custom doll made from your reference photo!
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I'd%20like%20to%20order%20a%20custom%20crochet%20doll."
              target="_blank"
              rel="noopener noreferrer"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
            >
              Order Custom Doll on WhatsApp →
            </a>
          </div>
        </div>
      )}

      <OrderCta
        title="Want a doll of someone special?"
        text="Send me a reference photo and I'll let you know if I can make it."
      />
    </SiteLayout>
  );
}
