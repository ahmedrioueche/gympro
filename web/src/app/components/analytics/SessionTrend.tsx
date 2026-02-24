import type { TrendDataPoint } from "@ahmedrioueche/gympro-client";
import { Calendar, Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "./TrendChart";

interface SessionTrendProps {
  data: TrendDataPoint[];
}

export const SessionTrend = ({ data = [] }: SessionTrendProps) => {
  const { t } = useTranslation();

  const safeData = Array.isArray(data) ? data : [];
  const totalValue = safeData.reduce(
    (acc, curr) => acc + (curr?.value || 0),
    0,
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <Calendar size={18} className="text-primary md:w-5 md:h-5" />
              {t("coachAnalytics.charts.sessionTrend", "Session Trend")}
            </h3>
            <p className="text-xs md:text-sm font-medium text-text-secondary/80">
              {t(
                "coachAnalytics.charts.sessionTrendDesc",
                "Training sessions performed over time",
              )}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <TrendingUp size={12} className="font-bold md:w-3.5 md:h-3.5" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                {totalValue} {t("common.total", "Total")}
              </span>
            </div>
          </div>
        </div>

        {safeData.length > 0 ? (
          <div className="h-[250px] md:h-[300px] w-full mt-2 md:mt-4">
            <TrendChart
              data={safeData.map((item) => ({
                date: item?.date || "",
                amount: item?.value || 0,
              }))}
              color="#ec4899"
              height={window.innerWidth < 768 ? 250 : 300}
            />
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 rounded-[2rem] bg-surface flex items-center justify-center mb-5 border border-border shadow-inner relative overflow-hidden group mx-auto">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-primary/30 relative z-10" />
            </div>
            <p className="text-sm font-black text-text-secondary uppercase tracking-[0.15em]">
              {t("coachAnalytics.charts.noTrend", "Growth Trend Pending")}
            </p>
            <p className="text-[10px] text-text-secondary/60 uppercase mt-1.5 font-bold tracking-wider max-w-[200px] leading-relaxed">
              {t(
                "coachAnalytics.charts.noTrendDesc",
                "Complete sessions to track your performance growth",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
