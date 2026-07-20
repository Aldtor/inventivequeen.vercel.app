import { recentOrders } from "@/lib/dashboard-data";

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-sky-100 text-sky-700",
  shipped: "bg-pink-100 text-pink-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

export function RecentOrders() {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <h3 className="font-display text-base text-foreground mb-3">Recent Orders</h3>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {recentOrders.map((o) => (
          <div key={o.id} className="bg-background rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-body text-sm text-foreground font-medium">{o.customer}</p>
                <p className="font-body text-xs text-muted-foreground">{o.product}</p>
              </div>
              <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-full capitalize ${statusColor[o.status]}`}>
                {o.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-xs text-muted-foreground">{o.date}</span>
              <span className="font-display text-sm text-foreground">₹{o.amount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="text-left font-body text-xs text-muted-foreground font-medium py-2 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="font-body text-sm text-foreground py-2.5 pr-4">{o.customer}</td>
                <td className="font-body text-sm text-muted-foreground py-2.5 pr-4">{o.product}</td>
                <td className="font-body text-sm text-foreground py-2.5 pr-4 tabular-nums">₹{o.amount}</td>
                <td className="py-2.5 pr-4">
                  <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-full capitalize ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="font-body text-xs text-muted-foreground py-2.5">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
