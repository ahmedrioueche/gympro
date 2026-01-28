import Loading from "../../../../../../components/ui/Loading";
import NotFound from "../../../../../../components/ui/NotFound";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import GymCoachAnnouncementsSection from "./components/GymCoachAnnouncementsSection";
import GymCoachQuickActions from "./components/GymCoachQuickActions";
import GymCoachQuickStats from "./components/GymCoachQuickStats";
import GymCoachRecentActivity from "./components/GymCoachRecentActivity";
import GymCoachTodaySessions from "./components/GymCoachTodaySessions";
import { useGymCoachHome } from "./hooks/useGymCoachHome";
import { useGymCoachHomeData } from "./hooks/useGymCoachHomeData";

export default function HomePage() {
  const { gym, isGymLoading, status } = useGymCoachHome();
  const { stats, isStatsLoading, recentActivity, isRecentActivityLoading } =
    useGymCoachHomeData();

  if (isGymLoading) {
    return <Loading />;
  }

  if (!gym) {
    return (
      <NotFound
        text="Gym not found"
        subtext="The gym you are looking for does not exist or you do not have access to it."
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Gym Hero Section */}
      <GymHeroSection gym={gym} status={status} />

      {/* Quick Stats Grid */}
      <GymCoachQuickStats stats={stats} isLoading={isStatsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Row: Sessions, Actions, Announcements */}
        <div className="lg:col-span-1">
          <GymCoachTodaySessions />
        </div>
        <div className="lg:col-span-1">
          <GymCoachQuickActions />
        </div>
        <div className="lg:col-span-1">
          <GymCoachAnnouncementsSection gymId={gym._id} />
        </div>

        {/* Bottom Row: Recent Activity */}
        <div className="lg:col-span-3 space-y-6">
          <GymCoachRecentActivity
            activities={recentActivity}
            isLoading={isRecentActivityLoading}
          />
        </div>
      </div>
    </div>
  );
}
