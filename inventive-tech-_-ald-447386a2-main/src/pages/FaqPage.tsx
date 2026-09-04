import { useState, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Crown, Search, ChevronDown, MessageCircle, ArrowRight, HelpCircle, Sparkles, Palette, Truck, Droplets, CreditCard } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

const categoryIcons: Record<string, { icon: typeof Palette; emoji: string }> = {
  "Custom Commissions": { icon: Palette, emoji: "🎨" },
  "Shipping & Delivery": { icon: Truck, emoji: "📦" },
  "Materials & Care": { icon: Droplets, emoji: "🧶" },
  Payments: { icon: CreditCard, emoji: "💳" },
};

const faqData = [
  {
    category: "Custom Commissions",
    q: "How long does a bespoke custom order take to make?",
    a: "Most custom commissions take 3 to 5 business days to handcraft in our atelier depending on complexity. As soon as you place your order or send references, we confirm your exact dispatch date.",
  },
  {
    category: "Custom Commissions",
    q: "Can I send my own photos from Pinterest or anime character art?",
    a: "Yes! That is the heart of our atelier. You can share screenshots, drawings, or real photos. We customize hair, outfits, colors, and facial expressions to match your vision.",
  },
  {
    category: "Custom Commissions",
    q: "Can you embroider initials, dates, or names onto the pieces?",
    a: "Absolutely. We offer hand-embroidered names on amigurumi ears, ribbon tags, baby bootie cuffs, and bouquet wrap bands. Just mention it in the custom notes or on WhatsApp.",
  },
  {
    category: "Shipping & Delivery",
    q: "Do you ship all across India?",
    a: "Yes! We provide insured courier delivery to all pin codes across India via leading express courier partners (Bluedart, Delhivery, DTDC). Delivery typically takes 2–4 days after dispatch.",
  },
  {
    category: "Shipping & Delivery",
    q: "How is the piece packaged? Will flower bouquets get crushed?",
    a: "Every piece is placed inside a sturdy protective gift box with bubble cushioning and moisture barriers. Bouquets have wired stems and support cradles so they arrive in perfect floral shape.",
  },
  {
    category: "Materials & Care",
    q: "What yarn do you use? Is it safe for babies and children?",
    a: "We exclusively use 100% hypoallergenic milk-cotton yarn and Oeko-Tex certified cotton threads. It is non-toxic, gentle on delicate skin, lint-free, and dust-resistant.",
  },
  {
    category: "Materials & Care",
    q: "How do I clean and dust my crochet keepsakes?",
    a: "For flowers, gently blow away dust using a cool setting on a hair dryer or brush with a soft brush. For plushies, gently hand-wash in cool water with mild soap and lay flat on a towel to air dry.",
  },
  {
    category: "Payments",
    q: "What payment methods do you accept?",
    a: "We accept all UPI apps (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Wallets through secure Razorpay encryption on our website.",
  },
];

