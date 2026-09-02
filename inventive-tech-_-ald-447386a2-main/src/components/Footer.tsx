import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUp, Instagram, Facebook, MessageCircle, Lock } from "lucide-react";
import logo from "@/assets/logo.png";
import ContactModal from "@/components/ContactModal";

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const checkScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <footer className="relative border-t border-purple-200/60 py-16 text-center overflow-hidden">
        <div className="container max-w-4xl relative z-10 flex flex-col items-center">
          {/* ── Mascot Avatar ── */}
          <div className="relative group mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-white border-2 border-purple-300 shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src={logo}
                alt="Inventive Queen"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 text-sm select-none">👑</span>
          </div>

          {/* ── Brand Title & Tagline ── */}
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-purple-950">
            Inventive Queen
          </h3>
          <p className="text-xs sm:text-sm text-purple-900/70 font-medium mt-1">
            Handmade crochet dolls, plushies & flowers • Royal Atelier
          </p>

          {/* ── Horizontal Navigation Links Row ── */}
          <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-semibold text-purple-900/80">
            <button onClick={scrollToTop} className="hover:text-purple-700 transition-colors">
              Home
            </button>
            <button onClick={() => handleScrollTo("pricelist")} className="hover:text-purple-700 transition-colors">
              Dolls
            </button>
            <button onClick={() => handleScrollTo("pricelist")} className="hover:text-purple-700 transition-colors">
              Characters
            </button>
            <button onClick={() => handleScrollTo("categories")} className="hover:text-purple-700 transition-colors">
              Flowers
            </button>
            <button onClick={() => handleScrollTo("catalogue")} className="hover:text-purple-700 transition-colors">
              Catalogue
            </button>
            <button onClick={() => handleScrollTo("how-to-order")} className="hover:text-purple-700 transition-colors">
              How to order
            </button>
            <button onClick={() => handleScrollTo("why-choose-us")} className="hover:text-purple-700 transition-colors">
              About
            </button>
            <button onClick={() => handleScrollTo("terms")} className="hover:text-purple-700 transition-colors">
              Terms & conditions
            </button>
            <button onClick={() => setContactOpen(true)} className="hover:text-purple-700 transition-colors">
              FAQ
            </button>
            <button onClick={() => setContactOpen(true)} className="hover:text-purple-700 transition-colors">
              Contact
            </button>
          </nav>

          {/* ── Social Media Pill Buttons ── */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 text-purple-950 text-xs font-bold transition-all hover:-translate-y-0.5"
            >
              <Instagram size={14} className="text-pink-600" />
              <span>Instagram</span>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 text-purple-950 text-xs font-bold transition-all hover:-translate-y-0.5"
            >
              <Facebook size={14} className="text-blue-600" />
              <span>Facebook</span>
            </a>

            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 text-purple-950 text-xs font-bold transition-all hover:-translate-y-0.5"
            >
              <MessageCircle size={14} className="text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold transition-all hover:bg-purple-200"
            >
              <span>✨ Bespoke Custom</span>
            </Link>
          </div>

          {/* ── Copyright & Admin CMS Line ── */}
          <div className="mt-10 pt-6 border-t border-purple-200/60 w-full flex flex-wrap items-center justify-center gap-4 text-xs text-purple-900/60 font-medium">
            <span>© 2026 Inventive Queen. All designs handmade with love.</span>
            <span>•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 hover:text-purple-800 transition-colors"
            >
              <Lock size={12} />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>

        {/* ── Floating Back-to-Top Button (CyDoes Craft style) ── */}
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-white border-2 border-purple-300 shadow-lg text-purple-700 hover:bg-purple-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </footer>

      {/* Contact modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
};

export default Footer;
