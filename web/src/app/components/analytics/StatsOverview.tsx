import type { CoachMetrics } from "@ahmedrioueche/gympro-client";
import { Activity, Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

interface StatsOverviewProps {
  metrics: CoachMetrics;
}

export const StatsOverview = ({ metrics }: StatsOverviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title={t("coachAnalytics.stats.activeClients", "Active Clients")}
        value={metrics.activeClients.toString()}
        icon={Users}
        color="from-purple-500 to-pink-600"
        trend={metrics.clientsTrend}
        description={t("coachAnalytics.stats.vsLastMonth", "vs last month")}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalSessions", "Total Sessions")}
        value={metrics.totalSessions.toString()}
        icon={Calendar}
        color="from-blue-500 to-indigo-600"
        trend={metrics.sessionsTrend}
        description={t("coachAnalytics.stats.vsLastMonth", "vs last month")}
      />
      <StatCard
        title={t("coachAnalytics.stats.completionRate", "Completion Rate")}
        value={`${metrics.sessionCompletionRate}%`}
        icon={Activity}
        color="from-emerald-500 to-teal-600"
        description={t(
          "coachAnalytics.stats.sessionsDone",
          "Sessions completed",
        )}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalHours", "Total Hours")}
        value={`${Math.round(metrics.totalSessionHours)}h`}
        icon={Clock}
        color="from-orange-500 to-amber-600"
        description={t("coachAnalytics.stats.hoursTaught", "Hours taught")}
      />
      <StatCard
        title={t("coachAnalytics.stats.weeklyAvg", "Weekly Average")}
        value={metrics.averageSessionsPerWeek.toString()}
        icon={TrendingUp}
        color="from-rose-500 to-red-600"
        description={t("coachAnalytics.stats.avgSessions", "Sessions per week")}
      />
    </div>
  );
};
