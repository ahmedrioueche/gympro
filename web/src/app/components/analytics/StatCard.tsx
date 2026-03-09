import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  description?: string;
  isLoading?: boolean;
  loading?: boolean;
  color?: string; // Expecting "from-X to-Y" gradient classes
  shadowColor?: string; // Expecting tailwind shadow color class
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  isLoading,
  loading,
  color = "from-primary/20 to-primary/10",
  shadowColor = "shadow-primary/10",
}: StatCardProps) {
  const isActuallyLoading = isLoading || loading;

  if (isActuallyLoading) {
    return (
      <div className="bg-surface border border-border p-4 md:p-6 rounded-2xl md:rounded-3xl animate-pulse">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-border rounded-xl mb-3 md:mb-4" />
        <div className="h-3 md:h-4 w-20 md:w-24 bg-border rounded mb-2" />
        <div className="h-6 md:h-8 w-14 md:w-16 bg-border rounded" />
      </div>
    );
  }

  const isPositive = trend !== undefined && trend > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 cursor-default">
      {/* Background Gradient Glow */}
      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
      />

      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg ${shadowColor} transition-transform group-hover:scale-110 duration-500`}
          >
            <Icon size={20} className="md:hidden" />
            <Icon size={24} className="hidden md:block" />
          </div>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                isPositive
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-red-500 bg-red-500/10"
              }`}
            >
              {isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
            {value}
          </h3>
          <p className="text-xs md:text-sm font-bold text-text-secondary mt-0.5 md:mt-1">
            {title}
          </p>
          {(description || trendLabel) && (
            <p className="text-[10px] text-text-secondary/60 mt-1 uppercase tracking-wider font-medium">
              {description || trendLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
