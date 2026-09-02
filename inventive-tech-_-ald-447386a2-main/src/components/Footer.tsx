import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Instagram, Mail, MessageCircle, Heart, Crown, Sparkles, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import ContactModal from "@/components/ContactModal";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const checkScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", action: scrollToTop },
    { label: "Dolls & Plush", action: () => handleScrollTo("pricelist") },
    { label: "Crochet Flowers", action: () => handleScrollTo("categories") },
    { label: "Catalogue", action: () => handleScrollTo("catalogue") },
    { label: "How to Order", action: () => handleScrollTo("how-to-order") },
  ];

  const aboutLinks = [
    { label: "About Atelier", action: () => handleScrollTo("why-choose-us") },
    { label: "Terms & Conditions", action: () => handleScrollTo("terms") },
    { label: "Contact Us", action: () => setContactOpen(true) },
    { label: "Privacy Policy", to: "/policy/privacy" },
    { label: "Shipping Policy", to: "/policy/shipping" },
  ];

  return (
    <>
      <footer className="relative overflow-hidden">
        {/* ── Dark mesh background ── */}
        <div className="absolute inset-0 bg-dark-mesh" />
        <div className="absolute inset-0 bg-craft-dots opacity-[0.04]" />

        <div className="relative z-10">
          {/* ── Top CTA Band ── */}
          <div className="border-b border-white/[0.06]">
            <div className="container max-w-5xl py-12 md:py-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 text-[10px] uppercase tracking-[0.25em] font-semibold mb-4">
                <Crown size={12} className="text-amber-400" />
                Royal Atelier
              </div>
              <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-white text-balance">
                Ready to bring your{" "}
                <span className="text-gradient-gold">dream piece</span> to life?
              </h3>
              <p className="mt-3 text-sm text-white/50 max-w-md mx-auto">
                Every creation starts with your imagination. Send us a photo, sketch, or description.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full btn-gradient text-white text-sm font-bold shadow-royal-glow hover:shadow-luxury-lg active:scale-95 transition-all duration-300"
                >
                  <Sparkles size={15} className="text-amber-200" />
                  Start Custom Commission
                </Link>
                <button
                  onClick={() => setContactOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white text-sm font-semibold border border-white/[0.1] transition-all duration-300"
                >
                  <Mail size={15} />
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Footer Grid ── */}
          <div className="container max-w-5xl py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {/* Brand Column */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Inventive Queen"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10 shadow-lg"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 text-xs select-none">👑</span>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">Inventive Queen</h4>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-purple-300/60 font-bold">
                      Royal Crochet Atelier
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-[240px]">
                  Handmade crochet dolls, plushies & everlasting flowers — crafted stitch by stitch with royal care.
                </p>

                {/* Social Links */}
                <div className="mt-5 flex items-center gap-2">
                  <a
                    href="https://instagram.com/inventivequeen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram size={15} />
                  </a>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
                    aria-label="Email"
                  >
                    <Mail size={15} />
                  </button>
                  <Link
                    to="/custom-orders"
                    className="w-9 h-9 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/20 flex items-center justify-center text-primary/80 hover:text-white transition-all duration-200"
                    aria-label="Commission"
                  >
                    <MessageCircle size={15} />
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h5 className="font-body text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
                  Quick Links
                </h5>
                <ul className="space-y-2.5">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={link.action}
                        className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About */}
              <div>
                <h5 className="font-body text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
                  About
                </h5>
                <ul className="space-y-2.5">
                  {aboutLinks.map((link) => (
                    <li key={link.label}>
                      {link.to ? (
                        <Link to={link.to} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                          {link.label}
                        </Link>
                      ) : (
                        <button onClick={link.action} className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Commission CTA */}
              <div>
                <h5 className="font-body text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-4">
                  Commission
                </h5>
                <p className="text-xs text-white/40 leading-relaxed mb-4">
                  Got a character, photo, or idea? Send it over and I'll craft it in soft yarn.
                </p>
                <Link
                  to="/custom-orders"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold border border-primary/20 transition-all duration-200"
                >
                  <Send size={13} />
                  Start a Commission
                </Link>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="border-t border-white/[0.06]">
            <div className="container max-w-5xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
              <p className="flex items-center gap-1.5">
                © 2026 Inventive Queen. Crafted with
                <Heart size={11} className="text-pink-400/60 fill-pink-400/60" />
                & royal care.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/policy/privacy" className="hover:text-white/60 transition-colors">
                  Privacy
                </Link>
                <Link to="/policy/terms" className="hover:text-white/60 transition-colors">
                  Terms
                </Link>
                <Link to="/admin" className="text-primary/40 hover:text-primary/70 font-medium transition-colors">
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating Back-to-Top ── */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full btn-gradient text-white shadow-luxury-lg hover:shadow-royal flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Footer;
