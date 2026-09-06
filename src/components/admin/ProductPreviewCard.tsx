import { useState } from "react";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  Heart,
  Instagram,
  LayoutGrid,
  Maximize2,
  Package,
  Share2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { formatPrice, parsePriceValue } from "@/lib/product-display";

interface ProductPreviewCardProps {
  name: string;
  price: string;
  originalPrice?: string;
  sellingPrice?: string;
  discountPercent?: string;
  badge?: string;
  tagline?: string;
  imagesText?: string;
  type?: string;
  size?: string;
  isActive?: boolean;
}

type PreviewMode = "card" | "mobile" | "story";

export function ProductPreviewCard({
  name,
  originalPrice,
  sellingPrice,
  discountPercent,
  badge,
  tagline,
  imagesText,
  type,
  size,
  isActive = true,
}: ProductPreviewCardProps) {
  const [mode, setMode] = useState<PreviewMode>("card");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = (imagesText || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const activeImage = images[selectedImageIndex] || images[0];
  const displaySellPrice = sellingPrice?.trim() || "₹1,200";
  const displayOrigPrice = originalPrice?.trim();
  const numDiscount = Number(discountPercent) || 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode Switcher Bar */}
      <div className="w-full max-w-[320px] mb-2.5 flex items-center justify-between">
        <div className="flex items-center bg-white/80 p-0.5 rounded-full border border-white/90 shadow-sm text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode("card")}
            className={`px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 ${
              mode === "card"
                ? "bg-lilac-deep text-white shadow-sm"
                : "text-muted-foreground hover:text-lilac-deep"
            }`}
          >
            <LayoutGrid className="size-3" /> Store Card
          </button>
          <button
            type="button"
            onClick={() => setMode("mobile")}
            className={`px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 ${
              mode === "mobile"
                ? "bg-lilac-deep text-white shadow-sm"
                : "text-muted-foreground hover:text-lilac-deep"
            }`}
          >
            <Smartphone className="size-3" /> Mobile
          </button>
          <button
            type="button"
            onClick={() => setMode("story")}
            className={`px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 ${
              mode === "story"
                ? "bg-lilac-deep text-white shadow-sm"
                : "text-muted-foreground hover:text-lilac-deep"
            }`}
          >
            <Instagram className="size-3" /> Story
          </button>
        </div>

        {!isActive && (
          <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">
            Hidden
          </span>
        )}
      </div>

      {/* ─────── MODE 1: STOREFRONT PRODUCT CARD ─────── */}
      {mode === "card" && (
        <div className="w-full max-w-[290px] animate-in fade-in zoom-in-95 duration-200">
          <div className="liquid-glass group relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-3 shadow-md transition-all hover:shadow-lg">
            {/* Badge Overlay */}
            <div className="absolute top-5 left-5 z-10 flex flex-col gap-1 items-start">
              {badge ? (
                <span className="clay text-[10px] font-extrabold text-lilac-deep px-2.5 py-0.5 rounded-full shadow-sm">
                  {badge}
                </span>
              ) : (
                <span className="clay text-[10px] font-bold text-lilac-deep px-2.5 py-0.5 rounded-full shadow-sm">
                  ✨ Atelier
                </span>
              )}
              {numDiscount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                  {numDiscount}% OFF
                </span>
              )}
            </div>

            {/* Product Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-lilac/20 border border-white/60">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={name || "Preview"}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="size-full flex flex-col items-center justify-center p-4 text-center">
                  <img src={logo} alt="" className="size-12 rounded-full opacity-40 mb-2" />
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    No image added yet
                  </span>
                </div>
              )}
            </div>

            {/* Multi-Photo Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`size-8 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-lilac-deep ring-2 ring-lilac-deep/30 scale-105"
                        : "border-white/80 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info */}
            <div className="pt-2.5 px-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-lilac-deep">
                  {type || "Doll"}
                </span>
                {size ? (
                  <span className="text-[9px] text-muted-foreground bg-white/60 px-1.5 py-0.5 rounded">
                    {size}
                  </span>
                ) : (
                  <span className="text-[9px] text-muted-foreground">Handmade</span>
                )}
              </div>

              <h4 className="font-display text-sm font-bold text-foreground line-clamp-1">
                {name || "Untitled Creation"}
              </h4>

              {tagline ? (
                <p className="text-[10px] text-muted-foreground line-clamp-1 italic">{tagline}</p>
              ) : null}

              {/* Pricing */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-sm font-black text-foreground">{displaySellPrice}</span>
                {displayOrigPrice ? (
                  <span className="text-[11px] text-muted-foreground line-through">
                    {displayOrigPrice}
                  </span>
                ) : null}
              </div>

              {/* Action button mock */}
              <div className="pt-2">
                <div className="clay-primary liquid-btn w-full rounded-full py-1.5 text-center text-[10px] font-extrabold shadow-sm">
                  Add to Royal Bag
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────── MODE 2: MOBILE SCREEN SIMULATOR ─────── */}
      {mode === "mobile" && (
        <div className="w-full max-w-[290px] animate-in fade-in zoom-in-95 duration-200">
          <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-slate-800 bg-white shadow-2xl">
            {/* Phone Notch */}
            <div className="relative bg-slate-900 px-6 py-2 flex items-center justify-between text-[9px] text-white">
              <span>9:41</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>

            {/* Mobile Header */}
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-sm">
              <div className="flex items-center gap-1.5">
                <img src={logo} alt="" className="size-5 rounded-full" />
                <span className="font-display font-extrabold text-[11px] text-lilac-deep">
                  Inventive Queen
                </span>
              </div>
              <span className="text-[9px] bg-lilac/30 text-lilac-deep px-1.5 py-0.5 rounded-full font-bold">
                👑
              </span>
            </div>

            {/* Mobile Body */}
            <div className="p-3 space-y-2.5 max-h-[360px] overflow-y-auto">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-lilac/20 border border-slate-100">
                {activeImage ? (
                  <img src={activeImage} alt="" className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
                {badge && (
                  <span className="absolute top-2 left-2 bg-lilac-deep text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    {badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-1 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`size-7 rounded-md overflow-hidden border ${
                        selectedImageIndex === idx
                          ? "border-lilac-deep"
                          : "border-slate-200 opacity-60"
                      }`}
                    >
                      <img src={img} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div>
                <span className="text-[9px] font-bold text-lilac-deep uppercase tracking-wider">
                  {type || "Doll"}
                </span>
                <h3 className="font-display font-bold text-xs text-foreground line-clamp-1">
                  {name || "Untitled Creation"}
                </h3>
                {tagline && (
                  <p className="text-[9px] text-muted-foreground italic line-clamp-1">{tagline}</p>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-sm font-black text-foreground">{displaySellPrice}</span>
                {displayOrigPrice && (
                  <span className="text-[10px] text-muted-foreground line-through">
                    {displayOrigPrice}
                  </span>
                )}
                {numDiscount > 0 && (
                  <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                    {numDiscount}% OFF
                  </span>
                )}
              </div>

              {size && (
                <div className="text-[9px] bg-slate-50 p-1.5 rounded-lg text-slate-600 border border-slate-100">
                  <span className="font-bold text-slate-900">Dimensions:</span> {size}
                </div>
              )}

              {/* Sticky Action Button */}
              <div className="pt-1">
                <div className="bg-lilac-deep text-white text-center py-2 rounded-xl text-[10px] font-extrabold shadow-md">
                  Buy Now · Razorpay
                </div>
              </div>
            </div>

            {/* Phone Home Bar */}
            <div className="bg-slate-900 py-1.5 flex justify-center">
              <div className="w-24 h-1 bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* ─────── MODE 3: INSTAGRAM / STORY SHARE CARD ─────── */}
      {mode === "story" && (
        <div className="w-full max-w-[270px] animate-in fade-in zoom-in-95 duration-200">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2E1065] via-[#4C1D95] to-[#1E1B4B] p-4 text-white shadow-2xl border-2 border-amber-300/40 space-y-3">
            {/* Story Top Crest */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <img src={logo} alt="" className="size-6 rounded-full ring-1 ring-amber-300/50" />
                <div>
                  <span className="font-display text-[11px] font-extrabold text-amber-200 block leading-tight">
                    Inventive Queen
                  </span>
                  <span className="text-[8px] text-white/70 uppercase tracking-wider">
                    Handmade Atelier
                  </span>
                </div>
              </div>

              <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide shadow-sm">
                {badge || "✨ NEW"}
              </span>
            </div>

            {/* Main Product Image Frame */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner bg-black/20">
              {activeImage ? (
                <img src={activeImage} alt="" className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center text-[10px] text-white/60">
                  No photo
                </div>
              )}
              {numDiscount > 0 && (
                <div className="absolute bottom-2 right-2 bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow">
                  SAVE {numDiscount}%
                </div>
              )}
            </div>

            {/* Story Typography */}
            <div className="space-y-1 text-center">
              <h3 className="font-display font-black text-sm text-amber-100 line-clamp-1">
                {name || "Bespoke Creation"}
              </h3>
              {tagline && (
                <p className="text-[9px] text-white/80 italic line-clamp-1">"{tagline}"</p>
              )}

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-base font-black text-amber-300">{displaySellPrice}</span>
                {displayOrigPrice && (
                  <span className="text-[11px] text-white/50 line-through">{displayOrigPrice}</span>
                )}
              </div>
            </div>

            {/* Story CTA Swipe / Sticker */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 text-center border border-white/20">
              <span className="text-[9px] font-bold text-amber-200 block uppercase tracking-wider">
                👑 Link in Bio to Order
              </span>
              <span className="text-[8px] text-white/60">
                100% Handcrafted · All-India Shipping
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
