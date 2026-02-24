import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Clipboard, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import NotFound from "../../../../../../components/ui/NotFound";
import { APP_PAGES } from "../../../../../../constants/navigation";
import QuickActions from "../../../../../components/coach/dashboard/QuickActions";
import QuickStatsGrid from "../../../../../components/coach/dashboard/QuickStatsGrid";
import RecentActivity from "../../../../../components/coach/dashboard/RecentActivity";
import TodaySessions from "../../../../../components/coach/dashboard/TodaySessions";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import MarketingCarousel from "../../../../../components/gym/MarketingCarousel";
import OperatingHours from "../../../../../components/gym/OperatingHours";
import GymCoachAnnouncementsSection from "./components/GymCoachAnnouncementsSection";
import { useGymCoachHome } from "./hooks/useGymCoachHome";
import { useGymCoachHomeData } from "./hooks/useGymCoachHomeData";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gym, isGymLoading, status } = useGymCoachHome();
  const { stats, recentActivity } = useGymCoachHomeData();

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

  // Map stats for QuickStatsGrid
  const mappedStats = [
    {
      label: t("home.coach.stats.activeClients"),
      value: stats?.activeClients?.value.toString() || "0",
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500 to-indigo-600",
      trend:
        stats?.activeClients?.trend > 0 ? `+${stats.activeClients.trend}` : "0",
      description: t("home.coach.stats.activeClientsDesc"),
    },
    {
      label: t("home.coach.stats.programsCreated"),
      value: stats?.programsCreated?.value.toString() || "0",
      icon: Clipboard,
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-600",
      trend:
        stats?.programsCreated?.trend > 0
          ? `+${stats.programsCreated.trend}`
          : "0",
      description: t("home.coach.stats.programsDesc"),
    },
    {
      label: t("home.coach.stats.sessionsThisMonth"),
      value: stats?.sessionsThisMonth?.value.toString() || "0",
      icon: Calendar,
      color: "text-green-500",
      gradient: "from-green-500 to-emerald-600",
      trend:
        stats?.sessionsThisMonth?.trend > 0
          ? `+${stats.sessionsThisMonth.trend}`
          : "0",
      description: t("home.coach.stats.sessionsDesc"),
    },
    {
      label: t("home.coach.stats.clientRetention"),
      value:
        stats?.clientRetention?.value !== null
          ? `${stats?.clientRetention?.value}%`
          : "—",
      icon: TrendingUp,
      color: "text-orange-500",
      gradient: "from-orange-500 to-red-600",
      trend:
        stats?.clientRetention?.value !== null
          ? `${stats?.clientRetention?.trend > 0 ? "+" : ""}${stats?.clientRetention?.trend || 0}%`
          : "—",
      description: t("home.coach.stats.retentionDesc"),
    },
  ];

  // Map activities for RecentActivity
  const mappedActivities = (recentActivity || []).map((act: any) => {
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case "Clipboard":
          return Clipboard;
        case "UserPlus":
          return Users;
        case "TrendingUp":
          return TrendingUp;
        default:
          return Calendar;
      }
    };

    return {
      type: act.type,
      message: act.message,
      time: act.time
        ? format(new Date(act.time), "hh:mm a")
        : t("common.justNow"),
      icon: getIcon(act.icon),
      color: act.color || "text-emerald-500",
    };
  });

  // Map sessions for TodaySessions
  const mappedSessions = (stats?.todaySessions || []).map((session: any) => ({
    time: format(new Date(session.startTime), "hh:mm a"),
    client: session.member?.fullName || "Client",
    type: session.type || "Session",
    status: session.status,
  }));

  const quickActions = [
    {
      label: t("home.coach.quickActions.scheduleSession"),
      icon: Calendar,
      onClick: () => navigate({ to: `${APP_PAGES.gym.coach.schedule.link}` }),
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: t("home.coach.quickActions.addClient"),
      icon: Users,
      onClick: () => navigate({ to: `${APP_PAGES.gym.coach.clients.link}` }),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Gym Hero Section */}
      <GymHeroSection gym={gym} status={status} />

      {/* Marketing Material */}
      <MarketingCarousel gym={gym} />

      {/* Quick Stats Grid */}
      <QuickStatsGrid stats={mappedStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Row: Sessions, Actions, Operating Hours */}
        <div className="lg:col-span-1">
          <TodaySessions sessions={mappedSessions} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions actions={quickActions} />
        </div>
        <div className="lg:col-span-1">
          <OperatingHours settings={gym.settings} status={status} />
        </div>

        {/* Bottom Row: Recent Activity & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity activities={mappedActivities} />
        </div>
        <div className="lg:col-span-1">
          <GymCoachAnnouncementsSection gymId={gym._id} />
        </div>
      </div>
    </div>
  );
}
