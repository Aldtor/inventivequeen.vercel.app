import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageCircle, Palette, Package, HelpCircle, ChevronRight, Check, ShoppingBag, ShoppingCart, ChevronDown, Sparkles, Wand2, Crown, ShieldCheck, Heart, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { useProducts } from "@/lib/cms-products";
import { addCartItem, openCartDrawer } from "@/lib/cart";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";

import bouquetRose from "@/assets/product-bouquet-rose.png";
import bouquetPastel from "@/assets/product-bouquet-pastel.png";
import productPenguin from "@/assets/product-penguin-1.jpeg";
import productPanda from "@/assets/product-panda.jpeg";

import heroLuxuryAtelier from "@/assets/hero-luxury-atelier.jpg";

const timelineSteps = [
  { icon: Palette, title: "1. Select & Specify", desc: "Choose base design, custom palette & personal references" },
  { icon: MessageCircle, title: "2. Atelier Alignment", desc: "We review details & confirm colors before yarn magic begins" },
  { icon: Clock, title: "3. Handcrafted in Atelier", desc: "Stitched with royal care in 3–5 business days" },
  { icon: Package, title: "4. Luxury Wax-Seal Unboxing", desc: "Gift-wrapped with satin ribbon and safely shipped across India" },
];

const exampleImages = [bouquetRose, bouquetPastel, productPenguin, productPanda];

const faqs = [
  {
    q: "How long does a bespoke custom order take?",
    a: "Most custom pieces take 3–5 business days to handcraft depending on complexity. We'll give you an exact estimated dispatch date upon review.",
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
    a: "You can either check out directly through our website via secure Razorpay or add to your royal cart. Orders are entered into atelier production immediately after confirmation.",
  },
];

const promptSuggestions = [
  "Lavender & cream roses with satin bow",
  "Blue anime character with cat ears",
  "Mini chibi doll wearing green dungarees",
  "Name 'Aarav' stitched on keepsake tag",
  "Add warm fairy lights to bouquet",
];

const colorThemes = [
  { label: "Royal Lavender", class: "from-purple-500 to-indigo-500" },
  { label: "Rose Petal", class: "from-pink-400 to-rose-500" },
  { label: "Pastel Dream", class: "from-pink-300 via-purple-300 to-cyan-300" },
  { label: "Forest Mint", class: "from-emerald-400 to-teal-500" },
  { label: "Warm Sunset", class: "from-amber-400 to-orange-500" },
];

const categoryFilters = [
  { id: "all", label: "All Formats" },
  { id: "bouquet", label: "Forever Flowers" },
  { id: "doll", label: "Keepsake Dolls" },
  { id: "keychain", label: "Pocket Charms" },
  { id: "bookmark", label: "Bookmarks" },
];

