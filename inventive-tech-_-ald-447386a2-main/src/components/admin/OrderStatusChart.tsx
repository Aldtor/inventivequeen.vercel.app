import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { orderStatusData } from "@/lib/dashboard-data";

export function OrderStatusChart() {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <h3 className="font-display text-base text-foreground mb-3">Order Status</h3>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {orderStatusData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(30 33% 97%)",
              border: "1px solid hsl(30 20% 88%)",
              borderRadius: 12,
              fontSize: 12,
              fontFamily: "DM Sans",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {orderStatusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.fill }} />
            <span className="font-body text-xs text-muted-foreground">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
