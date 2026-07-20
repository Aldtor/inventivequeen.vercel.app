import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
}

export function StatCard({ title, value, icon: Icon, accent = "bg-brand-blush" }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-body text-xs text-muted-foreground">{title}</p>
          <p className="font-display text-xl text-foreground">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl ${accent} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-4 h-4 text-foreground/70" />
        </div>
      </div>
    </div>
  );
}
