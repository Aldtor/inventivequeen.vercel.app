import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Instagram, MessageCircle, Lock, Crown, Sparkles, Heart, Send, CheckCircle2, ShieldCheck, Phone, Mail } from "lucide-react";
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
      <footer className="relative border-t border-purple-200/70 pt-20 pb-12 overflow-hidden bg-gradient-to-b from-white/90 via-purple-50/40 to-purple-100/50 backdrop-blur-xl">
        {/* Soft background ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* ── Top Newsletter Banner ── */}
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 mb-16 border border-purple-200/80 shadow-[0_12px_40px_rgb(0,0,0,0.05)] bg-white/80 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider mb-3">
                  <Crown size={12} className="text-amber-500" />
                  <span>Royal Atelier VIP Circle</span>
                </div>
                <h3 className="font-display text-2xl md:text-4xl font-bold text-plum">
                  Enjoy 10% Off Your First Custom Commission
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl">
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
                      placeholder="Enter your email address..."
                      className="w-full text-xs font-body rounded-2xl border border-purple-200/90 bg-white px-4 py-3.5 text-plum placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                    />
                    <button
                      type="submit"
                      className="btn-royal px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 shadow-md hover:shadow-lg active:scale-95 transition-all"
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
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={logo} alt="Inventive Queen" className="w-12 h-12 rounded-full object-cover border border-purple-200 shadow-sm" />
                  <span className="absolute -bottom-1 -right-1 text-xs select-none">👑</span>
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-plum">Inventive Queen</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-600">Royal Crochet Atelier</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm font-normal">
                Bespoke handcrafted crochet dolls, forever floral bouquets, and aesthetic pocket keepsakes. Stitched with royal devotion and pure milk cotton yarn.
              </p>

              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100/70 border border-purple-200/80 text-xs text-purple-950 font-semibold">
                <ShieldCheck size={14} className="text-purple-700 shrink-0" />
                <span>Wax-Sealed Gift Box & Pan-India Dispatch</span>
              </div>
            </div>

            {/* Column 2: Atelier Collections */}
            <div className="lg:col-span-3 space-y-3">
              <p className="font-display text-sm font-bold text-plum uppercase tracking-wider">
                Collections
              </p>
              <ul className="space-y-2 text-xs font-medium text-plum/85">
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
                  <Link to="/custom-orders" className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1">
                    <span>👑 Bespoke Commission Studio</span>
                    <Sparkles size={11} className="text-amber-500" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: The Atelier Experience */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-display text-sm font-bold text-plum uppercase tracking-wider">
                Atelier
              </p>
              <ul className="space-y-2 text-xs font-medium text-plum/85">
                <li>
                  <Link to="/about" className="hover:text-purple-700 transition-colors">
                    The Craft & Story
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="hover:text-purple-700 transition-colors">
                    Patron Reviews (500+)
                  </Link>
                </li>
                <li>
                  <Link to="/how-to-order" className="hover:text-purple-700 transition-colors">
                    How to Commission
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-purple-700 transition-colors">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <button onClick={() => setContactOpen(true)} className="hover:text-purple-700 transition-colors text-left font-semibold">
                    Direct Inquiry / Help
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div className="lg:col-span-3 space-y-3">
              <p className="font-display text-sm font-bold text-plum uppercase tracking-wider">
                Connect With Us
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://wa.me/917892305330?text=Hi%20Inventive%20Queen!%20I%20would%20like%20to%20order%20a%20custom%20crochet%20piece."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900 hover:bg-emerald-100 hover:shadow-xs transition-all"
                >
                  <MessageCircle size={15} className="text-emerald-600" />
                  <span>WhatsApp: +91 7892305330</span>
                </a>

                <a
                  href="tel:+917892305330"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-purple-200/80 text-xs font-medium text-plum hover:bg-purple-50 transition-all"
                >
                  <Phone size={14} className="text-purple-600" />
                  <span>Call Atelier: +91 7892305330</span>
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-purple-200/80 text-xs font-medium text-plum hover:bg-purple-50 transition-all"
                >
                  <Instagram size={14} className="text-pink-600" />
                  <span>Follow on Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium text-center sm:text-left">
            <span>© {new Date().getFullYear()} Inventive Queen Royal Atelier. Handcrafted with love & milk cotton yarn in India.</span>
            
            <div className="flex items-center gap-3">
              <Link to="/policy/privacy-policy" className="hover:text-purple-950 transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/policy/terms-of-service" className="hover:text-purple-950 transition-colors">
                Terms
              </Link>
              <span>•</span>
              <Link to="/policy/shipping-policy" className="hover:text-purple-950 transition-colors">
                Shipping
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
