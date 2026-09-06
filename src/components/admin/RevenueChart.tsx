import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DbOrder } from "@/lib/supabase";

interface RevenueChartProps {
  orders: DbOrder[];
}

type TimeRange = "7d" | "30d" | "all";

export function RevenueChart({ orders }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    const daysLimit = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    // Filter paid orders within range
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - daysLimit);

    const dateMap: Record<string, { date: string; revenue: number; ordersCount: number }> = {};

    // Initialize all days in range for smooth line
    const daysToGenerate = Math.min(daysLimit, 30);
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const displayLabel = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      dateMap[key] = { date: displayLabel, revenue: 0, ordersCount: 0 };
    }

    orders.forEach((order) => {
      if (order.payment_status !== "paid" && order.status === "cancelled") return;
      const orderDate = new Date(order.created_at);
      const key = orderDate.toISOString().slice(0, 10);

      const existing = dateMap[key];
      if (existing) {
        existing.revenue += order.amount_total || 0;
        existing.ordersCount += 1;
      } else if (timeRange === "all" || orderDate >= cutoff) {
        const displayLabel = orderDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
        dateMap[key] = {
          date: displayLabel,
          revenue: order.amount_total || 0,
          ordersCount: 1,
        };
      }
    });

    return Object.values(dateMap);
  }, [orders, timeRange]);

  const totalPeriodRevenue = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [chartData]);

  const totalPeriodOrders = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.ordersCount, 0);
  }, [chartData]);

  return (
    <div className="liquid-glass rounded-3xl p-6 border border-white/60 shadow-sm space-y-4">
      {/* Header with Title and Range Picker */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-display text-base font-bold text-lilac-deep">
              Revenue Analytics &amp; Growth
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Total in period:{" "}
            <strong className="text-emerald-700 font-bold">
              ₹{totalPeriodRevenue.toLocaleString("en-IN")}
            </strong>{" "}
            across {totalPeriodOrders} paid orders
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center bg-white/70 rounded-full p-1 border border-white/80 text-xs font-bold">
          {(
            [
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "all", label: "All Time" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              className={`px-3 py-1 rounded-full transition-all ${
                timeRange === t.id
                  ? "bg-lilac-deep text-white shadow-sm"
                  : "text-muted-foreground hover:text-lilac-deep"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 w-full pt-2">
        {!mounted ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
            Initializing chart metrics...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7E57C2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7E57C2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#64748B" }}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length && payload[0]) {
                    const item = payload[0].payload;
                    if (!item) return null;
                    return (
                      <div className="rounded-xl bg-white/95 backdrop-blur-md p-3 border border-white shadow-lg text-xs space-y-1">
                        <p className="font-bold text-lilac-deep">{label}</p>
                        <p className="text-emerald-700 font-extrabold text-sm">
                          ₹{Number(item.revenue || 0).toLocaleString("en-IN")}
                        </p>
                        <p className="text-muted-foreground text-[10px]">
                          {item.ordersCount} {item.ordersCount === 1 ? "order" : "orders"} placed
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7E57C2"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
