import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import { useCoachAnalytics } from "../../../../../hooks/queries/useCoaches";
import PageHeader from "../../../../components/PageHeader";
import { RecentActivity } from "./components/RecentActivity";
import { SessionTrendChart } from "./components/SessionTrendChart";
import { SessionTypeDistribution } from "./components/SessionTypeDistribution";
import { StatsGrid } from "./components/StatsGrid";

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
          title={t("coachAnalytics.title")}
          subtitle={t("coachAnalytics.subtitle")}
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
          title={t("coachAnalytics.title")}
          subtitle={t("coachAnalytics.subtitle")}
          icon={BarChart3}
        />
        <NoData
          emoji="📊"
          title={t("coachAnalytics.noData")}
          description={t("coachAnalytics.noDataDesc")}
        />
      </div>
    );
  }

  const { metrics, sessionTrendData, sessionDistribution, recentActivity } =
    analytics;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("coachAnalytics.title")}
        subtitle={t("coachAnalytics.subtitle")}
        icon={BarChart3}
      />

      <StatsGrid metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SessionTrendChart data={sessionTrendData} />
        <SessionTypeDistribution distribution={sessionDistribution} />
      </div>

      <RecentActivity activities={recentActivity} />
    </div>
  );
}
