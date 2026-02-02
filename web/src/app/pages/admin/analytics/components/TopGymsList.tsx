import type { RevenueByGym } from "@ahmedrioueche/gympro-client";
import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TopGymsListProps {
  gyms: RevenueByGym[];
}

export default function TopGymsList({ gyms }: TopGymsListProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
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

      <div className="space-y-4">
        {gyms.slice(0, 5).map((item, idx) => {
          const maxRevenue = Math.max(1, ...gyms.map((g) => g.revenue));
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
        })}
      </div>
    </div>
  );
}
