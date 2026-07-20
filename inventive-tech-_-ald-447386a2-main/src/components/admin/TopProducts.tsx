import { topProducts } from "@/lib/dashboard-data";

export function TopProducts() {
  const max = topProducts[0]?.orders ?? 1;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <h3 className="font-display text-base text-foreground mb-3">Top Products</h3>
      <div className="space-y-3">
        {topProducts.map((p, i) => (
          <div key={p.name} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="font-body text-sm text-foreground">{p.name}</span>
              <span className="font-body text-xs text-muted-foreground tabular-nums">
                {p.orders} orders
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(p.orders / max) * 100}%`,
                  background: i === 0 ? "hsl(350 35% 58%)" : "hsl(28 40% 85%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
