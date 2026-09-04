import { Sparkles, Crown } from "lucide-react";

const tickerItems = [
  { label: "100% MILK COTTON YARN", highlight: true },
  { label: "BESPOKE ROYAL COMMISSIONS", highlight: false },
  { label: "FLOWERS THAT NEVER WILT", highlight: false },
  { label: "CUSTOM ANIME & CHIBI DOLLS", highlight: true },
  { label: "FREE WAX SEAL & GIFT WRAPPING", highlight: false },
  { label: "SHIPPED SAFELY ACROSS INDIA", highlight: false },
  { label: "REFERENCE PHOTOS WELCOME", highlight: true },
  { label: "HANDMADE IN ATELIER", highlight: false },
];

const MarqueeTicker = () => (
  <div className="relative overflow-hidden bg-gradient-to-r from-purple-100/70 via-pink-50/60 to-purple-100/70 border-y border-purple-200/60 py-3.5 shadow-inner">
    {/* Gradient fade edges */}
    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

    <div className="animate-marquee flex items-center">
      {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-3 mx-3 whitespace-nowrap">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
              item.highlight
                ? "bg-purple-700 text-white shadow-sm"
                : "bg-white/90 border border-purple-200 text-purple-950 shadow-xs"
            }`}
          >
            {item.highlight ? <Crown size={12} className="text-amber-300" /> : <Sparkles size={11} className="text-purple-600" />}
            <span>{item.label}</span>
          </span>
          <span className="text-amber-400 select-none text-xs">✦</span>
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeTicker;
