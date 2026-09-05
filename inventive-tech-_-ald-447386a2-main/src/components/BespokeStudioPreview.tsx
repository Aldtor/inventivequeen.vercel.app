import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Palette, Crown, ShoppingBag, ArrowRight, Check, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/lib/cms-products";
import { addCartItem } from "@/lib/cart";
import { FadeIn } from "@/components/motion/FadeIn";

const colorAesthetics = [
  { name: "Royal Lavender", color: "from-purple-500 to-indigo-500", desc: "Lilac, soft cream & royal violet" },
  { name: "Rose Petal", color: "from-pink-400 to-rose-500", desc: "Blush pink, champagne & crimson" },
  { name: "Pastel Dream", color: "from-pink-300 via-purple-300 to-cyan-300", desc: "Baby blue, peach & mint" },
  { name: "Forest Mint", color: "from-emerald-400 to-teal-500", desc: "Sage green, ivory & jade" },
  { name: "Warm Sunset", color: "from-amber-400 to-orange-500", desc: "Marigold, peach & golden yellow" },
];

const BespokeStudioPreview = () => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("Royal Lavender");
  const [includeLights, setIncludeLights] = useState(true);
  const [includeWaxSealNote, setIncludeWaxSealNote] = useState(true);
  const [customNote, setCustomNote] = useState("");

  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const fullCustomizationText = () => {
    const parts = [`Palette: ${selectedTheme}`];
    if (includeLights) parts.push("LED Fairy Lights Included");
    if (includeWaxSealNote) parts.push("Wax-Sealed Note Included");
    if (customNote.trim()) parts.push(`Notes: ${customNote.trim()}`);
    return parts.join(" • ");
  };

  const handleQuickAdd = () => {
    if (!activeProduct) return;
    addCartItem(activeProduct, {
      custom: fullCustomizationText(),
      color: selectedTheme,
    });
    toast.success(`✨ Added Custom "${activeProduct.name}" to your royal bag!`, {
      description: "Crafted to order with your chosen palette & wax seal packaging.",
    });
  };


  if (!activeProduct) return null;

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-purple-50/30">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-300/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-purple-200 shadow-sm text-purple-900 text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <Wand2 size={13} className="text-purple-600" />
              <span>Interactive Commission Studio</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-purple-950 text-balance">
              Design Your Keepsake Piece
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="mt-4 text-base text-purple-900/75 leading-relaxed font-normal">
              Test your favorite palette and add-ons in real time. We handcraft each commission stitch-by-stitch to your exact aesthetic.
            </p>
          </FadeIn>
        </div>

        {/* Interactive Customizer Card */}
        <FadeIn delay={0.2}>
          <div className="glass-card-luxury rounded-[2.5rem] p-6 sm:p-10 border border-purple-200/80 shadow-luxury-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-7 space-y-7">
              {/* Step 1: Base Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Choose Base Creation</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {products.slice(0, 4).map((p) => {
                    const isSelected = p.id === (selectedProductId || activeProduct.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProductId(p.id)}
                        className={`p-2.5 rounded-2xl text-left border transition-all flex flex-col items-center text-center ${
                          isSelected
                            ? "bg-purple-100/90 border-purple-600 shadow-sm ring-2 ring-purple-300"
                            : "bg-white hover:bg-purple-50/50 border-purple-150"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-purple-50/80 p-1 mb-1.5">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[11px] font-bold text-purple-950 truncate max-w-full block">
                          {p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}
                        </span>
                        <span className="text-[10px] text-purple-700 font-extrabold">{p.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Color Palette */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <span>Choose Palette Aesthetic</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorAesthetics.map((t) => {
                    const isSelected = selectedTheme === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedTheme(t.name)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all border ${
                          isSelected
                            ? "bg-purple-950 text-white border-purple-950 shadow-sm scale-105"
                            : "bg-white text-purple-900 border-purple-200 hover:border-purple-300"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${t.color}`} />
                        <span>{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Complimentary Perks */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-3 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-700 text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Royal Complimentary Perks</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-purple-200/80 cursor-pointer hover:border-purple-300 transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={includeLights}
                      onChange={(e) => setIncludeLights(e.target.checked)}
                      className="rounded text-purple-700 focus:ring-purple-400"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-purple-950 block">✨ Warm LED Fairy Lights</span>
                      <span className="text-[11px] text-purple-900/60">Free evening glow effect</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-purple-200/80 cursor-pointer hover:border-purple-300 transition-colors shadow-xs">
                    <input
                      type="checkbox"
                      checked={includeWaxSealNote}
                      onChange={(e) => setIncludeWaxSealNote(e.target.checked)}
                      className="rounded text-purple-700 focus:ring-purple-400"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-purple-950 block">👑 Wax-Sealed Gift Note</span>
                      <span className="text-[11px] text-purple-900/60">Handwritten royal card</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 4: Notes */}
              <div>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Optional: custom names, character hair style, or specific color notes..."
                  className="w-full text-xs font-body rounded-2xl border border-purple-200 bg-white px-4 py-3 text-purple-950 placeholder:text-purple-900/40 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                />
              </div>
            </div>

            {/* Right: Live Preview Box & Actions */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-purple-200/90 shadow-luxury flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                  <span className="text-xs uppercase tracking-wider font-bold text-purple-700">
                    Live Commission Preview
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                    Ready to Craft
                  </span>
                </div>

                {/* Preview Thumbnail */}
                <div className="my-5 aspect-[4/3] rounded-2xl overflow-hidden bg-purple-50/70 p-3 flex items-center justify-center border border-purple-100 relative group">
                  <img
                    src={activeProduct.images[0]}
                    alt={activeProduct.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-purple-200 text-[11px] font-bold text-purple-950 flex items-center justify-between shadow-xs">
                    <span>Theme: {selectedTheme}</span>
                    <span className="text-purple-700 font-black">{activeProduct.price}</span>
                  </div>
                </div>

                {/* Summary Specs */}
                <div className="space-y-1.5 text-xs text-purple-900/80 mb-6 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100/80">
                  <p className="font-bold text-purple-950">{activeProduct.name}</p>
                  <p className="text-[11px] text-purple-900/70">{fullCustomizationText()}</p>
                  <p className="text-[10px] text-emerald-700 font-bold">✓ Complimentary Wax-Seal Packaging Included</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="w-full py-3.5 px-4 rounded-2xl btn-gradient text-white text-xs font-bold uppercase tracking-wider shadow-luxury hover:shadow-luxury-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>Add Commission to Royal Bag</span>
                </button>

                <Link
                  to="/custom-orders"
                  className="w-full py-3 px-4 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100 text-purple-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <Wand2 size={14} className="text-purple-600" />
                  <span>Open Full Custom Studio</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default BespokeStudioPreview;
