import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "../../../../components/analytics/TrendChart";

interface RevenueChartProps {
  data?: { date: string; amount: number }[];
}

export default function RevenueChart({ data = [] }: RevenueChartProps) {
  const { t } = useTranslation();
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.analytics.charts.revenue", "Revenue Growth")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t(
              "admin.analytics.charts.revenueDesc",
              "Platform revenue over time",
            )}
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>

      <div className="h-[250px] w-full mt-4 flex flex-col items-center justify-center">
        {safeData.length > 0 ? (
          <TrendChart data={safeData} color="#10b981" height={250} />
        ) : (
          <div className="text-center py-10 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-16 h-16 rounded-[2rem] bg-surface flex items-center justify-center mb-4 border border-border shadow-inner relative group/icon mx-auto">
              <div className="absolute inset-0 bg-success/5 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-success/30 relative z-10" />
            </div>
            <p className="text-sm font-black text-text-secondary uppercase tracking-[0.15em]">
              {t("admin.analytics.charts.revenuePending", "Revenue Pending")}
            </p>
            <p className="text-[10px] text-text-secondary/60 uppercase mt-1.5 font-bold tracking-wider max-w-[200px] leading-relaxed mx-auto">
              {t(
                "admin.analytics.charts.revenuePendingDesc",
                "Waiting for platform transactions to begin",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
