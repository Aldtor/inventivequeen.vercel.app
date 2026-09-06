import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  accent?: string;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  accent = "bg-lilac/30 text-lilac-deep",
  subtitle,
}: StatCardProps) {
  return (
    <div className="liquid-glass rounded-2xl p-5 shadow-sm border border-white/60 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="font-display text-2xl font-black text-lilac-deep">{value}</p>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div
          className={`size-11 rounded-xl ${accent} flex items-center justify-center shadow-sm flex-shrink-0`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
