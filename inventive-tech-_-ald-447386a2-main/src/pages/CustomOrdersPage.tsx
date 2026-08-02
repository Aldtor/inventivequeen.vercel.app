import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, Palette, Package, HelpCircle, ChevronRight, Check, ShoppingBag, ShoppingCart, ChevronDown } from "lucide-react";
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
  { icon: MessageCircle, title: "Discuss", desc: "Share your custom requirements" },
  { icon: Palette, title: "Design", desc: "We sketch out your custom creation" },
  { icon: Clock, title: "Craft", desc: "Handmade with love in 3-7 days" },
  { icon: Package, title: "Deliver", desc: "Carefully packed and shipped to you" },
];

const exampleImages = [bouquetRose, bouquetPastel, productPenguin, productPanda];

const faqs = [
  {
    q: "How long does a custom order take?",
    a: "Most custom orders take 3-7 days to craft depending on complexity. We'll give you an estimated timeline once we understand your requirements.",
  },
  {
    q: "Can I choose specific colors and sizes?",
    a: "Absolutely! That's the beauty of custom orders. You can pick colors, sizes, flower types, and even add names or initials.",
  },
  {
    q: "What's the price range for custom orders?",
    a: "Prices vary depending on complexity and size. Keychains start from Rs. 199, bouquets from Rs. 399. We'll confirm the price before starting.",
  },
  {
    q: "Can I see a preview before you start?",
    a: "We'll share a description or reference image of the proposed design before beginning work so you're fully aligned.",
  },
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
    addCartItem(selectedProduct, { custom: details });
    setCartFeedback("Custom request added to cart");
    window.setTimeout(() => setCartFeedback(""), 1600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section - Heading & Description */}
        <div className="bg-secondary/30 border-b border-border/40">
          <div className="container py-14 md:py-20 text-center">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-body font-semibold">
                Made Just for You
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold text-foreground text-balance">
                Custom Orders
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-pretty leading-relaxed">
                Pick a product and tell us how you'd like it customised - colour, size, name, anything!
                We'll bring your vision to life, stitch by stitch.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* 2. SELECT YOUR CUSTOM ORDER SECTION - Immediately after Heading and Description */}
        <div className="container py-12 md:py-16">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Start Your Custom Order
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a product, write your custom changes, and place your order
                </p>
              </div>

              {/* Step 1: Choose a product with Image, Name, and Price */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <label className="font-body text-sm font-semibold text-foreground uppercase tracking-[0.1em]">
                    1. Choose a product
                  </label>
                  {selectedProduct && (
                    <span className="text-xs text-primary font-body font-medium">
                      Selected: {selectedProduct.name} ({selectedProduct.price})
                    </span>
                  )}
                </div>

                {/* Custom Image-Rich Dropdown Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    {selectedProduct ? (
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-10 h-10 rounded-xl object-contain bg-white flex-shrink-0 border border-border/60"
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
                        Select a product to customise...
                      </span>
                    )}
                    <ChevronDown
                      size={18}
                      className={`text-muted-foreground transition-transform duration-200 ml-2 flex-shrink-0 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-30 left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-2 space-y-1"
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
                                  : "hover:bg-muted/60"
                              }`}
                            >
                              <img
                                src={p.images[0]}
                                alt={p.name}
                                className="w-12 h-12 rounded-lg object-contain bg-white flex-shrink-0 border border-border/40"
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
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                  <Check size={12} className="text-primary-foreground" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Visual Card Grid with Product Image, Name & Price */}
                <div className="pt-3">
                  <p className="text-xs text-muted-foreground font-body mb-3">
                    Or select directly from visual catalog:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {products.map((p) => {
                      const isSelected = selectedProductId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProductId(p.id)}
                          className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 active:scale-[0.97] bg-card ${
                            isSelected
                              ? "border-primary shadow-lg shadow-primary/15 ring-2 ring-primary/20"
                              : "border-border/60 hover:border-primary/40 shadow-luxury-sm hover:shadow-luxury"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                              <Check size={14} className="text-primary-foreground" />
                            </div>
                          )}
                          <div className="aspect-square overflow-hidden bg-muted">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-3">
                            <p className="font-body text-xs md:text-sm font-medium text-foreground leading-snug line-clamp-1">
                              {p.name}
                            </p>
                            <p className="mt-1 font-display text-sm font-bold text-primary">
                              {p.price}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 2: Describe customisation */}
              <div className="space-y-3 mb-8">
                <label className="font-body text-sm font-semibold text-foreground uppercase tracking-[0.1em] block">
                  2. Write your custom changes
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="E.g. I want this in blue with my name 'Priya' stitched on it, slightly bigger size..."
                  className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Submit buttons - Cart or Direct Website Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!canSend}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl border border-primary/30 bg-card text-foreground py-4 font-semibold hover:border-primary/60 hover:bg-brand-blush/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
                >
                  <ShoppingCart size={18} />
                  Add Custom Order to Cart
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary text-primary-foreground py-4 font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base"
                >
                  <ShoppingBag size={18} />
                  Proceed to Checkout
                </button>
              </div>

              {cartFeedback && (
                <p className="text-center text-xs text-primary font-body font-medium mt-3">
                  {cartFeedback}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground mt-3">
                Your custom piece will be handcrafted specially for you
              </p>
            </div>
          </FadeIn>
        </div>

        {/* 3. Timeline - How It Works */}
        <div className="bg-secondary/20 py-12 md:py-16">
          <div className="container">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
                How It Works
              </h2>
            </FadeIn>
            <StaggerChildren className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {timelineSteps.map((step, i) => (
                <StaggerItem key={step.title}>
                  <div className="flex flex-col items-center text-center p-5 md:p-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blush/60 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-primary/60 font-body font-semibold mb-1">
                      Step {i + 1}
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>

        {/* Example gallery */}
        <div className="py-12 md:py-16">
          <div className="container">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
                Past Custom Creations
              </h2>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                A few examples of custom pieces we've made for happy customers
              </p>
            </FadeIn>
            <StaggerChildren className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {exampleImages.map((img, i) => (
                <StaggerItem key={i}>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-luxury-sm">
                    <img
                      src={img}
                      alt={`Custom creation example ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-contain bg-white hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-secondary/20 py-12 md:py-16">
          <div className="container max-w-2xl">
            <FadeIn>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center">
                Frequently Asked Questions
              </h2>
            </FadeIn>
            <div className="mt-8 space-y-2">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="bg-card rounded-2xl shadow-luxury-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left"
                      aria-expanded={openFaq === i}
                    >
                      <HelpCircle size={16} className="text-primary flex-shrink-0" />
                      <span className="font-body text-sm font-medium text-foreground flex-1">
                        {faq.q}
                      </span>
                      <ChevronRight
                        size={16}
                        className={`text-muted-foreground transition-transform duration-200 ${
                          openFaq === i ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed pl-12">
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
        </div>

        {/* Expectation management */}
        <div className="container py-12 md:py-16">
          <FadeIn>
            <div className="max-w-2xl mx-auto bg-brand-blush/20 rounded-2xl p-6 md:p-8 text-center">
              <h3 className="font-display text-xl font-bold text-foreground">
                What to Expect
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Custom orders typically take 3-7 business days to craft depending on complexity.
                Prices start from Rs. 199 for keychains and Rs. 399 for bouquets.
                Once production begins, custom orders cannot be cancelled - please review your details carefully.
              </p>
            </div>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomOrdersPage;

