import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import { Activity, TrendingUp, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../../../../../../components/analytics/StatCard";

interface StatsOverviewProps {
  metrics: GymAnalytics["metrics"];
}

export const StatsOverview = ({ metrics }: StatsOverviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      <StatCard
        title={t("analytics.gym.stats.totalMembers", "Total Members")}
        value={metrics.totalMembers.toLocaleString()}
        icon={Users}
        color="from-purple-500 to-pink-600"
        description={t("analytics.gym.stats.totalDesc", "Total registered")}
      />
      <StatCard
        title={t("analytics.gym.stats.activeMembers", "Active Members")}
        value={metrics.activeMembers.toLocaleString()}
        icon={UserCheck}
        color="from-emerald-500 to-teal-600"
        description={t("analytics.gym.stats.activeDesc", "Currently active")}
      />
      <StatCard
        title={t("analytics.gym.stats.expiredMembers", "Expired Members")}
        value={metrics.expiredMembers.toLocaleString()}
        icon={Activity}
        color="from-red-500 to-rose-600"
        description={t("analytics.gym.stats.expiredDesc", "Need renewal")}
      />
      <StatCard
        title={t("analytics.gym.stats.checkedIn", "Checked In Today")}
        value={metrics.checkedIn.toLocaleString()}
        icon={TrendingUp}
        color="from-blue-500 to-indigo-600"
        description={t("analytics.gym.stats.checkedInDesc", "Daily attendance")}
      />
      <StatCard
        title={t("analytics.gym.stats.coachesCount", "Coaches Count")}
        value={metrics.coachesCount.toLocaleString()}
        icon={UserCheck}
        color="from-orange-500 to-amber-600"
        description={t("analytics.gym.stats.staffDesc", "Active staff")}
      />
    </div>
  );
};
