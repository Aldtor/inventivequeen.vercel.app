import { Link, createFileRoute } from "@tanstack/react-router";
import { Crown, Feather, Heart, Palette, Play, Quote, Sparkles, Star, Truck } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import logo from "@/assets/logo.png";

/* ─── Real product images ─── */
import dollsImg from "@/assets/dolls.jpg";
import plushiesImg from "@/assets/plushies.jpg";
import flowersImg from "@/assets/flowers.jpg";
import minisImg from "@/assets/minis.jpg";

/* Bouquets */
import bouquetRose from "@/assets/products/bouquets/product-bouquet-rose.png";
import bouquetPastel from "@/assets/products/bouquets/product-bouquet-pastel.png";
import bouquetMixed1 from "@/assets/products/bouquets/product-bouquet-mixed-1.png";
import bouquetMixed2 from "@/assets/products/bouquets/product-bouquet-mixed-2.png";
import bouquetLily from "@/assets/products/bouquets/product-bouquet-lily-2.png";
import bouquetSunflower from "@/assets/products/bouquets/product-bouquet-sunflower.jpg";
import bouquetGrand from "@/assets/products/bouquets/product-bouquet-grand.png";
import bouquetLilyVase from "@/assets/products/bouquets/product-bouquet-lily-vase.png";

/* Keychains */
import bearKeychain from "@/assets/products/keychains/product-yellow-bear-keychain.png";
import bunnyKeychain from "@/assets/products/keychains/product-bunny-heart-keychain.png";
import dinoKeychain from "@/assets/products/keychains/product-green-dino-keychain.png";
import owlKeychain from "@/assets/products/keychains/product-pink-owl-keychain.png";
import strawberryCow from "@/assets/products/keychains/product-strawberry-cow-keychain.png";
import blackBear from "@/assets/products/keychains/product-black-bear-keychain.png";

/* Plushies */
import whiteBearPink from "@/assets/products/plushies/product-white-bear-pink-overalls.png";
import whiteBearRed from "@/assets/products/plushies/product-white-bear-red-overalls.png";
import panda from "@/assets/products/plushies/product-panda.jpeg";
import penguin1 from "@/assets/products/plushies/product-penguin-1.jpeg";
import penguin2 from "@/assets/products/plushies/product-penguin-2.jpeg";

/* Misc */
import bookmark from "@/assets/products/misc/product-peacock-bookmark-real.png";

/* Categories */
import catKeepsakeDolls from "@/assets/products/categories/cat-keepsake-dolls.jpg";
import catForeverFlowers from "@/assets/products/categories/cat-forever-flowers.jpg";
import catPlush from "@/assets/products/categories/cat-plush.jpg";

/* Videos */
import videoBookmark from "@/assets/videos/video-bookmark.mp4";
import videoTeddy from "@/assets/videos/video-teddy-1.mp4";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Inventive Queen — Custom Crochet Dolls, Plushies & Flowers" },
      {
        name: "description",
        content:
          "Inventive Queen makes handmade crochet dolls, amigurumi plushies and flowers that never wilt. Fully customizable from your reference photo.",
      },
      { property: "og:title", content: "Inventive Queen — Handmade Crochet Dolls & Flowers" },
      {
        property: "og:description",
        content:
          "Custom amigurumi dolls, plushies and everlasting crochet bouquets, made to order.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const MARQUEE = [
  "100% Handmade Amigurumi",
  "Custom Crochet Dolls & Plushies",
  "Flowers That Never Wilt",
  "Shipped Nationwide",
  "Custom Colourways & Reference Photos",
  "Keychains & Keepsakes",
];

const CATEGORIES = [
  {
    to: "/dolls",
    title: "Crochet Dolls",
    text: "Mini, regular, seated and chunky dolls made from your reference photo.",
    image: catKeepsakeDolls,
    accent: "from-primary/20 to-lilac/10",
  },
  {
    to: "/characters",
    title: "Characters & Plushies",
    text: "Animals, mascots and any non-human design you can send a photo of.",
    image: catPlush,
    accent: "from-peach/20 to-primary/10",
  },
  {
    to: "/flowers",
    title: "Crochet Flowers",
    text: "Bouquets that keep their colour forever, from single stems to full wraps.",
    image: catForeverFlowers,
    accent: "from-rose/15 to-lilac/10",
  },
] as const;

