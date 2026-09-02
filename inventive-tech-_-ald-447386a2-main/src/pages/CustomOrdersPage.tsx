import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, Palette, Package, HelpCircle, ChevronRight, Check, ShoppingBag, ShoppingCart, ChevronDown, Sparkles, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/cms-products";
import { addCartItem } from "@/lib/cart";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

import bouquetRose from "@/assets/product-bouquet-rose.png";
import bouquetPastel from "@/assets/product-bouquet-pastel.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productPanda from "@/assets/product-panda.jpeg";

const timelineSteps = [
  { icon: MessageCircle, title: "1. Specify", desc: "Select base item & describe your dream colors/style" },
  { icon: Palette, title: "2. Confirm", desc: "We review details & align before casting our yarn magic" },
  { icon: Clock, title: "3. Craft", desc: "Handcrafted stitch by stitch in 3–7 business days" },
  { icon: Package, title: "4. Deliver", desc: "Gift-wrapped with wax seal and shipped safely across India" },
];

const exampleImages = [bouquetRose, bouquetPastel, productPenguin, productPanda];

const faqs = [
  {
    q: "How long does a bespoke custom order take?",
    a: "Most custom pieces take 3–7 business days to handcraft depending on complexity and current commission volume. We'll give you an exact estimated dispatch date upon review.",
  },
  {
    q: "Can I choose specific colors, sizes, or personalized tags?",
    a: "Yes! That's the heart of our atelier. You can choose color combinations, hair/outfit styles, custom bouquet stem counts, and even request hand-embroidered initials or names.",
  },
  {
    q: "Can I send reference photos from Pinterest or anime?",
    a: "Absolutely! Feel free to describe it here and connect with us on WhatsApp or Instagram DM with your photos, character art, or real-life inspiration.",
  },
  {
    q: "How does payment work for custom commissions?",
    a: "You can either check out directly through our website via secure Razorpay or place an initial inquiry. Orders are entered into production immediately after payment confirmation.",
  },
];

const promptSuggestions = [
  "Lavender & cream roses with satin bow",
  "Blue anime character with cat ears",
  "Mini chibi doll wearing green dungarees",
  "Name 'Aarav' stitched on keepsake tag",
];

