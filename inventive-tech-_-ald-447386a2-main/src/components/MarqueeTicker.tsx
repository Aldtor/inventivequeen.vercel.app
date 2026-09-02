const tickerItems = [
  { label: "HANDMADE AMIGURUMI", badge: true },
  { label: "CUSTOM CROCHET DOLLS & PLUSHIES", badge: false },
  { label: "FLOWERS THAT NEVER WILT", badge: false },
  { label: "SHIPPED NATIONWIDE ACROSS INDIA", badge: false },
  { label: "CUSTOM COLORWAYS & REFERENCE PHOTOS", badge: false },
  { label: "FUNKO & CHIBI STYLE DOLLS", badge: false },
  { label: "100% MILK COTTON YARN", badge: false },
  { label: "BESPOKE ROYAL COMMISSIONS", badge: false },
];

const MarqueeTicker = () => (
  <div className="relative overflow-hidden bg-purple-50/70 border-y border-purple-100 py-3">
    {/* Subtle gradient edges for smooth fade */}
    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fbf8fe] to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fbf8fe] to-transparent z-10 pointer-events-none" />

    <div className="animate-marquee">
      {/* Repeating sets for seamless infinite loop */}
      {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 mx-2 sm:mx-3 whitespace-nowrap">
          <span
            className={`px-3.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-colors ${
              item.badge
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-white/80 border border-purple-200/80 text-purple-900 shadow-sm"
            }`}
          >
            {item.label}
          </span>
          <span className="text-sm select-none opacity-80">🌸</span>
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeTicker;
