import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { useMySubscription } from "../../../../../hooks/queries/useSubscription";
import { useUserStore } from "../../../../../store/user";
import AlertsSection from "./components/AlertSection";
import BusinessOverview from "./components/BusinessOverview";
import GymOverview from "./components/GymOverview";
import ProfileOverview from "./components/ProfileOverview";
import QuickActions from "./components/QuickActions";

function HomePage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { data: subscription, isLoading: subLoading } = useMySubscription();

  // TODO: Replace with real API data
  const businessMetrics = {
    totalGyms: 0,
    activeMembers: 0,
    totalStaff: 0,
    monthlyRevenue: 0,
    outstandingPayments: 0,
    issues: 0,
  };

  // TODO: Replace with real API data
  const alerts: Array<{
    type: string;
    message: string;
    time: string;
    severity: "high" | "medium" | "low";
  }> = [];

  // TODO: Replace with real API data
  const lastVisitedGym: {
    name: string;
    activeMembers: number;
    todayCheckIns: number;
    revenueTrend: string;
    trendPositive: boolean;
  } | null = null;

  if (subLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Manager Profile Overview */}
      <ProfileOverview user={user} subscription={subscription} />

      {/* Business Overview */}
      <BusinessOverview metrics={businessMetrics} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Alerts & Gym Overview - Side by Side on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsSection alerts={alerts} />
        <GymOverview lastVisitedGym={lastVisitedGym} />
      </div>
    </div>
  );
}

export default HomePage;
