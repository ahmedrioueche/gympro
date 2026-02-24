import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { useCoachAnalytics } from "../../../../../hooks/queries/useCoaches";
import PageHeader from "../../../../components/PageHeader";
import { ActivityFeed } from "../../../../components/analytics/ActivityFeed";
import { SessionDistribution } from "../../../../components/analytics/SessionDistribution";
import { SessionTrend } from "../../../../components/analytics/SessionTrend";
import { StatsOverview } from "../../../../components/analytics/StatsOverview";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: analytics, isLoading, error } = useCoachAnalytics();

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title={t("coachAnalytics.title", "Coach Analytics")}
          subtitle={t(
            "coachAnalytics.subtitle",
            "Track your coaching performance and client growth",
          )}
          icon={BarChart3}
        />
        <div className="py-20">
          <Loading />
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-8">
        <PageHeader
          title={t("coachAnalytics.title", "Coach Analytics")}
          subtitle={t(
            "coachAnalytics.subtitle",
            "Track your coaching performance and client growth",
          )}
          icon={BarChart3}
        />
        <NoData
          emoji="📊"
          title={t("coachAnalytics.noData", "No analytics data available")}
          description={t(
            "coachAnalytics.noDataDesc",
            "Start coaching to see your business growth metrics here",
          )}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      <PageHeader
        title={t("coachAnalytics.title", "Coach Analytics")}
        subtitle={t(
          "coachAnalytics.subtitle",
          "Track your coaching performance and client growth",
        )}
        icon={BarChart3}
      />

      <StatsOverview metrics={analytics.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <SessionTrend data={analytics.sessionTrendData || []} />
        <SessionDistribution
          distribution={analytics.sessionDistribution || []}
        />
      </div>

      <ActivityFeed activities={analytics.recentActivity || []} />
    </div>
  );
}
