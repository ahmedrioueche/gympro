import type { CoachMetrics } from "@ahmedrioueche/gympro-client";
import { Activity, Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

interface StatsOverviewProps {
  metrics: CoachMetrics;
}

export const StatsOverview = ({ metrics }: StatsOverviewProps) => {
  const { t } = useTranslation();

  // Helper to ensure values are safe
  const activeClients = metrics?.activeClients ?? 0;
  const totalSessions = metrics?.totalSessions ?? 0;
  const completionRate = metrics?.sessionCompletionRate ?? 0;
  const totalHours = metrics?.totalSessionHours ?? 0;
  const weeklyAvg = metrics?.averageSessionsPerWeek ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
      <StatCard
        title={t("coachAnalytics.stats.activeClients", "Active Clients")}
        value={activeClients.toString()}
        icon={Users}
        color="from-purple-500 to-pink-600"
        trend={metrics?.clientsTrend ?? 0}
        description={t("coachAnalytics.stats.vsLastMonth", "vs last month")}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalSessions", "Total Sessions")}
        value={totalSessions.toString()}
        icon={Calendar}
        color="from-blue-500 to-indigo-600"
        trend={metrics?.sessionsTrend ?? 0}
        description={t("coachAnalytics.stats.vsLastMonth", "vs last month")}
      />
      <StatCard
        title={t("coachAnalytics.stats.completionRate", "Completion Rate")}
        value={`${completionRate}%`}
        icon={Activity}
        color="from-emerald-500 to-teal-600"
        description={t(
          "coachAnalytics.stats.sessionsDone",
          "Sessions completed",
        )}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalHours", "Total Hours")}
        value={`${Math.round(totalHours)}h`}
        icon={Clock}
        color="from-orange-500 to-amber-600"
        description={t("coachAnalytics.stats.hoursTaught", "Hours taught")}
      />
      <StatCard
        title={t("coachAnalytics.stats.weeklyAvg", "Weekly Average")}
        value={weeklyAvg.toString()}
        icon={TrendingUp}
        color="from-rose-500 to-red-600"
        description={t("coachAnalytics.stats.avgSessions", "Sessions per week")}
      />
    </div>
  );
};
