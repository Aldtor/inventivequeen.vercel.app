import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Crown, Heart, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Customer Reviews & Stories — Inventive Queen" },
      { name: "description", content: "Read real customer reviews and unboxing experiences for custom handmade crochet dolls and flowers." },
    ],
  }),
});

const TESTIMONIALS = [
  {
    handle: "@ananya_r",
    location: "Mumbai",
    text: "The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!",
    rating: 5,
    item: "Custom Chibi Doll",
    category: "doll",
    tag: "Verified Order",
    date: "2 weeks ago",
  },
  {
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.",
    rating: 5,
    item: "Signature Pastel Bouquet",
    category: "bouquet",
    tag: "Verified Order",
    date: "1 month ago",
  },
  {
    handle: "@riya_s",
    location: "New Delhi",
    text: "Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!",
    rating: 5,
    item: "Velvet Cuddle Bear",
    category: "plushie",
    tag: "Verified Order",
    date: "3 weeks ago",
  },
  {
    handle: "@tanvi_p",
    location: "Hyderabad",
    text: "Ordered the Mixed Rose Grand Bouquet for my mother's 50th birthday. She couldn't believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.",
    rating: 5,
    item: "Mixed Rose Grand Atelier Bouquet",
    category: "bouquet",
    tag: "Verified Order",
    date: "1 month ago",
  },
  {
    handle: "@meera_k",
    location: "Kolkata",
    text: "The Strawberry Cow charm is literally the cutest thing ever. It hangs on my canvas tote bag and I get compliments almost every day! The gold hardware is also super sturdy.",
    rating: 5,
    item: "Strawberry Milk Cow Charm",
    category: "keychain",
    tag: "Verified Order",
    date: "2 months ago",
  },
  {
    handle: "@sneha_b",
    location: "Pune",
    text: "Bought the Royal Peacock bookmark for my book club companion. The colors are so rich and vibrant, and the tail tassel adds the most regal touch. Highly recommended!",
    rating: 5,
    item: "Royal Peacock Bookmark",
    category: "misc",
    tag: "Verified Order",
    date: "2 months ago",
  },
  {
    handle: "@aarav_d",
    location: "Chennai",
    text: "Requested a couple doll set as a wedding gift. Alishba matched the sherwani and lehenga patterns down to the embroidery thread colors! Fast shipping and safe box packaging.",
    rating: 5,
    item: "Custom Wedding Dolls Set",
    category: "doll",
    tag: "Verified Order",
    date: "3 weeks ago",
  },
];

function ReviewsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.category === filter);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Patron Love"
        title="Cherished across India"
        description="Heartwarming unboxing reviews and feedback from collectors who have gifted or commissioned our bespoke crochet creations."
      />

      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Trust Stats Bar */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-12">
          <div className="liquid-glass p-5 text-center rounded-3xl border border-white/60">
            <span className="font-display text-3xl sm:text-4xl font-black text-lilac-deep">
              4.98 ★
            </span>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Average Rating
            </p>
          </div>
          <div className="liquid-glass p-5 text-center rounded-3xl border border-white/60">
            <span className="font-display text-3xl sm:text-4xl font-black text-lilac-deep">
              500+
            </span>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dolls &amp; Bouquets Made
            </p>
          </div>
          <div className="liquid-glass p-5 text-center rounded-3xl border border-white/60">
            <span className="font-display text-3xl sm:text-4xl font-black text-lilac-deep">
              100%
            </span>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hand-Crafted With Love
            </p>
          </div>
          <div className="liquid-glass p-5 text-center rounded-3xl border border-white/60">
            <span className="font-display text-3xl sm:text-4xl font-black text-lilac-deep">
              Pan-India
            </span>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Secure Delivery
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Stories" },
            { id: "doll", label: "Dolls" },
            { id: "bouquet", label: "Bouquets" },
            { id: "plushie", label: "Plushies" },
            { id: "keychain", label: "Keychains" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                filter === cat.id
                  ? "clay-primary liquid-btn text-white shadow-md"
                  : "clay text-muted-foreground hover:text-lilac-deep hover:bg-white/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, idx) => (
            <div
              key={idx}
              className="liquid-glass rounded-3xl p-6 border border-white/60 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {t.tag}
                  </span>
                </div>

                <p className="text-sm text-foreground leading-relaxed italic">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/50 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-lilac-deep">{t.handle}</span>
                  <p className="text-[11px] text-muted-foreground">{t.location} · {t.item}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="liquid-glass rounded-4xl p-10 max-w-2xl mx-auto border border-white/60 shadow-xl">
            <h3 className="font-display text-2xl font-extrabold text-lilac-deep">
              Want your own bespoke creation?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Add your favorite amigurumi or everlasting bouquet to your basket and experience royal craftsmanship.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/dolls"
                className="clay-primary liquid-btn rounded-full px-7 py-3 text-sm font-bold shadow-md"
              >
                Explore Pricelist
              </Link>
              <Link
                to="/checkout"
                className="clay rounded-full px-6 py-3 text-sm font-bold text-lilac-deep hover:bg-white/40"
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
