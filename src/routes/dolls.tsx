import { createFileRoute } from "@tanstack/react-router";
import { Crown, Instagram, Sparkles } from "lucide-react";

import {
  INSTAGRAM_URL,
  OrderCta,
  PageHeader,
  PriceCard,
  SiteLayout,
} from "@/components/site/SiteLayout";
import dollsImg from "@/assets/dolls.jpg";
import dollEmpty from "@/assets/doll-empty.jpg";
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
        eyebrow="Royal Collection · Dolls Pricelist"
        icon={<Crown className="size-3.5 text-amber-500 fill-amber-300" />}
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
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="liquid-glass relative mx-auto mb-8 max-w-md overflow-hidden rounded-3xl p-6 shadow-xl border border-white/80">
            <div className="relative mx-auto mb-5 size-48 sm:size-56 overflow-hidden rounded-2xl shadow-lg ring-4 ring-lilac/30">
              <img
                src={dollEmpty}
                alt="Handcrafted crochet princess doll atelier"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-lilac-deep shadow-sm flex items-center gap-1">
                <Crown className="size-3 text-amber-500 fill-amber-300" />
                <span>In Atelier</span>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              Artisanal Dolls Coming Soon
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Our atelier is currently hand-crafting bespoke amigurumi doll designs with soft milk
              cotton yarn. You can also request a custom doll made from your reference photo via
              Instagram!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm shadow-md"
              >
                <Instagram className="size-4" />
                Order Custom Doll on Instagram →
              </a>
            </div>
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
