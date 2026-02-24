import { TrendingUp, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg?: string; // Kept for types but replaced with color gradients
  trend?: string;
  gradient: string;
  description?: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
}

export default function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 cursor-default"
        >
          {/* Background Gradient Glow */}
          <div
            className={`absolute -right-10 -top-10 h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
          />

          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center justify-between">
              <div
                className={`p-2.5 md:p-3 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg shadow-primary/10 transition-transform group-hover:scale-110 duration-500`}
              >
                <item.icon size={20} className="md:w-6 md:h-6" />
              </div>
              {item.trend && (
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold">
                  <TrendingUp size={10} className="md:w-3 md:h-3" />
                  <span>{item.trend}</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-xl md:text-3xl font-black text-text-primary tracking-tight">
                {item.value}
              </p>
              <p className="text-[11px] md:text-sm font-bold text-text-secondary mt-0.5 md:mt-1">
                {item.label}
              </p>
              {item.description && (
                <p className="hidden md:block text-[10px] text-text-secondary/60 mt-1 uppercase tracking-wider font-medium">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
