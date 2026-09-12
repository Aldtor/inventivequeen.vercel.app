import { Link, createFileRoute } from "@tanstack/react-router";
import { Crown, Feather, Heart, Instagram, Palette, Play, Quote, Sparkles, Star, Truck } from "lucide-react";

import { INSTAGRAM_URL, SiteLayout } from "@/components/site/SiteLayout";
import logo from "@/assets/logo.png";
import { useProducts } from "@/lib/cms-products";

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
    initials: "AR",
    city: "Mumbai",
  },
  {
    quote:
      "My bouquet still looks brand new months later. Ordering was easy and the updates were so sweet.",
    name: "Meher K.",
    initials: "MK",
    city: "Bengaluru",
  },
  {
    quote: "The mini keychain doll of my cat is unbelievably accurate. Already ordered two more.",
    name: "Ishita B.",
    initials: "IB",
    city: "New Delhi",
  },
];

function Home() {
  const { products } = useProducts();
  const heroThumbnails = products.slice(0, 4);

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
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 sm:gap-12 px-4 py-8 sm:py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3.5 py-1.5 sm:px-4.5 sm:py-2 text-[11px] sm:text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-md shadow-lilac/10 backdrop-blur-md transition-transform hover:scale-105">
              <span className="flex size-4 items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-primary text-white shadow-xs">
                <Heart className="size-2.5 fill-current" />
              </span>
              <span>Handmade with love</span>
              <Crown className="size-3 text-amber-500 fill-amber-300 ml-0.5" />
            </span>
            <h1 className="sheen-text mt-4 sm:mt-6 text-3xl sm:text-5xl lg:text-7xl leading-[1.08] sm:leading-[1.02] font-extrabold">
              Custom crochet dolls, plushies &amp; flowers
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-lg text-muted-foreground leading-relaxed">
              Hi, I&apos;m the Inventive Queen! I make amigurumi dolls and crochet flowers that
              never wilt. Every piece is customizable — send me a reference and I&apos;ll bring it
              to life in yarn.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-row flex-wrap gap-2.5 sm:gap-3">
              <Link
                to="/how-to-order"
                className="clay-primary liquid-btn flex-1 sm:flex-initial text-center rounded-full px-5 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-base shadow-md active:scale-95 transition-all"
              >
                How to order →
              </Link>
              <Link
                to="/dolls"
                className="clay flex-1 sm:flex-initial text-center rounded-full px-5 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-base text-lilac-deep hover:bg-white/40 active:scale-95 transition-all"
              >
                See pricelist
              </Link>
            </div>
            <div className="mt-8 sm:mt-10 grid max-w-md grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="liquid-glass px-2.5 py-2.5 sm:px-3 sm:py-3 text-center rounded-2xl shadow-xs">
                  <p className="font-display text-xl sm:text-2xl font-extrabold text-lilac-deep inline-flex items-center justify-center gap-0.5">
                    <span>{stat.value}</span>
                    {stat.isRating && (
                      <Star className="size-3.5 sm:size-4 fill-amber-400 text-amber-400 inline" />
                    )}
                  </p>
                  <p className="text-[10.5px] sm:text-xs text-muted-foreground mt-0.5">{stat.label}</p>
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
              <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5 z-20 flex items-center gap-2 sm:gap-2.5 rounded-full border border-white/90 bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lilac-deep/20">
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
            {heroThumbnails.length > 0 && (
              <div className="float-slower relative mt-8 grid grid-cols-4 gap-3">
                {heroThumbnails.map((item) => (
                  <Link
                    key={item.id}
                    to="/product/$productId"
                    params={{ productId: item.id }}
                    className="clay-soft img-hover-zoom overflow-hidden rounded-2xl p-1 block cursor-pointer transition-transform hover:scale-105"
                    title={`View ${item.name}`}
                  >
                    <img
                      src={item.images[0] || logo}
                      alt={item.name}
                      width={200}
                      height={200}
                      loading="lazy"
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </Link>
                ))}
              </div>
            )}
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
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-sm backdrop-blur-md">
            <Crown className="size-3.5 text-amber-500 fill-amber-300" />
            <span>Atelier Collections</span>
          </span>
        </div>
        <h2 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold text-lilac-deep">What I make</h2>
        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-center text-sm sm:text-base text-muted-foreground">
          Every category has its own pricelist page with sizes, prices and sample designs.
        </p>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.to} to={cat.to} className="skeu-card group overflow-hidden rounded-3xl">
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
              <div className="relative z-10 space-y-2 px-5 pb-5 sm:px-6 sm:pb-6">
                <h3 className="font-display text-lg sm:text-xl font-bold text-lilac-deep">{cat.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{cat.text}</p>
                <span className="inline-block pt-1 text-xs sm:text-sm font-bold text-primary">
                  View pricelist →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════ WHY SECTION ═══════ */}
      <section className="aurora-rich border-y border-white/50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-sm backdrop-blur-md">
              <Heart className="size-3.5 text-rose-500 fill-rose-200" />
              <span>Crafted with love</span>
            </span>
          </div>
          <h2 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold text-lilac-deep">
            Why order from Inventive Queen?
          </h2>
          <div className="mt-8 sm:mt-12 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item) => (
              <div key={item.title} className="liquid-glass p-5 sm:p-6 hover-lift rounded-3xl">
                <span className="clay-primary relative z-10 inline-flex size-11 sm:size-12 items-center justify-center rounded-2xl text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <h3 className="relative z-10 mt-3 sm:mt-4 font-display text-base sm:text-lg font-bold">{item.title}</h3>
                <p className="relative z-10 mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATALOGUE / PRODUCT SHOWCASE ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-sm backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-500 fill-amber-300" />
            <span>Handmade Catalogue</span>
          </span>
        </div>
        <h2 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold text-lilac-deep">
          Designs I&apos;ve made
        </h2>
        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-center text-sm sm:text-base text-muted-foreground">
          A peek at past orders — every design is customizable in your own colours.
        </p>
        {products.length > 0 ? (
          <>
            <div className="mt-8 sm:mt-12 grid gap-3.5 sm:gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {products.slice(0, 12).map((item) => (
                <Link
                  key={item.id}
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  className="clay-glow group overflow-hidden p-1.5 sm:p-2 img-hover-zoom block transition-all hover:scale-102 hover:shadow-xl cursor-pointer rounded-2xl sm:rounded-3xl"
                >
                  <figure className="relative">
                    <div className="overflow-hidden rounded-[1.2rem] sm:rounded-[1.4rem]">
                      <img
                        src={item.images[0] || logo}
                        alt={item.name}
                        width={900}
                        height={900}
                        loading="lazy"
                        className="relative z-10 aspect-square w-full rounded-[1.2rem] sm:rounded-[1.4rem] object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <figcaption className="relative z-10 p-2 sm:p-3 text-center text-xs sm:text-sm font-bold text-lilac-deep group-hover:text-primary transition-colors flex items-center justify-center gap-1 truncate">
                      <span className="truncate">{item.name}</span>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </figcaption>
                  </figure>
                </Link>
              ))}
            </div>
            <div className="mt-8 sm:mt-10 text-center">
              <Link
                to="/dolls"
                className="clay-primary liquid-btn inline-flex rounded-full px-6 py-3 sm:px-7 sm:py-3.5 font-bold text-xs sm:text-base shadow-md active:scale-95 transition-all"
              >
                Explore Complete Pricelist &amp; Order
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-8 sm:mt-12 liquid-glass max-w-2xl mx-auto p-6 sm:p-10 text-center rounded-3xl border border-white/80 shadow-xl">
            <div className="mx-auto mb-4 sm:mb-5 flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-100 to-amber-200 border border-amber-300/80 shadow-md">
              <Crown className="size-7 sm:size-8 text-amber-700" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-lilac-deep">
              Royal Atelier — New Creations Coming Soon
            </h3>
            <p className="mt-2 text-muted-foreground text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Our handcrafted catalogue is currently being prepared with fresh amigurumi dolls, plushies, and everlasting flowers.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-primary liquid-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold shadow-md"
              >
                <Instagram className="size-4" />
                Custom Inquiries on Instagram →
              </a>
              <Link
                to="/how-to-order"
                className="clay inline-flex items-center rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-lilac-deep hover:bg-white/40"
              >
                How To Order
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ═══════ VIDEO SHOWCASE ═══════ */}
      <section className="aurora-rich border-y border-white/50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-sm backdrop-blur-md">
              <Play className="size-3.5 text-primary fill-primary" />
              <span>Behind the scenes</span>
            </span>
          </div>
          <h2 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold text-lilac-deep">
            Watch them come to life
          </h2>
          <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-center text-sm sm:text-base text-muted-foreground">
            Every piece is handmade stitch by stitch. Here's a peek at the process.
          </p>
          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-2">
            <div className="video-frame liquid-glass p-2 rounded-3xl">
              <video autoPlay loop muted playsInline className="aspect-video rounded-[1.4rem]">
                <source src={videoBookmark} type="video/mp4" />
              </video>
              <p className="relative z-10 mt-2.5 px-3 pb-2 text-center text-xs sm:text-sm font-bold text-lilac-deep inline-flex items-center justify-center gap-1.5 w-full">
                <Feather className="size-3.5 text-emerald-600" />
                <span>Peacock Bookmark — Handmade</span>
              </p>
            </div>
            <div className="video-frame liquid-glass p-2 rounded-3xl">
              <video autoPlay loop muted playsInline className="aspect-video rounded-[1.4rem]">
                <source src={videoTeddy} type="video/mp4" />
              </video>
              <p className="relative z-10 mt-2.5 px-3 pb-2 text-center text-xs sm:text-sm font-bold text-lilac-deep inline-flex items-center justify-center gap-1.5 w-full">
                <Heart className="size-3.5 text-rose-500 fill-rose-100" />
                <span>Teddy Bear — Stitched with Love</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="aurora-rich border-t border-white/50 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-xs font-black tracking-[0.16em] sm:tracking-[0.18em] text-lilac-deep uppercase shadow-sm backdrop-blur-md">
              <Star className="size-3.5 text-amber-500 fill-amber-300" />
              <span>Patron Reviews</span>
            </span>
          </div>
          <h2 className="mt-3 text-center text-3xl sm:text-4xl font-extrabold text-lilac-deep">
            Loved by little hearts
          </h2>
          <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
            {LOVE.map((item) => (
              <figure key={item.name} className="liquid-glass hover-lift p-5 sm:p-7 flex flex-col justify-between rounded-3xl">
                <div>
                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-10 rounded-2xl bg-lilac/30 border border-lilac/50 flex items-center justify-center font-display font-bold text-lilac-deep text-xs shadow-xs">
                        {item.initials}
                      </div>
                      <div>
                        <p className="font-display font-bold text-lilac-deep text-xs sm:text-sm">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.city}</p>
                      </div>
                    </div>
                    <Quote className="size-5 text-lilac/70 flex-shrink-0" />
                  </div>
                  <blockquote className="relative z-10 mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    "{item.quote}"
                  </blockquote>
                </div>
                <div className="relative z-10 mt-4 flex items-center justify-end">
                  <span className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </span>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="lilac-gradient soft-glow sparkle-field relative overflow-hidden rounded-3xl sm:rounded-4xl px-5 py-12 sm:px-6 sm:py-16 text-center">
          <div
            className="blob pointer-events-none absolute -top-16 left-1/4 size-56 bg-card"
            aria-hidden
          />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground">
              Ready for your one-of-a-kind piece?
            </h2>
            <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-xs sm:text-base text-primary-foreground/90 leading-relaxed">
              Send a reference photo and I&apos;ll stitch it into something you&apos;ll keep
              forever.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
              <Link
                to="/how-to-order"
                className="clay rounded-full px-6 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-base text-lilac-deep shadow-md"
              >
                Start my order →
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/60 bg-white/15 px-6 py-3 sm:px-8 sm:py-4 font-bold text-xs sm:text-base text-primary-foreground backdrop-blur transition-colors hover:bg-white/25"
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
