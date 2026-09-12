import { createFileRoute } from "@tanstack/react-router";
import { Heart, Instagram, Sparkles } from "lucide-react";

import {
  INSTAGRAM_URL,
  OrderCta,
  PageHeader,
  PriceCard,
  SiteLayout,
} from "@/components/site/SiteLayout";
import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import catPlush from "@/assets/products/categories/cat-plush.jpg";
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
        eyebrow="Custom Plushies & Mascots"
        icon={<Heart className="size-3.5 text-rose-500 fill-rose-200" />}
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
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="liquid-glass relative mx-auto mb-8 max-w-md overflow-hidden rounded-3xl p-6 shadow-xl border border-white/80">
            <div className="relative mx-auto mb-5 size-48 sm:size-56 overflow-hidden rounded-2xl shadow-lg ring-4 ring-lilac/30">
              <img
                src={catPlush}
                alt="Handcrafted crochet plushies and mascots"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-lilac-deep shadow-sm flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500 fill-amber-300" />
                <span>Custom Mascot</span>
              </div>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-lilac-deep">
              Plushies & Characters Coming Soon
            </h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Our atelier is crafting custom amigurumi animals, cute mascots, and character
              plushies. You can also request a completely bespoke design via Instagram!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-sm shadow-md"
              >
                <Instagram className="size-4" />
                Order Custom Plushie on Instagram →
              </a>
            </div>
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
