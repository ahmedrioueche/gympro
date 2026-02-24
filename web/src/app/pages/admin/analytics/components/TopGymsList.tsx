import type { RevenueByGym } from "@ahmedrioueche/gympro-client";
import { Dumbbell, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TopGymsListProps {
  gyms?: RevenueByGym[];
}

export default function TopGymsList({ gyms = [] }: TopGymsListProps) {
  const { t } = useTranslation();
  const safeGyms = Array.isArray(gyms) ? gyms : [];

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.analytics.charts.topGyms", "Top Performing Gyms")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t(
              "admin.analytics.charts.topGymsDesc",
              "Highest revenue contributors",
            )}
          </p>
        </div>
        <Dumbbell className="w-5 h-5 text-warning" />
      </div>

      <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
        {safeGyms.length > 0 ? (
          safeGyms.slice(0, 5).map((item, idx) => {
            const maxRevenue = Math.max(1, ...safeGyms.map((g) => g.revenue));
            const percentage = (item.revenue / maxRevenue) * 100;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary truncate max-w-[200px]">
                    {item.gymName}
                  </span>
                  <span className="font-semibold text-text-primary">
                    {item.revenue.toLocaleString()} {item.currency}
                  </span>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-16 h-16 rounded-[2rem] bg-surface flex items-center justify-center mb-4 border border-border shadow-inner relative group/icon mx-auto">
              <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover/icon:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-warning/30 relative z-10" />
            </div>
            <p className="text-sm font-black text-text-secondary uppercase tracking-[0.15em]">
              {t(
                "admin.analytics.charts.gymRankingsPending",
                "Gym Rankings Pending",
              )}
            </p>
            <p className="text-[10px] text-text-secondary/60 uppercase mt-1.5 font-bold tracking-wider max-w-[250px] leading-relaxed mx-auto">
              {t(
                "admin.analytics.charts.gymRankingsPendingDesc",
                "Top performing gyms will be listed here",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