const CustomOrdersPage = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>("Royal Lavender");
  const [includeFairyLights, setIncludeFairyLights] = useState(false);
  const [includeGiftCard, setIncludeGiftCard] = useState(false);
  const [includeRush, setIncludeRush] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [cartFeedback, setCartFeedback] = useState("");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => {
      const type = (p.type || "").toLowerCase();
      if (selectedCategory === "bouquet") return type.includes("bouquet") || type.includes("flower");
      if (selectedCategory === "doll") return type.includes("doll") || type.includes("teddy") || type.includes("amigurumi");
      if (selectedCategory === "keychain") return type.includes("keychain") || type.includes("charm");
      if (selectedCategory === "bookmark") return type.includes("bookmark");
      return true;
    });
  }, [products, selectedCategory]);

  const activeProductId = selectedProductId || filteredProducts[0]?.id || products[0]?.id || "mixed-rose-grand-bouquet";
  const selectedProduct = products.find((p) => p.id === activeProductId) || products[0];

  const rawBasePrice = useMemo(() => {
    if (!selectedProduct) return 999;
    return parseInt(selectedProduct.price.replace(/[^\d]/g, "")) || 999;
  }, [selectedProduct]);

  const addOnsTotal = useMemo(() => {
    let sum = 0;
    if (includeFairyLights) sum += 150;
    if (includeGiftCard) sum += 99;
    if (includeRush) sum += 250;
    return sum;
  }, [includeFairyLights, includeGiftCard, includeRush]);

  const calculatedTotal = rawBasePrice + addOnsTotal;

  const fullCustomText = () => {
    const parts = [];
    if (selectedColorTheme) parts.push(`Theme: ${selectedColorTheme}`);
    if (details.trim()) parts.push(`Notes: ${details.trim()}`);
    if (includeFairyLights) parts.push(`Add-on: Warm Fairy Lights (+₹150)`);
    if (includeGiftCard) parts.push(`Add-on: Wax-Sealed Gift Card (+₹99)`);
    if (includeRush) parts.push(`Add-on: 48h Priority Rush (+₹250)`);
    return parts.join(" | ");
  };

  const handleSend = () => {
    if (!selectedProduct) return;
    const params = new URLSearchParams({
      product: selectedProduct.id,
      custom: fullCustomText(),
      price: String(calculatedTotal),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addCartItem(
      {
        ...selectedProduct,
        price: `₹${calculatedTotal.toLocaleString("en-IN")}`,
      },
      {
        custom: fullCustomText(),
        color: selectedColorTheme,
        price: `₹${calculatedTotal.toLocaleString("en-IN")}`,
      }
    );
    setCartFeedback(`✨ ${selectedProduct.name} (Customized · ₹${calculatedTotal.toLocaleString("en-IN")}) added to your royal basket!`);
    openCartDrawer();
    window.setTimeout(() => setCartFeedback(""), 3000);
  };

  const handleWhatsAppOrder = () => {
    if (!selectedProduct) return;
    const text = encodeURIComponent(
      `Hello Inventive Queen Atelier! 👑\n\nI would like to commission a bespoke handcrafted piece:\n• Base Design: ${selectedProduct.name} (Base: ${selectedProduct.price})\n• Aesthetic Palette: ${selectedColorTheme}\n• Add-ons:${includeFairyLights ? "\n  - Warm LED Fairy Lights (+₹150)" : ""}${includeGiftCard ? "\n  - Wax-Sealed Handwritten Card (+₹99)" : ""}${includeRush ? "\n  - 48-Hour Priority Rush (+₹250)" : ""}${!includeFairyLights && !includeGiftCard && !includeRush ? " None" : ""}\n• Personal Notes: ${details.trim() || "Standard royal atelier craft"}\n\n• Estimated Total: ₹${calculatedTotal.toLocaleString("en-IN")}\n• Turnaround: ${includeRush ? "48-Hour Express Dispatch" : "3–5 Business Days"}\n\nPlease confirm availability and payment details!`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#461c48] font-sans selection:bg-purple-200 selection:text-purple-900">
      <SiteHeader />

      <main className="flex-1 pt-24 sm:pt-28">
        {/* Hero Section */}
        <section className="bg-fairytale-mesh border-b border-purple-200/60 relative overflow-hidden py-16 md:py-20">
          <div className="container max-w-5xl text-center relative z-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-5">
                <Crown size={14} className="text-amber-500" />
                <span>Bespoke Atelier Studio</span>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-purple-950 tracking-tight text-balance">
                Bespoke Royal Commissions
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-4 text-purple-900/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed text-pretty font-normal">
                Turn your imagination into soft yarn reality. Choose your base piece, customize colors and details, and our atelier will weave it stitch by stitch.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Commission Studio Form */}
        <section className="container py-12 md:py-20 max-w-5xl">
          <FadeIn>
            <div className="glass-card-luxury rounded-[2.5rem] p-6 sm:p-10 shadow-luxury-lg border border-purple-200/80">
              <div className="text-center mb-10 pb-6 border-b border-purple-100">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mb-3 shadow-xs">
                  <Wand2 size={24} />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-purple-950">
                  Customization Atelier
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-purple-900/70">
                  Select your base format, pick your aesthetic palette & order directly.
                </p>
              </div>

              {/* Step 1: Base Product Selection with Category Tabs */}
              <div className="space-y-4 mb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <label className="font-display text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center font-body shadow-xs">
                      1
                    </span>
                    <span>Select Base Design</span>
                  </label>
                  {selectedProduct && (
                    <span className="text-xs text-purple-800 font-bold bg-purple-100 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
                      Selected: {selectedProduct.name} ({selectedProduct.price})
                    </span>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat.id
                          ? "bg-purple-900 text-white shadow-xs"
                          : "bg-white text-purple-900/75 hover:bg-purple-50 border border-purple-200/80"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredProducts.slice(0, 12).map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProductId(p.id)}
                        className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 p-2.5 bg-white ${
                          isSelected
                            ? "border-purple-600 shadow-luxury ring-2 ring-purple-400/30 scale-[1.01]"
                            : "border-purple-100 hover:border-purple-300 shadow-xs"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center shadow-md text-white">
                            <Check size={12} />
                          </div>
                        )}
                        <div className="aspect-square overflow-hidden rounded-xl bg-purple-50 p-2">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="mt-2.5 px-1">
                          <p className="font-body text-xs font-bold text-purple-950 truncate">
                            {p.name}
                          </p>
                          <p className="font-display text-xs font-black text-purple-700 mt-0.5">
                            {p.price}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Color Theme Selection */}
              <div className="space-y-4 mb-10 pt-6 border-t border-purple-100">
                <label className="font-display text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center font-body shadow-xs">
                    2
                  </span>
                  <span>Choose Color Theme Aesthetic</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {colorThemes.map((theme) => (
                    <button
                      key={theme.label}
                      type="button"
                      onClick={() => setSelectedColorTheme(theme.label)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                        selectedColorTheme === theme.label
                          ? "bg-purple-700 text-white border-purple-700 shadow-sm"
                          : "bg-white text-purple-950 border-purple-200 hover:border-purple-300"
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${theme.class}`} />
                      <span>{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Custom Details & Reference Notes */}
              <div className="space-y-3 mb-10 pt-6 border-t border-purple-100">
                <div className="flex items-center justify-between">
                  <label className="font-display text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center font-body shadow-xs">
                      3
                    </span>
                    <span>Customization Details & Notes</span>
                  </label>
                  <span className="text-[10px] uppercase tracking-wider text-purple-700 font-bold bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Optional or Reference
                  </span>
                </div>

                {/* Suggestion Quick Chips */}
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {promptSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setDetails((prev) => (prev ? `${prev}, ${prompt}` : prompt))}
                      className="text-[11px] font-body text-purple-900/75 hover:text-purple-950 bg-white hover:bg-purple-50 border border-purple-200 px-3 py-1 rounded-full transition-all"
                    >
                      + {prompt}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe colors, character hair/outfit details, custom initials to embroider, or personal message for gift card..."
                  className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-body text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/40 focus:border-purple-500 transition-all resize-none shadow-sm"
                />
              </div>

              {/* Step 4: Add-on Perks with Live Costs */}
              <div className="space-y-3 mb-10 pt-6 border-t border-purple-100">
                <label className="font-display text-base sm:text-lg font-bold text-purple-950 flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-purple-700 text-white text-xs font-black flex items-center justify-center font-body shadow-xs">
                    4
                  </span>
                  <span>Royal Atelier Finishing Touches</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    includeFairyLights ? "bg-purple-50/80 border-purple-500 shadow-sm" : "bg-white border-purple-200 hover:border-purple-300 shadow-xs"
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeFairyLights}
                      onChange={(e) => setIncludeFairyLights(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-purple-950 flex items-center justify-between">
                        <span>✨ Warm Fairy Lights</span>
                        <span className="text-purple-700 font-black">+₹150</span>
                      </span>
                      <span className="text-purple-900/70 mt-1 block">Adds fairy glow string with batteries</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    includeGiftCard ? "bg-purple-50/80 border-purple-500 shadow-sm" : "bg-white border-purple-200 hover:border-purple-300 shadow-xs"
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeGiftCard}
                      onChange={(e) => setIncludeGiftCard(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-purple-950 flex items-center justify-between">
                        <span>💌 Wax-Sealed Note</span>
                        <span className="text-purple-700 font-black">+₹99</span>
                      </span>
                      <span className="text-purple-900/70 mt-1 block">Handwritten calligraphy keepsake note</span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    includeRush ? "bg-purple-50/80 border-purple-500 shadow-sm" : "bg-white border-purple-200 hover:border-purple-300 shadow-xs"
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeRush}
                      onChange={(e) => setIncludeRush(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-purple-600 focus:ring-purple-400 cursor-pointer"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-purple-950 flex items-center justify-between">
                        <span>⚡ Priority 48h Craft</span>
                        <span className="text-purple-700 font-black">+₹250</span>
                      </span>
                      <span className="text-purple-900/70 mt-1 block">Expedited atelier stitch & fast dispatch</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* ── Royal Commission Ticket Preview Card ── */}
              {selectedProduct && (
                <div className="mb-8 rounded-3xl bg-gradient-to-br from-purple-900 via-[#3B124B] to-purple-950 text-white p-6 sm:p-7 shadow-xl border border-amber-300/30 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/15">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shrink-0">
                        <img
                          src={selectedProduct.images[0]}
                          alt={selectedProduct.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown size={12} className="text-amber-300" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-200">
                            Atelier Commission Ticket
                          </span>
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
                          {selectedProduct.name}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-purple-200 block">Calculated Commission Total</span>
                      <span className="font-display text-2xl sm:text-3xl font-black text-amber-300">
                        ₹{calculatedTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
                      <span className="text-[9.5px] uppercase tracking-wider text-purple-200 block">Color Palette</span>
                      <span className="font-bold text-white truncate block mt-0.5">✦ {selectedColorTheme}</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
                      <span className="text-[9.5px] uppercase tracking-wider text-purple-200 block">Finishing Add-ons</span>
                      <span className="font-bold text-white truncate block mt-0.5">
                        {addOnsTotal > 0 ? `+₹${addOnsTotal} (${[includeFairyLights && "Lights", includeGiftCard && "Card", includeRush && "48h Rush"].filter(Boolean).join(", ")})` : "Standard Atelier"}
                      </span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
                      <span className="text-[9.5px] uppercase tracking-wider text-purple-200 block">Packaging</span>
                      <span className="font-bold text-amber-200 truncate block mt-0.5">🎁 Wax-Sealed Gift Box</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/10">
                      <span className="text-[9.5px] uppercase tracking-wider text-purple-200 block">Turnaround</span>
                      <span className="font-bold text-white truncate block mt-0.5">
                        {includeRush ? "⚡ 48h Priority" : "🕒 3–5 Days"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-purple-100">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-white text-purple-950 py-3.5 font-bold hover:bg-purple-50 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-xs"
                >
                  <ShoppingCart size={17} className="text-purple-700" />
                  <span>Add to Bag (₹{calculatedTotal.toLocaleString("en-IN")})</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 bg-emerald-50 text-emerald-950 py-3.5 font-bold hover:bg-emerald-100 active:scale-[0.98] transition-all text-xs sm:text-sm shadow-xs"
                >
                  <MessageCircle size={17} className="text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl btn-gradient text-white py-3.5 font-bold shadow-luxury hover:shadow-luxury-lg active:scale-[0.98] transition-all text-xs sm:text-sm"
                >
                  <Sparkles size={17} className="text-amber-200" />
                  <span>Royal Checkout</span>
                </button>
              </div>

              {cartFeedback && (
                <p className="text-center text-sm text-purple-800 font-bold mt-4 animate-fade-scale-in">
                  {cartFeedback}
                </p>
              )}

              <p className="text-center text-xs text-purple-900/70 mt-4">
                👑 Complimentary gift wrapping with wax seal & satin ribbon included with every custom order.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* Timeline Journey */}
        <section className="bg-purple-50/50 py-16 md:py-24 border-y border-purple-200/60">
          <div className="container max-w-6xl">
            <FadeIn>
              <div className="text-center mb-14">
                <span className="text-[10px] uppercase tracking-[0.25em] text-purple-700 font-bold block mb-2">
                  Atelier Journey
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-purple-950">
                  How Bespoke Commissions Unfold
                </h2>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {timelineSteps.map((step) => (
                <StaggerItem key={step.title}>
                  <div className="bg-white rounded-3xl p-7 text-center shadow-sm hover:shadow-luxury hover:-translate-y-1.5 transition-all group h-full flex flex-col items-center border border-purple-100">
                    <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <step.icon size={22} />
                    </div>
                    <h3 className="font-display text-base font-bold text-purple-950">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-purple-900/75 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* Portfolio Highlights */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl">
            <FadeIn>
              <div className="text-center mb-12">
                <span className="text-[10px] uppercase tracking-[0.25em] text-purple-700 font-bold block mb-2">
                  Atelier Showcase
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-purple-950">
                  Past Bespoke Creations
                </h2>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {exampleImages.map((img, i) => (
                <StaggerItem key={i}>
                  <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-luxury transition-all group p-3 border border-purple-100">
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

        {/* Custom Order FAQs */}
        <section className="bg-purple-50/50 py-16 md:py-24 border-t border-purple-200/60">
          <div className="container max-w-3xl">
            <FadeIn>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-purple-950 text-center mb-10">
                Commission FAQs
              </h2>
            </FadeIn>
            <div className="space-y-3.5">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-purple-100">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center gap-3 px-6 py-4 text-left font-body text-sm font-bold text-purple-950 hover:text-purple-700 transition-colors"
                      aria-expanded={openFaq === i}
                    >
                      <HelpCircle size={16} className="text-purple-600 flex-shrink-0" />
                      <span className="flex-1">{faq.q}</span>
                      <ChevronRight
                        size={16}
                        className={`text-purple-500 transition-transform duration-200 flex-shrink-0 ${
                          openFaq === i ? "rotate-90 text-purple-700" : ""
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
                          <p className="px-6 pb-5 text-xs sm:text-sm text-purple-900/80 leading-relaxed pl-13">
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
