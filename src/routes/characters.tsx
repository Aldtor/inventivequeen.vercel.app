import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { OrderCta, PageHeader, PriceCard, SiteLayout } from "@/components/site/SiteLayout";
import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import { useProducts } from "@/lib/cms-products";

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

function CharactersPage() {
  const { products } = useProducts();
  const cmsCharacters = products.filter((p) => p.type === "plushie" || p.type === "keychain");
  const displayItems = cmsCharacters.map((p) => ({
    id: p.id,
    name: p.name,
    size: p.size || "Custom amigurumi",
    price: p.sellingPrice || p.price,
    note: p.tagline || p.description,
    image: p.images[0] || whiteBearPink,
    ...(p.badge ? { badge: p.badge } : {}),
  }));

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Pricelist"
        title="Characters & plushies"
        description="For crochet pieces other than the human doll style — animals, mascots, characters, anything you can send me a photo of."
      />
      {displayItems.length > 0 ? (
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => (
            <PriceCard key={item.id || item.name} {...item} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="liquid-glass mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-lilac/30 text-lilac-deep">
            <Sparkles className="size-8 text-lilac-deep" />
          </div>
          <h2 className="font-display text-2xl font-bold text-lilac-deep">Plushies & Characters Coming Soon</h2>
          <p className="mt-3 text-muted-foreground">
            Our atelier is crafting custom amigurumi animals, mascots, and character plushies. You can also request a custom design via WhatsApp!
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="https://wa.me/919876543210?text=Hello%20Inventive%20Queen!%20I'd%20like%20to%20order%20a%20custom%20crochet%20character%20or%20plushie."
              target="_blank"
              rel="noopener noreferrer"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold"
            >
              Order Custom Plushie on WhatsApp →
            </a>
          </div>
        </div>
      )}

      <OrderCta
        title="Got a design in mind?"
        text="Send me a reference photo and I'll let you know if I can make it."
      />
    </SiteLayout>
  );
}
