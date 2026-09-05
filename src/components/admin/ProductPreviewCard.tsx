import { Sparkles } from "lucide-react";
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
  isActive?: boolean;
}

export function ProductPreviewCard({
  name,
  originalPrice,
  sellingPrice,
  discountPercent,
  badge,
  tagline,
  imagesText,
  type,
  isActive = true,
}: ProductPreviewCardProps) {
  const firstImage = (imagesText || "")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .find(Boolean);

  const displaySellPrice = sellingPrice?.trim() || "₹1,200";
  const displayOrigPrice = originalPrice?.trim();
  const numDiscount = Number(discountPercent) || 0;

  return (
    <div className="w-full max-w-[280px] mx-auto">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-between">
        <span>Storefront Preview</span>
        {!isActive && (
          <span className="text-rose-600 font-black">Hidden</span>
        )}
      </div>

      <div className="liquid-glass group relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 p-3 shadow-md transition-all">
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
          {firstImage ? (
            <img
              src={firstImage}
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

        {/* Product Info */}
        <div className="pt-3 px-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-lilac-deep">
              {type || "Doll"}
            </span>
            <span className="text-[9px] text-muted-foreground">Handmade</span>
          </div>

          <h4 className="font-display text-sm font-bold text-foreground line-clamp-1">
            {name || "Untitled Creation"}
          </h4>

          {tagline ? (
            <p className="text-[10px] text-muted-foreground line-clamp-1 italic">
              {tagline}
            </p>
          ) : null}

          {/* Pricing */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-black text-foreground">
              {displaySellPrice}
            </span>
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
  );
}
