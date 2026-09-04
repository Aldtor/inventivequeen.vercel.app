import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Instagram, MessageCircle, Lock, Crown, Sparkles, Heart, Send, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import ContactModal from "@/components/ContactModal";

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const checkScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("👑 Welcome to the Royal VIP Circle!", {
      description: "Use code ROYAL10 for 10% off your next bespoke order.",
    });
  };

  return (
    <>
      <footer className="relative border-t border-purple-200/70 pt-20 pb-12 overflow-hidden bg-gradient-to-b from-white/90 via-purple-50/30 to-purple-100/40 backdrop-blur-xl">
        {/* Soft background ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-7xl relative z-10">
          {/* ── Top Newsletter Banner ── */}
          <div className="glass-card-luxury rounded-[2.5rem] p-8 md:p-12 mb-16 border border-purple-200 shadow-luxury-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
                  <Crown size={12} className="text-amber-500" />
                  <span>Royal Atelier VIP Circle</span>
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-black text-purple-950">
                  Enjoy 10% Off Your First Custom Commission
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-purple-900/75 max-w-xl">
                  Receive secret drop announcements, seasonal forever bouquet releases, and exclusive plushie commission priority.
                </p>
              </div>

              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                    <CheckCircle2 size={22} className="text-emerald-600 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-bold">You're in the Royal Circle!</p>
                      <p className="text-[11px] text-emerald-700">Use promo code <strong className="font-black">ROYAL10</strong> at checkout.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your royal email..."
                      className="w-full text-xs font-body rounded-2xl border border-purple-200 bg-white px-4 py-3.5 text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                    />
                    <button
                      type="submit"
                      className="btn-gradient px-5 py-3.5 rounded-2xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 shadow-md hover:shadow-lg active:scale-95 transition-all"
                    >
                      <span>Join</span>
                      <Send size={13} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Main Footer Columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-purple-200/60">
            {/* Column 1: Brand Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-purple-400 via-pink-300 to-amber-300 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img src={logo} alt="Inventive Queen" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-purple-950">Inventive Queen</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-600">Royal Crochet Atelier</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-purple-900/75 leading-relaxed max-w-sm font-normal">
                Bespoke handcrafted crochet dolls, forever floral bouquets, and aesthetic pocket keepsakes. Stitched with royal devotion and pure milk cotton yarn.
              </p>

              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100/70 border border-purple-200 text-xs text-purple-950 font-bold">
                <ShieldCheck size={14} className="text-purple-700" />
                <span>Insured Nationwide Delivery with Wax-Seal Box</span>
              </div>
            </div>

            {/* Column 2: Atelier Collections */}
            <div className="lg:col-span-3 space-y-3">
              <p className="font-display text-sm font-bold text-purple-950 uppercase tracking-wider">
                Collections
              </p>
              <ul className="space-y-2 text-xs font-semibold text-purple-900/80">
                <li>
                  <Link to="/category/bouquet" className="hover:text-purple-700 transition-colors">
                    🌸 Everlasting Bouquets
                  </Link>
                </li>
                <li>
                  <Link to="/category/doll" className="hover:text-purple-700 transition-colors">
                    🧸 Keepsake Dolls & Plushies
                  </Link>
                </li>
                <li>
                  <Link to="/category/keychain" className="hover:text-purple-700 transition-colors">
                    🔑 Pocket Charms & Mascots
                  </Link>
                </li>
                <li>
                  <Link to="/category/bookmark" className="hover:text-purple-700 transition-colors">
                    🔖 Heirloom Crochet Bookmarks
                  </Link>
                </li>
                <li>
                  <Link to="/custom-orders" className="text-purple-700 font-bold hover:underline">
                    👑 Bespoke Commission Studio →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care & Policies */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-display text-sm font-bold text-purple-950 uppercase tracking-wider">
                Client Concierge
              </p>
              <ul className="space-y-2 text-xs font-semibold text-purple-900/80">
                <li>
                  <button onClick={() => setContactOpen(true)} className="hover:text-purple-700 transition-colors text-left">
                    Direct Inquiry / FAQ
                  </button>
                </li>
                <li>
                  <Link to="/policy" className="hover:text-purple-700 transition-colors">
                    Care Instructions
                  </Link>
                </li>
                <li>
                  <Link to="/policy" className="hover:text-purple-700 transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link to="/policy" className="hover:text-purple-700 transition-colors">
                    Terms of Commission
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Social Atelier */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-display text-sm font-bold text-purple-950 uppercase tracking-wider">
                Connect
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-950 hover:border-purple-400 hover:shadow-xs transition-all"
                >
                  <Instagram size={14} className="text-pink-600" />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-purple-200 text-xs font-bold text-purple-950 hover:border-purple-400 hover:shadow-xs transition-all"
                >
                  <MessageCircle size={14} className="text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-purple-900/60 font-medium text-center sm:text-left">
            <span>© 2026 Inventive Queen Atelier. Handcrafted with royal care in India.</span>
            
            <div className="flex items-center gap-3">
              <Link to="/policy" className="hover:text-purple-950 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/policy" className="hover:text-purple-950 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/admin" className="inline-flex items-center gap-1 text-purple-700 font-bold hover:text-purple-950 transition-colors">
                <Lock size={11} />
                <span>Admin CMS</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Back-To-Top Button */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white border-2 border-purple-300 shadow-luxury text-purple-700 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Footer;
