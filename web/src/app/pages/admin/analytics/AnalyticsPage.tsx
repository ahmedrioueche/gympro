import { ErrorComponent } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../components/ui/Loading";
import { useGlobalAnalytics } from "../../../../hooks/queries/useAnalytics";
import PageHeader from "../../../components/PageHeader";
import MembershipHealth from "./components/MembershipHealth";
import RevenueChart from "./components/RevenueChart";
import StatsOverview from "./components/StatsOverview";
import TopGymsList from "./components/TopGymsList";
import UserGrowthChart from "./components/UserGrowthChart";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: analytics, isLoading, error } = useGlobalAnalytics();

  if (error) {
    return <ErrorComponent error={error.message || t("common.error")} />;
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title={t("admin.analytics.title", "Platform Analytics")}
          subtitle={t(
            "admin.analytics.subtitle",
            "Monitor platform-wide growth, revenue, and adoption",
          )}
          icon={BarChart3}
        />
        <div className="py-20">
          <Loading />
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.analytics.title", "Platform Analytics")}
        subtitle={t(
          "admin.analytics.subtitle",
          "Monitor platform-wide growth, revenue, and adoption",
        )}
        icon={BarChart3}
      />

      <StatsOverview metrics={analytics.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart data={analytics.revenueTrendData} />
        <UserGrowthChart data={analytics.memberTrendData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MembershipHealth
          distribution={analytics.membershipDistribution}
          totalMembers={analytics.metrics.totalMembers}
        />
        <TopGymsList gyms={analytics.revenueByGym} />
      </div>
    </div>
  );
}
