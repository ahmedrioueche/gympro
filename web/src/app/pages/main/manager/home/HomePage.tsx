import { CURRENCY_SYMBOLS } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import Loading from "../../../../../components/ui/Loading";
import { APP_PAGES } from "../../../../../constants/navigation";
import {
  useGlobalAnalytics,
  useGymAnalytics,
} from "../../../../../hooks/queries/useAnalytics";
import { useMyGyms } from "../../../../../hooks/queries/useGyms";
import { useMyNotifications } from "../../../../../hooks/queries/useNotifications";
import { useMySubscription } from "../../../../../hooks/queries/useSubscription";
import { useGymStore } from "../../../../../store/gym";
import { useUserStore } from "../../../../../store/user";
import AlertsSection from "./components/AlertSection";
import BusinessOverview from "./components/BusinessOverview";
import GymOverview from "./components/GymOverview";
import ProfileOverview from "./components/ProfileOverview";
import QuickActions from "./components/QuickActions";

function HomePage() {
  const { user } = useUserStore();
  const { data: subscription, isLoading: subLoading } = useMySubscription();
  const { setGym } = useGymStore();
  const navigate = useNavigate();
  // Real Data Fetching
  const { data: globalStats, isLoading: statsLoading } = useGlobalAnalytics();
  const { data: myGyms, isLoading: gymsLoading } = useMyGyms();
  const { data: notificationsRes, isLoading: notificationsLoading } =
    useMyNotifications(1, 5);

  const { data: gymStats, isLoading: gymStatsLoading } = useGymAnalytics(
    myGyms?.[0]?._id || "",
  );

  const isPageLoading =
    statsLoading || gymsLoading || notificationsLoading || gymStatsLoading;

  const businessMetrics = {
    totalGyms: Math.max(
      globalStats?.metrics.totalGyms || 0,
      myGyms?.length || 0,
    ),
    activeMembers: globalStats?.metrics.activeMembers || 0,
    totalRevenue: globalStats?.metrics.totalRevenue || 0,
    monthlyRevenue: globalStats?.metrics.monthlyRevenue || 0,
    currency: CURRENCY_SYMBOLS[user?.appSettings?.locale?.currency || "USD"],
    totalStaff: undefined,
    outstandingPayments: undefined,
    issues: undefined,
  };

  const alerts =
    notificationsRes?.data?.data.map((n) => ({
      type: n.type,
      message: n.title,
      time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
      severity: (n.priority || "low") as "high" | "medium" | "low",
    })) || [];

  return (
    <div className="space-y-6">
      {subLoading ? (
        <Loading />
      ) : (
        <ProfileOverview user={user} subscription={subscription} />
      )}

      {isPageLoading ? (
        <Loading />
      ) : (
        <>
          {/* Business Overview */}
          <BusinessOverview metrics={businessMetrics} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Alerts & Gym Overview - Side by Side on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsSection alerts={alerts} />
            <GymOverview
              gyms={myGyms}
              onGymAccessed={(gym) => {
                setGym(gym);
                navigate({ to: APP_PAGES.gym.manager.home.link });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