const allCategories = ["All", ...Array.from(new Set(faqData.map((f) => f.category)))];

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    let items = faqData;

    if (activeCategory !== "All") {
      items = items.filter((f) => f.category === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
      );
    }

    return items;
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-transparent text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Decorative Floating Orbs */}
        <div className="decorative-orb w-72 h-72 bg-purple-400/30 -top-20 -right-24" style={{ animationDelay: "0s" }} />
        <div className="decorative-orb w-56 h-56 bg-pink-300/20 top-1/3 -left-20" style={{ animationDelay: "3s" }} />
        <div className="decorative-orb w-48 h-48 bg-amber-200/20 bottom-40 right-10" style={{ animationDelay: "6s" }} />

        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
              <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
              <span>Help & Answers</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
              Frequently Asked <span className="italic text-gradient">Questions</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about commissioning custom pieces, yarn care, delivery times, and gift packaging.
            </p>
          </FadeIn>

          {/* FAQ Count Badge */}
          <FadeIn delay={0.25}>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-purple-100/80 px-3 py-1 text-[10px] uppercase tracking-wider text-purple-700 font-bold">
              <Sparkles size={11} className="text-amber-500" />
              <span>{faqData.length} questions answered</span>
            </div>
          </FadeIn>

          {/* Search Box */}
          <FadeIn delay={0.3}>
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-purple-600" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions or keywords..."
                  className="w-full rounded-full border border-purple-200 bg-white pl-11 pr-4 py-3.5 text-xs sm:text-sm text-plum placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-300 shadow-sm transition-all"
                />
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Category Filter Pills */}
        <FadeIn delay={0.35}>
          <section className="mx-auto max-w-5xl px-6 mt-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allCategories.map((cat) => {
                const meta = categoryIcons[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIdx(null);
                    }}
                    className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                      activeCategory === cat
                        ? "btn-royal shadow-md scale-105"
                        : "border border-purple-200 bg-white/80 text-plum hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {meta && <span className="text-sm">{meta.emoji}</span>}
                      <span>{cat}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* FAQ Accordion List */}
        <section className="mx-auto max-w-4xl px-6 mt-10">
          <StaggerChildren className="space-y-4">
            {filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              const catMeta = categoryIcons[item.category];
              return (
                <StaggerItem key={item.q}>
                  <div
                    className={`rounded-3xl glass-card border bg-white/90 overflow-hidden shadow-sm transition-all duration-300 card-hover-glow ${
                      isOpen ? "border-purple-300/90 shadow-md" : "border-purple-200/80"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-purple-700 font-bold">
                          {catMeta && <span className="text-sm">{catMeta.emoji}</span>}
                          {item.category}
                        </span>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-plum mt-1 group-hover:text-purple-800 transition-colors">
                          {item.q}
                        </h3>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen ? "bg-purple-600 text-white rotate-180" : "bg-purple-100 text-purple-700"
                      }`}>
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </button>

                    {/* Smooth Accordion Content */}
                    <div className={`accordion-expand ${isOpen ? "open" : ""}`}>
                      <div>
                        <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-purple-100 pt-4">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>

          {filtered.length === 0 && (
            <FadeIn>
              <div className="text-center py-16 glass-card rounded-3xl border border-purple-200/60 mt-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-plum font-semibold text-lg">No questions found matching "{query}"</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term or browse by category</p>
                <button
                  onClick={() => { setQuery(""); setActiveCategory("All"); }}
                  className="mt-4 text-xs uppercase tracking-wider font-bold text-purple-700 hover:text-purple-900 underline transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </FadeIn>
          )}
        </section>

        {/* WhatsApp Card — Upgraded */}
        <FadeIn delay={0.1}>
          <section className="mx-auto max-w-4xl px-6 mt-20">
            <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 p-8 sm:p-10 shadow-lift flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative overflow-hidden">
              {/* Decorative sparkles */}
              <div className="sparkle-particle top-6 right-10" style={{ animationDelay: "0s" }} />
              <div className="sparkle-particle top-12 right-24" style={{ animationDelay: "0.8s" }} />
              <div className="sparkle-particle bottom-8 left-16" style={{ animationDelay: "1.6s" }} />

              <div className="relative z-10">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">Still have questions?</h3>
                <p className="text-xs sm:text-sm text-purple-200 mt-1.5 leading-relaxed">
                  Chat directly with our artisan on WhatsApp for immediate help with sizing, colors, and turnaround.
                </p>
              </div>
              <a
                href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20have%20a%20question%20about%20your%20crochet%20pieces."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-800 hover:bg-emerald-50 px-6 py-3.5 text-xs uppercase tracking-wider font-bold whitespace-nowrap shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 relative z-10"
              >
                <MessageCircle size={15} className="text-emerald-600" />
                <span>WhatsApp Chat</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </section>
        </FadeIn>
      </main>

      {/* Global Luxury Atelier Footer */}
      <Footer />
    </div>
  );
}
