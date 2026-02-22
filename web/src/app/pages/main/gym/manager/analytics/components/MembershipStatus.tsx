import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface MembershipStatusProps {
  distribution: GymAnalytics["membershipDistribution"];
  totalMembers: number;
}

export const MembershipStatus = ({
  distribution,
  totalMembers,
}: MembershipStatusProps) => {
  const { t } = useTranslation();

  const statusItems = [
    {
      label: t("members.status.active", "Active"),
      value: distribution.active,
      color: "from-emerald-400 to-emerald-600",
      icon: CheckCircle2,
      textColor: "text-emerald-500",
    },
    {
      label: t("members.status.pending", "Pending"),
      value: distribution.pending,
      color: "from-amber-400 to-amber-600",
      icon: Clock,
      textColor: "text-amber-500",
    },
    {
      label: t("members.status.expired", "Expired"),
      value: distribution.expired,
      color: "from-red-400 to-red-600",
      icon: AlertTriangle,
      textColor: "text-red-500",
    },
    {
      label: t("members.status.banned", "Banned"),
      value: distribution.banned,
      color: "from-slate-400 to-slate-600",
      icon: XCircle,
      textColor: "text-slate-500",
    },
  ];

  const total = Math.max(1, totalMembers);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <PieChartIcon size={20} className="text-primary" />
              {t("analytics.charts.distribution", "Membership Status")}
            </h3>
            <p className="text-sm font-medium text-text-secondary/80">
              {t(
                "analytics.charts.distributionDesc",
                "Overview of current membership health",
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {statusItems.map((item, idx) => {
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