const CustomOrdersPage = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartFeedback, setCartFeedback] = useState("");

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const canSend = selectedProductId && details.trim().length >= 3;

  const handleSend = () => {
    if (!canSend || !selectedProduct) return;
    const params = new URLSearchParams({
      product: selectedProduct.id,
      custom: details.trim(),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  const handleAddToCart = () => {
    if (!canSend || !selectedProduct) return;
    addCartItem(selectedProduct, { custom: details.trim() });
    setCartFeedback("✨ Custom commission added to your royal bag!");
    window.setTimeout(() => setCartFeedback(""), 2200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/15 selection:text-primary">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-fairytale-mesh border-b border-border/40 relative overflow-hidden py-14 md:py-20">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card shadow-luxury-sm text-primary text-xs uppercase tracking-[0.22em] font-semibold mb-4">
                <Sparkles size={13} className="text-amber-500" />
                <span>BESPOKE ATELIER COMMISSIONS</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight text-balance">
                Bespoke Royal Commissions
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed text-pretty">
                Turn your imagination into soft yarn reality. Choose any base creation, customize the palette, size, or details, and we'll handcraft it stitch by stitch with royal care.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Commission Builder Form */}
        <section className="container py-12 md:py-18 max-w-4xl">
          <FadeIn>
            <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-luxury-lg border border-border/60">
              <div className="text-center mb-8 pb-6 border-b border-border/40">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-primary/10 text-primary mb-2">
                  <Wand2 size={20} />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Commission Studio
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                  Select a template piece, describe your unique requirements & order directly.
                </p>
              </div>

              {/* Step 1: Base Product */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <label className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-body">1</span>
                    Choose Base Design
                  </label>
                  {selectedProduct && (
                    <span className="text-xs text-primary font-body font-semibold bg-primary/10 px-3 py-0.5 rounded-full">
                      {selectedProduct.name} ({selectedProduct.price})
                    </span>
                  )}
                </div>

                {/* Dropdown Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 text-left shadow-luxury-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {selectedProduct ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-11 h-11 rounded-xl object-contain bg-white flex-shrink-0 border border-border/40 p-1"
                        />
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground truncate">
                            {selectedProduct.name}
                          </p>
                          <p className="font-display text-xs font-bold text-primary">
                            {selectedProduct.price}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="font-body text-sm text-muted-foreground">
                        Click to select a base product from our atelier...
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground transition-transform duration-200 ml-2 flex-shrink-0 ${
                        isDropdownOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-40 left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-luxury-lg p-2 space-y-1"
                      >
                        {products.map((p) => {
                          const isSelected = selectedProductId === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setSelectedProductId(p.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                                isSelected
                                  ? "bg-primary/10 border border-primary/30"
                                  : "hover:bg-secondary/70"
                              }`}
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-contain bg-white flex-shrink-0 border border-border/40 p-1"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-body text-sm font-semibold text-foreground truncate">
                                  {p.name}
                                </p>
                                <p className="font-display text-xs font-bold text-primary">
                                  {p.price}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white">
                                  <Check size={12} />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Visual Thumbnail Grid */}
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground font-body mb-2.5">
                    Or select by tapping any card:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {products.slice(0, 8).map((p) => {
                      const isSelected = selectedProductId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProductId(p.id)}
                          className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-[0.97] bg-card p-2 ${
                            isSelected
                              ? "border-primary shadow-luxury ring-2 ring-primary/20"
                              : "border-border/50 hover:border-primary/40 shadow-luxury-sm"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md text-white">
                              <Check size={12} />
                            </div>
                          )}
                          <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 via-white to-pink-50 p-2">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="mt-2 px-1">
                            <p className="font-body text-xs font-semibold text-foreground truncate">
                              {p.name}
                            </p>
                            <p className="font-display text-xs font-bold text-primary mt-0.5">
                              {p.price}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 2: Custom details */}
              <div className="space-y-3 mb-8 pt-4 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-body">2</span>
                    Describe Your Customization
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Required
                  </span>
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {promptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDetails((prev) => (prev ? `${prev}, ${prompt}` : prompt))}
                      className="text-[11px] font-body text-muted-foreground hover:text-primary bg-secondary/60 hover:bg-primary/10 border border-border/60 px-3 py-1 rounded-full transition-all"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe colors, specific outfit, size preferences, initials to stitch, or special packaging notes..."
                  className="w-full rounded-2xl border border-border/70 bg-card px-4 py-3.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none shadow-luxury-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!canSend}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-border/70 hover:border-primary/40 bg-card text-foreground py-3.5 font-bold hover:bg-secondary/40 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-luxury-sm"
                >
                  <ShoppingCart size={16} className="text-primary" />
                  Add Custom Request to Bag
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl btn-gradient text-white py-3.5 font-bold shadow-royal-glow hover:shadow-luxury-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                >
                  <Sparkles size={16} className="text-amber-200" />
                  Proceed to Royal Checkout
                </button>
              </div>

              {cartFeedback && (
                <p className="text-center text-xs text-primary font-bold mt-4 animate-fade-scale-in">
                  {cartFeedback}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground mt-4">
                ✨ Once placed, we'll verify references and start crafting within 24 hours.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* How It Works Timeline */}
        <section className="bg-secondary/25 py-14 md:py-20 border-y border-border/30">
          <div className="container max-w-5xl">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold block mb-2">
                  Atelier Journey
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  How Bespoke Orders Work
                </h2>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {timelineSteps.map((step) => (
                <StaggerItem key={step.title}>
                  <div className="glass-card rounded-2xl p-6 text-center shadow-luxury-sm hover:shadow-luxury transition-all group h-full flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <step.icon size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Gallery of Past Creations */}
        <section className="py-14 md:py-20">
          <div className="container max-w-5xl">
            <FadeIn>
              <div className="text-center mb-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold block mb-2">
                  Portfolio Highlights
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Past Bespoke Creations
                </h2>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {exampleImages.map((img, i) => (
                <StaggerItem key={i}>
                  <div className="aspect-square rounded-2xl overflow-hidden glass-card shadow-luxury-sm group p-2 border border-border/40">
                    <img
                      src={img}
                      alt={`Past bespoke creation ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-secondary/25 py-14 md:py-20 border-t border-border/30">
          <div className="container max-w-2xl">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
                Custom Order FAQs
              </h2>
            </FadeIn>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="glass-card rounded-2xl shadow-luxury-sm overflow-hidden border border-border/50">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left font-body text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <HelpCircle size={16} className="text-primary flex-shrink-0" />
                      <span className="flex-1">{faq.q}</span>
                      <ChevronRight
                        size={16}
                        className={`text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                          openFaq === i ? "rotate-90 text-primary" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-xs md:text-sm text-muted-foreground leading-relaxed pl-12">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CustomOrdersPage;
