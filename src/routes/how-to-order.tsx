import { Link, createFileRoute } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

import { INSTAGRAM_URL, PageHeader, SiteLayout } from "@/components/site/SiteLayout";

/* Visual decorations */
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import whiteBear from "@/assets/products/plushies/product-white-bear-pink-overalls.png";

export const Route = createFileRoute("/how-to-order")({
  component: HowToOrderPage,
  head: () => ({
    meta: [
      { title: "How to Order — Inventive Queen" },
      {
        name: "description",
        content:
          "The full ordering process at Inventive Queen: pick a design from the pricelist, send a reference photo, then confirm details and shipping.",
      },
      { property: "og:title", content: "How to Order — Inventive Queen" },
      {
        property: "og:description",
        content: "Three simple steps from picking a design to getting your parcel on its way.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/how-to-order" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/how-to-order" }],
  }),
});

const STEPS = [
  {
    title: "Check the pricelist",
    text: "For dolls, pick the variation you want (mini, regular, seated, chunky). For flowers, choose from the list — if it isn't there, send a photo and I'll see if I can make it. For animals and characters, send a reference picture.",
    icon: "📋",
    image: bouquetRose,
  },
  {
    title: "Send me a message",
    text: "Message me with a reference picture of what you'd like made. We'll discuss quantity, design details and the deadline for your order.",
    icon: "💬",
    image: bearKeychain,
  },
  {
    title: "Confirm and pay",
    text: "Once we've agreed on everything, you'll fill in the order form I send you. It covers shipping information and payment details.",
    icon: "✅",
    image: whiteBear,
  },
];

function HowToOrderPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="How to order"
        title="Ordering is easy"
        description="Here's the whole process, from picking a design to getting your parcel on its way."
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Status badge */}
        <div className="liquid-glass p-6 text-center pulse-soft">
          <h2 className="font-display text-lg font-bold text-lilac-deep">
            🟢 Custom orders are currently OPEN!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Now taking custom plushies, character dolls and crochet bouquet orders.
          </p>
        </div>

        {/* Steps */}
        <ol className="mt-12 space-y-6">
          {STEPS.map((step, i) => (
            <li key={step.title} className="skeu-card p-6">
              <div className="relative z-10 flex items-start gap-5">
                {/* Thumbnail */}
                <img
                  src={step.image}
                  alt=""
                  className="hidden sm:block size-20 flex-shrink-0 rounded-xl object-cover shadow-md"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="skeu-step">
                      {i + 1}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-lilac-deep">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <div className="mt-14 text-center">
          <h2 className="sheen-text text-3xl font-extrabold">Message me to start</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold"
            >
              <Instagram className="size-4" /> Order on Instagram
            </a>
            <Link
              to="/dolls"
              className="clay inline-flex items-center rounded-full px-6 py-3 font-bold text-lilac-deep"
            >
              Doll pricelist
            </Link>
            <Link
              to="/flowers"
              className="clay inline-flex items-center rounded-full px-6 py-3 font-bold text-lilac-deep"
            >
              Flower pricelist
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
