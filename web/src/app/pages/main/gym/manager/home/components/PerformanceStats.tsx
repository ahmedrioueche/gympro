import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import { BarChart3, Clock, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../../../../../../components/analytics/StatCard";

interface PerformanceStatsProps {
  analytics: GymAnalytics | undefined;
  isLoading: boolean;
}

export function PerformanceStats({
  analytics,
  isLoading,
}: PerformanceStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-border">
        <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          {t("home.gym.stats.title")}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {t("home.gym.stats.subtitle")}
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("home.gym.stats.totalMembers")}
          value={analytics?.metrics.totalMembers || 0}
          icon={Users}
          loading={isLoading}
          color="secondary"
        />
        <StatCard
          title={t("home.gym.stats.activeMembers")}
          value={analytics?.metrics.activeMembers || 0}
          icon={UserCheck}
          color="success"
          loading={isLoading}
        />
        <StatCard
          title={t("home.gym.stats.coachesCount")}
          value={analytics?.metrics.coachesCount || 0}
          icon={UserCheck}
          color="warning"
          loading={isLoading}
        />
        <StatCard
          title={t("home.gym.stats.checkedIn")}
          value={analytics?.metrics.checkedIn || 0}
          icon={Clock}
          color="primary"
          loading={isLoading}
        />
      </div>
    </div>
  );
}
