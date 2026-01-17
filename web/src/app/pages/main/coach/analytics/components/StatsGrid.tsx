import type { CoachMetrics } from "@ahmedrioueche/gympro-client";
import { Activity, Calendar, Clock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../../../../../components/analytics/StatCard";

interface StatsGridProps {
  metrics: CoachMetrics;
}

export const StatsGrid = ({ metrics }: StatsGridProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title={t("coachAnalytics.stats.activeClients")}
        value={metrics.activeClients.toString()}
        icon={Users}
        trend={metrics.clientsTrend}
        trendLabel={t("coachAnalytics.stats.vsLastMonth")}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalSessions")}
        value={metrics.totalSessions.toString()}
        icon={Calendar}
        trend={metrics.sessionsTrend}
        trendLabel={t("coachAnalytics.stats.vsLastMonth")}
      />
      <StatCard
        title={t("coachAnalytics.stats.completionRate")}
        value={`${metrics.sessionCompletionRate}%`}
        icon={Activity}
      />
      <StatCard
        title={t("coachAnalytics.stats.totalHours")}
        value={`${metrics.totalSessionHours}h`}
        icon={Clock}
      />
    </div>
  );
};