const WHY = [
  {
    icon: Palette,
    title: "100% Customized",
    text: "Send reference photos of a favourite character, pet or loved one.",
  },
  {
    icon: Heart,
    title: "Everlasting Flowers",
    text: "Crochet bouquets that keep their colour forever with zero maintenance.",
  },
  {
    icon: Sparkles,
    title: "Handmade with Love",
    text: "Stitch by stitch, using soft plush and milk cotton yarn.",
  },
  {
    icon: Truck,
    title: "Careful Shipping",
    text: "Packed securely with cosy gift wrapping and delivered nationwide.",
  },
];

const HERO_THUMBNAILS = [
  { id: "rose-stem", src: bouquetRose, alt: "Rose bouquet" },
  { id: "bear-keychain", src: bearKeychain, alt: "Bear keychain" },
  { id: "white-bear-overalls", src: whiteBearPink, alt: "Bear plushie" },
  { id: "pastel-bouquet", src: bouquetPastel, alt: "Pastel bouquet" },
];

const CATALOGUE = [
  { id: "rose-stem", name: "Rose bouquet", image: bouquetRose },
  { id: "mixed-rose-grand-bouquet", name: "Mixed bouquet", image: bouquetMixed1 },
  { id: "pastel-bouquet", name: "Pastel bouquet", image: bouquetPastel },
  { id: "lily-vase-bouquet", name: "Lily bouquet", image: bouquetLily },
  { id: "bear-keychain", name: "Bear keychain", image: bearKeychain },
  { id: "bunny-heart-keychain", name: "Bunny keychain", image: bunnyKeychain },
  { id: "dino-keychain", name: "Dino keychain", image: dinoKeychain },
  { id: "owl-keychain", name: "Owl keychain", image: owlKeychain },
  { id: "strawberry-cow-keychain", name: "Strawberry cow", image: strawberryCow },
  { id: "black-bear", name: "Black bear keychain", image: blackBear },
  { id: "white-bear-overalls", name: "White bear plushie", image: whiteBearPink },
  { id: "peacock-bookmark", name: "Peacock bookmark", image: bookmark },
];

const INSTAGRAM_GALLERY = [
  { src: bouquetGrand, alt: "Grand bouquet" },
  { src: bouquetMixed2, alt: "Mixed arrangement" },
  { src: whiteBearRed, alt: "Bear in red overalls" },
  { src: panda, alt: "Panda plushie" },
  { src: penguin1, alt: "Penguin plushie" },
  { src: bouquetLilyVase, alt: "Lily vase bouquet" },
  { src: penguin2, alt: "Penguin pair" },
  { src: bouquetSunflower, alt: "Sunflower bouquet" },
];

const STATS = [
  { value: "500+", label: "Stitched pieces", isRating: false },
  { value: "100%", label: "Handmade", isRating: false },
  { value: "4.9", label: "Loved by buyers", isRating: true },
  { value: "Pan-India", label: "Shipping", isRating: false },
];

const LOVE = [
  {
    quote:
      "She turned my wedding photo into the cutest doll couple. Everyone at the party asked where I got it!",
    name: "Ananya R.",
    product: bouquetRose,
  },
  {
    quote:
      "My bouquet still looks brand new months later. Ordering was easy and the updates were so sweet.",
    name: "Meher K.",
    product: bouquetPastel,
  },
  {
    quote: "The mini keychain doll of my cat is unbelievably accurate. Already ordered two more.",
    name: "Ishita B.",
    product: bearKeychain,
  },
];

