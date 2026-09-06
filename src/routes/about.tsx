import { createFileRoute } from "@tanstack/react-router";
import { Heart, Palette, Sparkles, Truck } from "lucide-react";

import { SiteLayout, PageHeader, OrderCta } from "@/components/site/SiteLayout";
import logo from "@/assets/logo.png";

/* Real product images for visual storytelling */
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bouquetMixed from "@/assets/products/bouquets/product-bouquet-mixed-1.png";
import whiteBear from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import bookmark from "@/assets/products/misc/product-peacock-bookmark-real.png";
import penguin from "@/assets/products/plushies/product-penguin-1.jpeg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Inventive Queen" },
      {
        name: "description",
        content:
          "Meet the maker behind Inventive Queen. Handmade crochet dolls, plushies and flowers, stitched with love and made to order.",
      },
      { property: "og:title", content: "About — Inventive Queen" },
      {
        property: "og:description",
        content: "The story behind Inventive Queen's handmade amigurumi and crochet bouquets.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const VALUES = [
  {
    icon: Palette,
    title: "Fully Custom",
    text: "Every piece starts with your reference photo, colour preference and little details that make it yours.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    text: "Stitch by stitch, using soft plush and milk cotton yarn for a huggable finish.",
  },
  {
    icon: Sparkles,
    title: "Unique Keepsakes",
    text: "No two orders are exactly alike — each doll, plushie and bouquet is a one-of-a-kind gift.",
  },
  {
    icon: Truck,
    title: "Shipped Nationwide",
    text: "Carefully packed and sent across the country so your order arrives safe and sound.",
  },
];

const SHOWCASE = [
  { src: bouquetRose, alt: "Rose bouquet" },
  { src: whiteBear, alt: "Bear plushie" },
  { src: bearKeychain, alt: "Bear keychain" },
  { src: bouquetMixed, alt: "Mixed bouquet" },
  { src: bookmark, alt: "Peacock bookmark" },
  { src: penguin, alt: "Penguin plushie" },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About"
        title="Hi, I'm the Inventive Queen"
        description="I turn yarn into tiny companions and everlasting bouquets — each one handmade to order."
      />

      {/* Story section */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="liquid-glass p-3">
            <img
              src={logo}
              alt="Inventive Queen crochet brand illustration"
              width={900}
              height={900}
              className="aspect-square w-full rounded-3xl object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Inventive Queen started with a love for crochet and a belief that the best gifts are
              the ones made just for you. What began as a hobby quickly turned into a small shop
              creating custom amigurumi dolls, plushies and crochet flowers for people who want
              something truly personal.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether it is a miniature version of a loved one, a favourite character, or a bouquet
              that never wilts, every piece is planned, stitched and finished by hand. I work
              closely with each customer to make sure the colours, pose and tiny details feel right.
            </p>
            <p className="text-lg text-muted-foreground">
              Thank you for supporting handmade — it means the world. 💜
            </p>
          </div>
        </div>
      </section>

      {/* Product showcase strip */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase mb-6">
          <Sparkles className="inline size-3 mr-1" /> Some of my favourites
        </p>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {SHOWCASE.map((item) => (
            <div
              key={item.alt}
              className="clay-soft img-hover-zoom overflow-hidden rounded-2xl p-1"
            >
              <img
                src={item.src}
                alt={item.alt}
                width={200}
                height={200}
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Values section */}
      <section className="aurora-rich border-y border-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Why handmade
          </p>
          <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
            What makes Inventive Queen special
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((item) => (
              <div key={item.title} className="liquid-glass hover-lift p-6">
                <span className="clay-primary inline-flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderCta
        title="Have an idea in mind?"
        text="Send me a reference photo and let's create something special together."
      />
    </SiteLayout>
  );
}
