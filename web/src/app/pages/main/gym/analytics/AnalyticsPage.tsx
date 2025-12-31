import {
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../components/ui/Error";
import Loading from "../../../../../components/ui/Loading";
import { useGymAnalytics } from "../../../../../hooks/queries/useAnalytics";
import { useGymStore } from "../../../../../store/gym";
import PageHeader from "../../../../components/PageHeader";
import StatCard from "../../../../components/analytics/StatCard";
import TrendChart from "../../../../components/analytics/TrendChart";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const {
    data: analytics,
    isLoading,
    error,
  } = useGymAnalytics(currentGym?._id || "");

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (!currentGym || !analytics) return null;

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          title={t("analytics.gym.title", "Gym Analytics")}
          subtitle={t(
            "analytics.gym.subtitle",
            "Track performance and member activity for this location"
          )}
          icon={BarChart3}
        />

        {isLoading ? (
          <div className="py-20">
            <Loading />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                title={t("analytics.gym.stats.totalMembers", "Total Members")}
                value={analytics.metrics.totalMembers.toLocaleString()}
                icon={Users}
              />
              <StatCard
                title={t("analytics.gym.stats.activeMembers", "Active Members")}
                value={analytics.metrics.activeMembers.toLocaleString()}
                icon={UserCheck}
              />
              <StatCard
                title={t(
                  "analytics.gym.stats.expiredMembers",
                  "Expired Members"
                )}
                value={analytics.metrics.expiredMembers.toLocaleString()}
                icon={Activity}
              />
              <StatCard
                title={t("analytics.gym.stats.checkedIn", "Checked In Today")}
                value={analytics.metrics.checkedIn.toLocaleString()}
                icon={TrendingUp}
              />
              <StatCard
                title={t("analytics.gym.stats.occupancy", "Occupancy Rate")}
                value={`${analytics.metrics.occupancyRate}%`}
                icon={PieChartIcon}
              />
            </div>

            {/* Analytical Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Attendance Trend Chart */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {t("analytics.gym.charts.attendance", "Attendance Trend")}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {t(
                        "analytics.gym.charts.attendanceDesc",
                        "Daily check-ins over time"
                      )}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="h-[250px] w-full mt-4">
                  <TrendChart
                    data={analytics.attendanceTrend.map((item) => ({
                      date: item.date,
                      amount: item.count,
                    }))}
                    color="#8b5cf6"
                    height={250}
                  />
                </div>
              </div>

              {/* Membership Distribution */}
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

            {/* Gender Distribution */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {t(
                      "analytics.gym.charts.genderDist",
                      "Gender Distribution"
                    )}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {t(
                      "analytics.gym.charts.genderDistDesc",
                      "Member demographics breakdown"
                    )}
                  </p>
                </div>
                <Users className="w-5 h-5 text-primary" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: t("home.gym.genderSplit.male", "Male"),
                    value: analytics.genderDistribution.male,
                    color: "bg-blue-500",
                    textColor: "text-blue-500",
                    bgColor: "bg-blue-500/10",
                  },
                  {
                    label: t("home.gym.genderSplit.female", "Female"),
                    value: analytics.genderDistribution.female,
                    color: "bg-pink-500",
                    textColor: "text-pink-500",
                    bgColor: "bg-pink-500/10",
                  },
                ].map((item, idx) => {
                  const total = Math.max(1, analytics.metrics.totalMembers);
                  const percentage = (item.value / total) * 100;
                  return (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text-secondary">
                            {item.label}
                          </span>
                          <span
                            className={`text-2xl font-black ${item.textColor}`}
                          >
                            {item.value}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold ${item.bgColor} ${item.textColor} px-2 py-1 rounded-lg`}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
