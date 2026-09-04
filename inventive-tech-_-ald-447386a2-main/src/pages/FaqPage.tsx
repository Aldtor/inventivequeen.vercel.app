import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Crown, Search, ChevronDown, MessageCircle, ArrowRight, HelpCircle } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

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

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqData;
    return faqData.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#461c48] font-sans">
      <SiteHeader />

      <main className="relative overflow-x-hidden pb-24 pt-32 sm:pt-36">
        {/* Header */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.3em] text-purple-800 font-bold shadow-sm mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
            <span>Help & Answers</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium text-plum tracking-tight text-balance">
            Frequently Asked <span className="italic text-gradient">Questions</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-muted-foreground">
            Everything you need to know about commissioning custom pieces, yarn care, delivery times, and gift packaging.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions or keywords..."
                className="w-full rounded-full border border-purple-200 bg-white pl-11 pr-4 py-3 text-xs sm:text-sm text-plum placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400/30 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* FAQ Accordion List */}
        <section className="mx-auto max-w-4xl px-6 mt-16">
          <div className="space-y-4">
            {filtered.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-3xl glass-card border border-purple-200/80 bg-white/90 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold">
                        {item.category}
                      </span>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-plum mt-1">
                        {item.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-purple-700 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 sm:px-7 sm:pb-7 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-purple-100 pt-4">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-plum font-semibold">No questions found matching "{query}"</p>
              <button
                onClick={() => setQuery("")}
                className="mt-3 text-xs uppercase tracking-wider font-bold text-purple-700 underline"
              >
                Clear search
              </button>
            </div>
          )}
        </section>

        {/* WhatsApp Card */}
        <section className="mx-auto max-w-4xl px-6 mt-20">
          <div className="rounded-[2.5rem] glass-card p-8 sm:p-10 border border-purple-200/80 bg-white/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-plum">Still have questions?</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Chat directly with our artisan on WhatsApp for immediate help with sizing, colors, and turnaround.
              </p>
            </div>
            <a
              href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20have%20a%20question%20about%20your%20crochet%20pieces."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-xs uppercase tracking-wider font-bold text-emerald-800 hover:bg-emerald-100 whitespace-nowrap shadow-sm"
            >
              <MessageCircle size={15} className="text-emerald-600" />
              <span>WhatsApp +91 7892305330</span>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-200/60 py-12 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="font-display text-plum font-semibold text-base">Inventive Queen</span>
            <span className="text-[10px] uppercase tracking-wider text-purple-600 font-medium">Royal Crochet Atelier</span>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} Inventive Queen — Crocheted with love & care</p>
        </div>
      </footer>
    </div>
  );
}
