import {
  Activity,
  BarChart3,
  DollarSign,
  LayoutGrid,
  PieChart as PieChartIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import { useGlobalAnalytics } from "../../../../../hooks/queries/useAnalytics";
import PageHeader from "../../../../components/PageHeader";
import AnalyticsEmptyState from "../../../../components/analytics/AnalyticsEmptyState";
import StatCard from "../../../../components/analytics/StatCard";
import TrendChart from "../../../../components/analytics/TrendChart";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data: analytics, isLoading, error } = useGlobalAnalytics();

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (!analytics) return null;

  const isEmpty = analytics.metrics.totalGyms === 0;

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title={t("analytics.title", "Business Insights")}
          subtitle={t(
            "analytics.subtitle",
            "Track performance across all your gym locations"
          )}
          icon={BarChart3}
        />

        {isLoading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : isEmpty ? (
          <AnalyticsEmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title={t("analytics.stats.revenue", "Total Revenue")}
                value={`$${analytics.metrics.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
                trend={analytics.metrics.revenueTrend}
                trendLabel={t("analytics.stats.vsLastMonth", "vs. last month")}
              />
              <StatCard
                title={t("analytics.stats.members", "Total Members")}
                value={analytics.metrics.totalMembers.toLocaleString()}
                icon={Users}
                trend={analytics.metrics.membersTrend}
                trendLabel={t("analytics.stats.vsLastMonth", "vs. last month")}
              />
              <StatCard
                title={t("analytics.stats.active", "Active Members")}
                value={analytics.metrics.activeMembers.toLocaleString()}
                icon={Activity}
              />
              <StatCard
                title={t("analytics.stats.gyms", "Total Gyms")}
                value={analytics.metrics.totalGyms}
                icon={LayoutGrid}
              />
            </div>

            {/* Analytical Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Chart Section */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {t("analytics.charts.revenueTrend", "Revenue Growth")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t(
                        "analytics.charts.revenueTrendDesc",
                        "Monthly revenue across all locations"
                      )}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="h-[250px] w-full mt-4">
                  <TrendChart
                    data={analytics.revenueTrendData}
                    color="#8b5cf6"
                    height={250}
                  />
                </div>
              </div>

              {/* Membership Distribution Section */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {t("analytics.charts.distribution", "Membership Status")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t(
                        "analytics.charts.distributionDesc",
                        "Overview of current membership health"
                      )}
                    </p>
                  </div>
                  <PieChartIcon className="w-5 h-5 text-primary" />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: t("members.status.active", "Active"),
                      value: analytics.membershipDistribution.active,
                      color: "bg-green-500",
                    },
                    {
                      label: t("members.status.pending", "Pending"),
                      value: analytics.membershipDistribution.pending,
                      color: "bg-amber-500",
                    },
                    {
                      label: t("members.status.expired", "Expired"),
                      value: analytics.membershipDistribution.expired,
                      color: "bg-red-500",
                    },
                    {
                      label: t("members.status.banned", "Banned"),
                      value: analytics.membershipDistribution.banned,
                      color: "bg-gray-500",
                    },
                  ].map((item, idx) => {
                    const total = Math.max(1, analytics.metrics.totalMembers);
                    const percentage = (item.value / total) * 100;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">
                            {item.label}
                          </span>
                          <span className="font-semibold text-text-primary">
                            {item.value} ({percentage.toFixed(1)}%)
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
