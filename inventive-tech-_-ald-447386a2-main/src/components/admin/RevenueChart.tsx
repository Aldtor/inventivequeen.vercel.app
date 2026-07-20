import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dailyRevenue, weeklyRevenue, monthlyRevenue } from "@/lib/dashboard-data";

const tabs = [
  { key: "daily", label: "Daily", data: dailyRevenue },
  { key: "weekly", label: "Weekly", data: weeklyRevenue },
  { key: "monthly", label: "Monthly", data: monthlyRevenue },
] as const;

export function RevenueChart() {
  const [active, setActive] = useState<"daily" | "weekly" | "monthly">("daily");
  const current = tabs.find((t) => t.key === active)!;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base text-foreground">Sales Analytics</h3>
        <div className="flex gap-1 bg-secondary rounded-xl p-0.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1 rounded-lg text-xs font-body transition-all duration-200 ${
                active === t.key
                  ? "bg-card text-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={current.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 20% 88%)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "hsl(20 8% 50%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "hsl(20 8% 50%)" }}
            axisLine={false}
            tickLine={false}
            width={45}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(30 33% 97%)",
              border: "1px solid hsl(30 20% 88%)",
              borderRadius: 12,
              fontSize: 12,
              fontFamily: "DM Sans",
            }}
            formatter={(value: number) => [`₹${value}`, "Revenue"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(350 35% 58%)"
            strokeWidth={2.5}
            dot={{ fill: "hsl(350 35% 58%)", r: 3 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
