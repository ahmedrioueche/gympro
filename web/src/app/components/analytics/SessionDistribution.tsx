import type { SessionDistribution as SessionDistributionType } from "@ahmedrioueche/gympro-client";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  PieChart as PieChartIcon,
  Target,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SessionDistributionProps {
  distribution: SessionDistributionType;
}

export const SessionDistribution = ({
  distribution,
}: SessionDistributionProps) => {
  const { t } = useTranslation();

  const items = [
    {
      label: t("schedule.types.one_on_one", "1-on-1 Training"),
      value: distribution.one_on_one,
      color: "from-purple-400 to-purple-600",
      icon: Target,
      textColor: "text-purple-500",
    },
    {
      label: t("schedule.types.consultation", "Consultation"),
      value: distribution.consultation,
      color: "from-blue-400 to-blue-600",
      icon: MessageSquare,
      textColor: "text-blue-500",
    },
    {
      label: t("schedule.types.check_in", "Check-in"),
      value: distribution.check_in,
      color: "from-emerald-400 to-emerald-600",
      icon: CheckCircle2,
      textColor: "text-emerald-500",
    },
    {
      label: t("schedule.types.assessment", "Assessment"),
      value: distribution.assessment,
      color: "from-amber-400 to-amber-600",
      icon: Clock,
      textColor: "text-amber-500",
    },
  ];

  const total = Math.max(
    1,
    distribution.one_on_one +
      distribution.consultation +
      distribution.check_in +
      distribution.assessment,
  );

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              {t("coachAnalytics.charts.sessionTypes", "Session Types")}
            </h3>
            <p className="text-sm font-medium text-text-secondary/80">
              {t(
                "coachAnalytics.charts.sessionTypesDesc",
                "Distribution of training methods",
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {items.map((item, idx) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg bg-surface border border-border/50 ${item.textColor}`}
                    >
                      <item.icon size={14} />
                    </div>
                    <span className="font-bold text-text-primary">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-black text-text-primary">
                    {item.value}{" "}
                    <span className="text-[10px] text-text-secondary/60 font-medium ml-1">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </span>
                </div>
                <div className="h-3 w-full bg-border/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 rounded-full shadow-lg shadow-primary/5`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
