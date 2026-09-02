const tickerItems = [
  "✨ Handmade Crochet Dolls",
  "💐 Everlasting Flower Bouquets",
  "🔑 Cute Amigurumi Keychains",
  "🧸 Custom Plushies & Characters",
  "👑 Royal Bespoke Commissions",
  "🎀 Milk Cotton Yarn",
  "📦 Pan-India Shipping",
  "🪄 Send Any Reference Photo",
  "✨ 100% Handcrafted with Love",
  "🌸 Aesthetic Gift Packaging",
];

const MarqueeTicker = () => (
  <div className="relative overflow-hidden bg-secondary/40 border-b border-border/30 py-3.5">
    {/* Fade edges */}
    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-secondary/60 to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-secondary/60 to-transparent z-10 pointer-events-none" />

    <div className="animate-marquee">
      {/* Duplicate items for seamless loop */}
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} className="flex items-center gap-3 mx-4 whitespace-nowrap">
          <span className="font-body text-xs sm:text-sm font-medium text-foreground/70 tracking-wide">
            {item}
          </span>
          <span className="w-1 h-1 rounded-full bg-primary/30 flex-shrink-0" />
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeTicker;
