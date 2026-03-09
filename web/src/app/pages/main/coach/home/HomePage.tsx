import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  BarChart3,
  Calendar,
  Clipboard,
  MessageSquare,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";
import PageHeader from "../../../../components/PageHeader";
import PendingCheckIns from "../../../../components/coach/dashboard/PendingCheckIns";
import QuickActions from "../../../../components/coach/dashboard/QuickActions";
import QuickStatsGrid from "../../../../components/coach/dashboard/QuickStatsGrid";
import RecentActivity from "../../../../components/coach/dashboard/RecentActivity";
import TodaySessions from "../../../../components/coach/dashboard/TodaySessions";
import { useCoachHome } from "./hooks/useCoachHome";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { stats, activity } = useCoachHome();

  const quickStats = [
    {
      label: t("home.coach.stats.activeClients"),
      value: stats?.activeClients?.value.toString() || "0",
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500 to-indigo-600",
      trend:
        stats?.activeClients?.trend > 0 ? `+${stats.activeClients.trend}` : "0",
      description: t(
        "home.coach.stats.activeClientsDesc",
        "Members currently coached",
      ),
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
      description: t("home.coach.stats.programsDesc", "Total training plans"),
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
      description: t(
        "home.coach.stats.sessionsDesc",
        "Scheduled meetings this month",
      ),
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
      description: t("home.coach.stats.retentionDesc", "Client loyalty rate"),
    },
  ];

  // Map activity types to icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Clipboard":
        return Clipboard;
      case "MessageSquare":
        return MessageSquare;
      case "TrendingUp":
        return TrendingUp;
      case "UserPlus":
        return UserPlus;
      default:
        return Calendar;
    }
  };

  const recentActivity =
    activity?.map((act: any) => ({
      ...act,
      icon: getIcon(act.icon),
    })) || [];

  const todaySessions =
    stats?.todaySessions?.map((session: any) => ({
      time: format(new Date(session.startTime), "hh:mm a"),
      client: session.member?.fullName || "Unknown",
      type: t(`home.coach.sessionTypes.${session.type}`),
      status: session.status,
    })) || [];

  const quickActions = [
    {
      label: t("home.coach.quickActions.createProgram"),
      icon: Clipboard,
      onClick: () => navigate({ to: APP_PAGES.coach.programs.link }),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: t("home.coach.quickActions.addClient"),
      icon: UserPlus,
      onClick: () => navigate({ to: APP_PAGES.coach.clients.link }),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: t("home.coach.quickActions.scheduleSession"),
      icon: Calendar,
      onClick: () => navigate({ to: APP_PAGES.coach.schedule.link }),
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      label: t("home.coach.quickActions.viewAnalytics"),
      icon: BarChart3,
      onClick: () => navigate({ to: APP_PAGES.coach.analytics.link }),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title={t("home.coach.welcome")}
        subtitle={t("home.coach.subtitle")}
        icon={TrendingUp}
      />

      {/* Quick Stats Grid */}
      <QuickStatsGrid stats={quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Today's Sessions - Left */}
        <div className="lg:col-span-1 h-full">
          <TodaySessions sessions={todaySessions} />
        </div>

        {/* Recent Activity - Right */}
        <div className="lg:col-span-2 h-full">
          <RecentActivity activities={recentActivity} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Quick Actions - Left */}
        <div className="lg:col-span-1 h-full">
          <QuickActions actions={quickActions} />
        </div>

        {/* Pending Check-ins - Right */}
        <div className="lg:col-span-2 h-full">
          <PendingCheckIns count={(stats as any)?.pendingRequestsCount || 0} />
        </div>
      </div>
    </div>
  );
}
