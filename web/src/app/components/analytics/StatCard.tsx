import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  isLoading?: boolean;
  loading?: boolean;
  color?: "primary" | "success" | "warning" | "danger" | "secondary";
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  isLoading,
  loading,
  color = "primary",
}: StatCardProps) {
  const isActuallyLoading = isLoading || loading;

  if (isActuallyLoading) {
    return (
      <div className="bg-surface border border-border p-6 rounded-2xl animate-pulse">
        <div className="w-10 h-10 bg-border rounded-xl mb-4" />
        <div className="h-4 w-24 bg-border rounded mb-2" />
        <div className="h-8 w-16 bg-border rounded" />
      </div>
    );
  }

  const isPositive = trend && trend > 0;

  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-text-primary tracking-tight">
          {value}
        </h3>
        {trendLabel && (
          <p className="text-xs text-text-secondary mt-2">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
