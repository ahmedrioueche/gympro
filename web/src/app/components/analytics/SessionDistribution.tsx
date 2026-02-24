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

  const oneOnOne = distribution?.one_on_one || 0;
  const consultation = distribution?.consultation || 0;
  const checkIn = distribution?.check_in || 0;
  const assessment = distribution?.assessment || 0;

  const items = [
    {
      label: t("schedule.types.one_on_one", "1-on-1 Training"),
      value: oneOnOne,
      color: "from-purple-400 to-purple-600",
      icon: Target,
      textColor: "text-purple-500",
    },
    {
      label: t("schedule.types.consultation", "Consultation"),
      value: consultation,
      color: "from-blue-400 to-blue-600",
      icon: MessageSquare,
      textColor: "text-blue-500",
    },
    {
      label: t("schedule.types.check_in", "Check-in"),
      value: checkIn,
      color: "from-emerald-400 to-emerald-600",
      icon: CheckCircle2,
      textColor: "text-emerald-500",
    },
    {
      label: t("schedule.types.assessment", "Assessment"),
      value: assessment,
      color: "from-amber-400 to-amber-600",
      icon: Clock,
      textColor: "text-amber-500",
    },
  ];

  const total = Math.max(1, oneOnOne + consultation + checkIn + assessment);

  return (
    <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <PieChartIcon size={18} className="text-primary md:w-5 md:h-5" />
              {t("coachAnalytics.charts.sessionTypes", "Session Types")}
            </h3>
            <p className="text-xs md:text-sm font-medium text-text-secondary/80">
              {t(
                "coachAnalytics.charts.sessionTypesDesc",
                "Distribution of training methods",
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {items.map((item, idx) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={idx} className="space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-[13px] md:text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 md:p-1.5 rounded-lg bg-surface border border-border/50 ${item.textColor}`}
                    >
                      <item.icon size={12} className="md:w-3.5 md:h-3.5" />
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
                <div className="h-2 md:h-3 w-full bg-border/30 rounded-full overflow-hidden">
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
