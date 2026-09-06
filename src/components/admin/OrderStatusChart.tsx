import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DbOrder } from "@/lib/supabase";

interface OrderStatusChartProps {
  orders: DbOrder[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; fill: string }> = {
  pending: { label: "Pending", color: "text-amber-700 bg-amber-100", fill: "#F59E0B" },
  confirmed: { label: "Confirmed", color: "text-sky-700 bg-sky-100", fill: "#0EA5E9" },
  crafting: { label: "Crafting", color: "text-purple-700 bg-purple-100", fill: "#8B5CF6" },
  shipped: { label: "Shipped", color: "text-blue-700 bg-blue-100", fill: "#3B82F6" },
  delivered: { label: "Delivered", color: "text-emerald-700 bg-emerald-100", fill: "#10B981" },
  cancelled: { label: "Cancelled", color: "text-rose-700 bg-rose-100", fill: "#F43F5E" },
};

export function OrderStatusChart({ orders }: OrderStatusChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      crafting: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((o) => {
      const current = counts[o.status];
      if (current !== undefined) {
        counts[o.status] = current + 1;
      }
    });

    return Object.entries(counts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_CONFIG[status]?.label || status,
        rawStatus: status,
        value: count,
        color: STATUS_CONFIG[status]?.fill || "#7E57C2",
      }));
  }, [orders]);

  const totalOrders = orders.length;

  return (
    <div className="liquid-glass rounded-3xl p-6 border border-white/60 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="font-display text-base font-bold text-lilac-deep">
          Order Pipeline Distribution
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {totalOrders} total orders in workshop workflow
        </p>
      </div>

      <div className="h-48 w-full my-2">
        {!mounted ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            Loading status distribution...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            No order status data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    if (!item) return null;
                    const percent = totalOrders > 0 ? Math.round(((item.value as number) / totalOrders) * 100) : 0;
                    return (
                      <div className="rounded-xl bg-white/95 backdrop-blur-md p-2.5 border border-white shadow-lg text-xs space-y-0.5">
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-lilac-deep font-black">
                          {item.value} {item.value === 1 ? "order" : "orders"} ({percent}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/50 text-[11px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 truncate">
              <span className="size-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-muted-foreground truncate">{item.name}</span>
            </span>
            <span className="font-bold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
