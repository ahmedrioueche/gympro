import type { SessionDistribution } from "@ahmedrioueche/gympro-client";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionTypeDistributionProps {
  distribution: SessionDistribution;
}

export const SessionTypeDistribution = ({
  distribution,
}: SessionTypeDistributionProps) => {
  const { t } = useTranslation();

  const items = [
    {
      label: t("schedule.types.one_on_one"),
      value: distribution.one_on_one,
      color: "bg-primary",
    },
    {
      label: t("schedule.types.consultation"),
      value: distribution.consultation,
      color: "bg-secondary",
    },
    {
      label: t("schedule.types.check_in"),
      value: distribution.check_in,
      color: "bg-accent",
    },
    {
      label: t("schedule.types.assessment"),
      value: distribution.assessment,
      color: "bg-amber-500",
    },
  ];

  const total = Math.max(
    1,
    distribution.one_on_one +
      distribution.consultation +
      distribution.check_in +
      distribution.assessment
  );

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("coachAnalytics.charts.sessionTypes")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t("coachAnalytics.charts.sessionTypesDesc")}
          </p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => {
          const percentage = (item.value / total) * 100;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">{item.label}</span>
                <span className="font-semibold text-text-primary">
                  {item.value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-1000`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
