import Loading from "../../../../../../components/ui/Loading";
import NotFound from "../../../../../../components/ui/NotFound";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import PendingCheckIns from "../../../coach/home/components/PendingCheckIns";
import GymCoachQuickActions from "./components/GymCoachQuickActions";
import GymCoachQuickStats from "./components/GymCoachQuickStats";
import GymCoachRecentActivity from "./components/GymCoachRecentActivity";
import GymCoachTodaySessions from "./components/GymCoachTodaySessions";
import { useGymCoachHome } from "./hooks/useGymCoachHome";

export default function HomePage() {
  const { gym, isGymLoading, status } = useGymCoachHome();

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
      <GymCoachQuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Sessions & Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <GymCoachTodaySessions />
          <GymCoachQuickActions />
        </div>

        {/* Right Column - Recent Activity & Pending Check-ins */}
        <div className="lg:col-span-2 space-y-6">
          <GymCoachRecentActivity />
          {/* Reuse PendingCheckIns from global coach context if applicable, or create new. 
              The plan didn't specify creating a new one, but Reuse. 
          */}
          <PendingCheckIns />
        </div>
      </div>
    </div>
  );
}
