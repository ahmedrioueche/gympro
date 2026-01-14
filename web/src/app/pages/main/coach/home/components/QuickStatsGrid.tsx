import { type LucideIcon } from "lucide-react";

interface QuickStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
}

export default function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            {stat.trend && (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
