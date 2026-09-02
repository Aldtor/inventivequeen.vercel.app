import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
}

export function StatCard({ title, value, icon: Icon, accent = "bg-primary/10 text-primary" }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 shadow-luxury-sm hover:shadow-luxury border border-border/50 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
