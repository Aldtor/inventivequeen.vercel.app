import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Heart, Sparkles, Crown, ArrowRight, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const allTestimonials = [
  {
    handle: "@ananya_r",
    location: "Mumbai",
    text: "\u201cThe custom anime doll turned out EXACTLY like my reference artwork! Every single detail of the hair and outfit was matched with mind-blowing precision. My friend was in tears!\u201d",
    rating: 5,
    item: "Custom Chibi Doll",
    category: "doll",
    tag: "Verified Commission",
    date: "2 weeks ago",
  },
  {
    handle: "@kavya_m",
    location: "Bengaluru",
    text: "\u201cThe pastel bouquet arrived gorgeously packaged with satin ribbons and wax seal. The flowers will stay vibrant forever! Best anniversary surprise ever.\u201d",
    rating: 5,
    item: "Signature Pastel Bouquet",
    category: "bouquet",
    tag: "Verified Commission",
    date: "1 month ago",
  },
  {
    handle: "@riya_s",
    location: "New Delhi",
    text: "\u201cSuch a sweet, accommodating artist! The purple teddy bear is velvety soft, squishy and the stitches are so tidy and uniform. Truly royal quality!\u201d",
    rating: 5,
    item: "Velvet Cuddle Bear",
    category: "doll",
    tag: "Verified Commission",
    date: "3 weeks ago",
  },
  {
    handle: "@tanvi_p",
    location: "Hyderabad",
    text: "\u201cOrdered the Mixed Rose Grand Bouquet for my mother\u2019s 50th birthday. She couldn\u2019t believe they were crocheted by hand! The stems are wired so they sit gracefully in any vase.\u201d",
    rating: 5,
    item: "Mixed Rose Grand Atelier Bouquet",
    category: "bouquet",
    tag: "Verified Commission",
    date: "1 month ago",
  },
  {
    handle: "@meera_k",
    location: "Kolkata",
    text: "\u201cThe Strawberry Cow charm is literally the cutest thing ever. It hangs on my canvas tote bag and I get compliments almost every day! The gold hardware is also super sturdy.\u201d",
    rating: 5,
    item: "Strawberry Milk Cow Charm",
    category: "keychain",
    tag: "Verified Commission",
    date: "2 months ago",
  },
  {
    handle: "@sneha_b",
    location: "Pune",
    text: "\u201cBought the Royal Peacock bookmark for my book club companion. The colors are so rich and vibrant, and the tail tassel adds the most regal touch. Highly recommended!\u201d",
    rating: 5,
    item: "Royal Peacock Bookmark",
    category: "bookmark",
    tag: "Verified Commission",
    date: "2 months ago",
  },
];

/* ── Animated Number Counter ── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-3xl glass-card p-6 text-center border border-purple-200/70 bg-white/80 shadow-sm card-hover-glow"
    >
      <span
        className={`font-display text-3xl sm:text-4xl font-black text-purple-900 inline-block ${
          visible ? "animate-count-reveal" : "opacity-0"
        }`}
      >
        {value}
      </span>
      <p className="mt-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? allTestimonials
    : allTestimonials.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Decorative Floating Orbs */}
        <div className="decorative-orb w-72 h-72 bg-purple-400/25 -top-20 -right-24" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-56 h-56 bg-pink-300/20 top-1/3 -left-20" style={{ animationDelay: "3s" }} />

        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Patron Love & Stories</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
              Cherished with love, <span className="italic text-gradient">across India</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
              Read verified reviews and heartwarming unboxing stories from patrons who have gifted or collected our bespoke crochet pieces.
            </p>
          </FadeIn>
        </section>

        {/* Trust Stats Bar — Animated */}
        <section className="mx-auto max-w-5xl px-6 mt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedStat value="500+" label="Bespoke Commissions" />
            <AnimatedStat value="4.9 ★" label="Average Patron Rating" />
            <AnimatedStat value="100%" label="Handcrafted Cotton Yarn" />
            <AnimatedStat value="Pan-India" label="Wax-Seal Gift Delivery" />
          </div>
        </section>

        {/* Filter Pills — Animated */}
        <FadeIn delay={0.15}>
          <section className="mx-auto max-w-6xl px-6 mt-16">
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {[
                { id: "all", label: "All Reviews", emoji: "✨" },
                { id: "bouquet", label: "Forever Flowers", emoji: "🌸" },
                { id: "doll", label: "Keepsake Dolls", emoji: "🧸" },
                { id: "keychain", label: "Pocket Charms", emoji: "🔑" },
                { id: "bookmark", label: "Bookmarks", emoji: "📖" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                    filter === tab.id
                      ? "btn-royal shadow-md scale-105"
                      : "border border-purple-200 bg-white/80 text-plum hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="text-sm">{tab.emoji}</span>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Testimonial Cards — Staggered */}
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
              {filtered.map((t) => (
                <StaggerItem key={t.handle}>
                  <article
                    className="rounded-[2.25rem] glass-card p-8 border border-purple-200/80 bg-white/90 shadow-sm card-hover-glow flex flex-col justify-between relative quote-decoration"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-1">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <ShieldCheck size={10} className="text-emerald-500" />
                          {t.tag}
                        </span>
                      </div>
                      <p className="text-sm text-plum/90 italic leading-relaxed relative z-10">{t.text}</p>
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
                </StaggerItem>
              ))}
            </StaggerChildren>
          </section>
        </FadeIn>

        {/* Custom Commission CTA — Upgraded */}
        <FadeIn delay={0.1}>
          <section className="mx-auto max-w-6xl px-6 mt-24">
            <div className="rounded-[2.5rem] p-10 sm:p-14 text-center border border-purple-200/80 bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 shadow-lift relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 left-1/3 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

              {/* Sparkles */}
              <div className="sparkle-particle top-6 right-1/4" style={{ animationDelay: "0s" }} />
              <div className="sparkle-particle top-12 left-1/4" style={{ animationDelay: "1.5s" }} />

              <div className="relative z-10">
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  Have a special idea you'd like to <span className="italic">commission?</span>
                </h2>
                <p className="mt-3 text-sm text-purple-200 max-w-lg mx-auto leading-relaxed">
                  We work with you one-on-one to create bespoke dolls, custom anniversary bouquets, and personalized embroidered pieces.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <Link to="/custom-orders" className="rounded-full bg-white text-purple-950 hover:bg-purple-50 px-8 py-3.5 text-xs uppercase tracking-wider font-bold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-600" />
                    Launch Custom Orders Studio
                  </Link>
                  <a
                    href="https://wa.me/917892305330"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-purple-900/40 hover:bg-purple-900/70 px-6 py-3.5 text-xs uppercase tracking-wider font-bold text-white transition-all hover:-translate-y-0.5"
                  >
                    <MessageCircle size={14} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
