import { type MembershipDistribution } from "@ahmedrioueche/gympro-client";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MembershipHealthProps {
  distribution: MembershipDistribution;
  totalMembers: number;
}

export default function MembershipHealth({
  distribution,
  totalMembers,
}: MembershipHealthProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.analytics.charts.distribution", "Membership Health")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t(
              "admin.analytics.charts.distributionDesc",
              "Status of all memberships on the platform",
            )}
          </p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>

      <div className="space-y-4">
        {[
          {
            label: t("members.status.active", "Active"),
            value: distribution.active,
            color: "bg-green-500",
          },
          {
            label: t("members.status.pending", "Pending"),
            value: distribution.pending,
            color: "bg-amber-500",
          },
          {
            label: t("members.status.expired", "Expired"),
            value: distribution.expired,
            color: "bg-red-500",
          },
          {
            label: t("members.status.banned", "Banned"),
            value: distribution.banned,
            color: "bg-gray-500",
          },
        ].map((item, idx) => {
          const total = Math.max(1, totalMembers);
          const percentage = (item.value / total) * 100;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">{item.label}</span>
                <span className="font-semibold text-text-primary">
                  {item.value.toLocaleString()} ({percentage.toFixed(1)}%)
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
}
