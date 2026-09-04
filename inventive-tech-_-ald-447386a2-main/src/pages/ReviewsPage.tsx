import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Heart, Sparkles, Truck, Crown, ArrowRight, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";

const allTestimonials = [
  {
    handle: "@ananya_r",
    location: "Mumbai",
    text: "“The custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!”",
    rating: 5,
    item: "Custom Chibi Doll",
    category: "doll",
    tag: "Verified Commission",
    date: "2 weeks ago",
  },
  {
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "“The pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.”",
    rating: 5,
    item: "Signature Pastel Bouquet",
    category: "bouquet",
    tag: "Verified Commission",
    date: "1 month ago",
  },
  {
    handle: "@riya_s",
    location: "New Delhi",
    text: "“Such a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!”",
    rating: 5,
    item: "Velvet Cuddle Bear",
    category: "doll",
    tag: "Verified Commission",
    date: "3 weeks ago",
  },
  {
    handle: "@tanvi_p",
    location: "Hyderabad",
    text: "“Ordered the Mixed Rose Grand Bouquet for my mother's 50th birthday. She couldn't believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.”",
    rating: 5,
    item: "Mixed Rose Grand Atelier Bouquet",
    category: "bouquet",
    tag: "Verified Commission",
    date: "1 month ago",
  },
  {
    handle: "@meera_k",
    location: "Kolkata",
    text: "“The Strawberry Cow charm is literally the cutest thing ever. It hangs on my canvas tote bag and I get compliments almost every day! The gold hardware is also super sturdy.”",
    rating: 5,
    item: "Strawberry Milk Cow Charm",
    category: "keychain",
    tag: "Verified Commission",
    date: "2 months ago",
  },
  {
    handle: "@sneha_b",
    location: "Pune",
    text: "“Bought the Royal Peacock bookmark for my book club companion. The colors are so rich and vibrant, and the tail tassel adds the most regal touch. Highly recommended!”",
    rating: 5,
    item: "Royal Peacock Bookmark",
    category: "bookmark",
    tag: "Verified Commission",
    date: "2 months ago",
  },
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? allTestimonials
    : allTestimonials.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span>Patron Love & Stories</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
            Cherished with love, <span className="italic text-gradient">across India</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
            Read verified reviews and heartwarming unboxing stories from patrons who have gifted or collected our bespoke crochet pieces.
          </p>
        </section>

        {/* Trust Stats Bar */}
        <section className="mx-auto max-w-5xl px-6 mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "500+", label: "Bespoke Commissions" },
              { num: "4.9 ★", label: "Average Patron Rating" },
              { num: "100%", label: "Handcrafted Cotton Yarn" },
              { num: "Pan-India", label: "Wax-Seal Gift Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl glass-card p-6 text-center border border-purple-200/70 bg-white/80 shadow-sm">
                <span className="font-display text-3xl sm:text-4xl font-black text-purple-900">{stat.num}</span>
                <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filter Pills */}
        <section className="mx-auto max-w-6xl px-6 mt-16">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { id: "all", label: "All Reviews" },
              { id: "bouquet", label: "Forever Flowers" },
              { id: "doll", label: "Keepsake Dolls" },
              { id: "keychain", label: "Pocket Charms" },
              { id: "bookmark", label: "Bookmarks" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-all ${
                  filter === tab.id
                    ? "btn-royal shadow-sm"
                    : "border border-purple-200 bg-white/80 text-plum hover:border-purple-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((t) => (
              <article
                key={t.handle}
                className="rounded-[2.25rem] glass-card p-8 border border-purple-200/80 bg-white/90 shadow-soft hover:shadow-lift transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-sm text-plum/90 italic leading-relaxed">{t.text}</p>
                </div>

                <div className="mt-8 pt-5 border-t border-purple-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-plum">{t.handle}</p>
                    <p className="text-[11px] text-muted-foreground">{t.location} · {t.date}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200/60 max-w-[140px] truncate">
                    {t.item}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Custom Commission CTA */}
        <section className="mx-auto max-w-6xl px-6 mt-24">
          <div className="rounded-[2.5rem] glass-card p-10 sm:p-14 text-center border border-purple-200/80 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 shadow-soft">
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-plum">
              Have a special idea you'd like to <span className="italic text-gradient">commission?</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We work with you one-on-one to create bespoke dolls, custom anniversary bouquets, and personalized embroidered pieces.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/custom-orders" className="rounded-full btn-royal px-8 py-3.5 text-xs uppercase tracking-wider font-semibold shadow-md">
                Launch Custom Orders Studio
              </Link>
              <a
                href="https://wa.me/917892305330"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3.5 text-xs uppercase tracking-wider font-semibold text-emerald-800 hover:bg-emerald-100"
              >
                <MessageCircle size={14} className="text-emerald-600" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
