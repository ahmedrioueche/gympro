import { ErrorComponent } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import { useGymAnalytics } from "../../../../../../hooks/queries/useAnalytics";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import { AttendanceTrend } from "./components/AttendanceTrend";
import { GenderSplit } from "./components/GenderSplit";
import { MembershipStatus } from "./components/MembershipStatus";
import { StatsOverview } from "./components/StatsOverview";

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
    <div className="space-y-8">
      <PageHeader
        title={t("analytics.gym.title", "Gym Analytics")}
        subtitle={t(
          "analytics.gym.subtitle",
          "Track performance and member activity for this location",
        )}
        icon={BarChart3}
      />

      {isLoading ? (
        <div className="py-20">
          <Loading />
        </div>
      ) : (
        <>
          <StatsOverview metrics={analytics.metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AttendanceTrend data={analytics.attendanceTrend} />
            <MembershipStatus
              distribution={analytics.membershipDistribution}
              totalMembers={analytics.metrics.totalMembers}
            />
          </div>

          <GenderSplit
            distribution={analytics.genderDistribution}
            totalMembers={analytics.metrics.totalMembers}
          />
        </>
      )}
    </div>
  );
}