function Home() {
  return (
    <SiteLayout>
      {/* ═══════ HERO ═══════ */}
      <section className="aurora-rich sparkle-field dotted-bg relative overflow-hidden">
        <div
          className="blob pointer-events-none absolute -top-24 -left-24 size-80 bg-primary"
          aria-hidden
        />
        <div
          className="blob pointer-events-none absolute top-40 -right-20 size-96 bg-lilac"
          aria-hidden
        />
        <div
          className="blob pointer-events-none absolute bottom-10 left-1/3 size-60 bg-peach/40"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-lilac-deep uppercase">
              <Sparkles className="size-3.5" /> Handmade with love
            </span>
            <h1 className="sheen-text mt-6 text-5xl leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">
              Custom crochet dolls, plushies &amp; flowers
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Hi, I&apos;m the Inventive Queen! I make amigurumi dolls and crochet flowers that
              never wilt. Every piece is customizable — send me a reference and I&apos;ll bring it
              to life in yarn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/how-to-order"
                className="clay-primary liquid-btn rounded-full px-8 py-4 font-bold"
              >
                How to order →
              </Link>
              <Link to="/dolls" className="clay rounded-full px-8 py-4 font-bold text-lilac-deep">
                See pricelist
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="liquid-glass px-3 py-3 text-center rounded-2xl">
                  <p className="font-display text-2xl font-extrabold text-lilac-deep inline-flex items-center justify-center gap-0.5">
                    <span>{stat.value}</span>
                    {stat.isRating && (
                      <Star className="size-4 fill-amber-400 text-amber-400 inline" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div
              className="lilac-gradient absolute -inset-4 rounded-[3rem] opacity-40 blur-2xl"
              aria-hidden
            />
            <div className="liquid-glass float-slow relative rounded-4xl p-3">
              <img
                src={logo}
                alt="Inventive Queen crochet brand illustration"
                width={900}
                height={900}
                className="aspect-square w-full rounded-3xl object-cover"
              />
              <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2.5 rounded-full border border-white/90 bg-white/90 px-4 py-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lilac-deep/20">
                <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 shadow-sm">
                  <Crown className="size-3.5 text-amber-700" />
                </span>
                <span className="font-display text-xs sm:text-sm font-bold tracking-wide text-foreground">
                  Made just for you
                </span>
                <span
                  className="size-2 rounded-full bg-emerald-500 animate-pulse"
                  title="Custom orders open"
                />
              </div>
            </div>
            <div className="float-slower relative mt-8 grid grid-cols-4 gap-3">
              {HERO_THUMBNAILS.map((item) => (
                <Link
                  key={item.alt}
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  className="clay-soft img-hover-zoom overflow-hidden rounded-2xl p-1 block cursor-pointer transition-transform hover:scale-105"
                  title={`View ${item.alt}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={200}
                    height={200}
                    loading="lazy"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <div className="liquid-glass overflow-hidden border-x-0 py-3 rounded-none">
        <div className="marquee-track flex w-max gap-8 pr-8">
          {[...MARQUEE, ...MARQUEE].map((text, i) => (
            <span
              key={`${text}-${i}`}
              className="text-xs font-bold tracking-wide whitespace-nowrap text-lilac-deep uppercase inline-flex items-center gap-1.5"
            >
              <Crown className="size-3 text-amber-600" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════ CATEGORIES ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
          Shop
        </p>
        <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">What I make</h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Every category has its own pricelist page with sizes, prices and sample designs.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.to} to={cat.to} className="skeu-card group overflow-hidden">
              <div className="relative z-10 overflow-hidden p-2.5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  width={900}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-[1.4rem] object-cover shadow-lg transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {/* Hover shine */}
                <div className="absolute inset-2.5 rounded-[1.4rem] bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
              </div>
              <div className="relative z-10 space-y-2 px-6 pb-6">
                <h3 className="font-display text-xl font-bold text-lilac-deep">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.text}</p>
                <span className="inline-block pt-2 text-sm font-bold text-primary">
                  View pricelist →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ WHY SECTION ═══════ */}
      <section className="aurora-rich border-y border-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Crafted with love
          </p>
          <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
            Why order from Inventive Queen?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => (
              <div key={item.title} className="liquid-glass p-6 hover-lift">
                <span className="clay-primary relative z-10 inline-flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <h3 className="relative z-10 mt-4 font-display text-lg font-bold">{item.title}</h3>
                <p className="relative z-10 mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATALOGUE / PRODUCT SHOWCASE ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
          Catalogue
        </p>
        <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
          Designs I&apos;ve made
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          A peek at past orders — every design is customizable in your own colours.
        </p>
        <div className="mt-12 grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATALOGUE.map((item) => (
            <Link
              key={item.name}
              to="/product/$productId"
              params={{ productId: item.id }}
              className="clay-glow group overflow-hidden p-2 img-hover-zoom block transition-all hover:scale-102 hover:shadow-xl cursor-pointer"
            >
              <figure className="relative">
                <div className="overflow-hidden rounded-[1.4rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={900}
                    height={900}
                    loading="lazy"
                    className="relative z-10 aspect-square w-full rounded-[1.4rem] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <figcaption className="relative z-10 p-3 text-center text-sm font-bold text-lilac-deep group-hover:text-primary transition-colors flex items-center justify-center gap-1">
                  <span>{item.name}</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </figcaption>
              </figure>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/dolls"
            className="clay-primary liquid-btn inline-flex rounded-full px-7 py-3.5 font-bold"
          >
            Explore Complete Pricelist &amp; Order
          </Link>
        </div>
      </section>

      {/* ═══════ VIDEO SHOWCASE ═══════ */}
      <section className="aurora-rich border-y border-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
            <Play className="inline size-3 mr-1" /> Behind the scenes
          </p>
          <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
            Watch them come to life
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Every piece is handmade stitch by stitch. Here's a peek at the process.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="video-frame liquid-glass p-2">
              <video autoPlay loop muted playsInline className="aspect-video rounded-[1.5rem]">
                <source src={videoBookmark} type="video/mp4" />
              </video>
              <p className="relative z-10 mt-3 px-4 pb-3 text-center text-sm font-bold text-lilac-deep inline-flex items-center justify-center gap-1.5 w-full">
                <Feather className="size-4 text-emerald-600" />
                <span>Peacock Bookmark — Handmade</span>
              </p>
            </div>
            <div className="video-frame liquid-glass p-2">
              <video autoPlay loop muted playsInline className="aspect-video rounded-[1.5rem]">
                <source src={videoTeddy} type="video/mp4" />
              </video>
              <p className="relative z-10 mt-3 px-4 pb-3 text-center text-sm font-bold text-lilac-deep inline-flex items-center justify-center gap-1.5 w-full">
                <Heart className="size-4 text-rose-500 fill-rose-100" />
                <span>Teddy Bear — Stitched with Love</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CREATIONS GALLERY ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
          <Sparkles className="inline size-3 mr-1" /> Gallery
        </p>
        <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
          More handmade magic
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {INSTAGRAM_GALLERY.map((item) => (
            <Link
              key={item.alt}
              to="/dolls"
              className="liquid-glass img-hover-zoom group overflow-hidden p-1.5 hover-lift"
            >
              <img
                src={item.src}
                alt={item.alt}
                width={400}
                height={400}
                loading="lazy"
                className="aspect-square w-full rounded-[1.2rem] object-cover"
              />
              <div className="absolute inset-1.5 rounded-[1.2rem] bg-lilac-deep/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-white font-bold text-sm">Shop Creations →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="aurora-rich border-t border-white/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold tracking-[0.18em] text-primary uppercase">
            Kind words
          </p>
          <h2 className="mt-3 text-center text-4xl font-extrabold text-lilac-deep">
            Loved by little hearts
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {LOVE.map((item) => (
              <figure key={item.name} className="liquid-glass hover-lift p-7">
                <div className="relative z-10 flex items-start gap-4">
                  <img
                    src={item.product}
                    alt=""
                    className="size-14 rounded-xl object-cover shadow-md flex-shrink-0"
                  />
                  <Quote className="size-7 text-lilac flex-shrink-0 mt-1" />
                </div>
                <blockquote className="relative z-10 mt-4 text-sm leading-relaxed text-muted-foreground">
                  "{item.quote}"
                </blockquote>
                <figcaption className="relative z-10 mt-5 flex items-center justify-between">
                  <span className="font-display font-bold text-lilac-deep">{item.name}</span>
                  <span className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="lilac-gradient soft-glow sparkle-field relative overflow-hidden rounded-4xl px-6 py-16 text-center">
          <div
            className="blob pointer-events-none absolute -top-16 left-1/4 size-56 bg-card"
            aria-hidden
          />
          {/* Floating product decorations */}
          <img
            src={bouquetMixed1}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-4 size-32 rounded-2xl object-cover opacity-15 rotate-[10deg] blur-[1px]"
          />
          <img
            src={dinoKeychain}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -left-4 size-28 rounded-2xl object-cover opacity-15 rotate-[-8deg] blur-[1px]"
          />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">
              Ready for your one-of-a-kind piece?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
              Send a reference photo and I&apos;ll stitch it into something you&apos;ll keep
              forever.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/how-to-order"
                className="clay rounded-full px-8 py-4 font-bold text-lilac-deep"
              >
                Start my order →
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/60 bg-white/15 px-8 py-4 font-bold text-primary-foreground backdrop-blur transition-colors hover:bg-white/25"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
