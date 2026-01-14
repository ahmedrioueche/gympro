import { useNavigate } from "@tanstack/react-router";
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
import PendingCheckIns from "./components/PendingCheckIns";
import QuickActions from "./components/QuickActions";
import QuickStatsGrid from "./components/QuickStatsGrid";
import RecentActivity from "./components/RecentActivity";
import TodaySessions from "./components/TodaySessions";

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // TODO: Replace with real data from API
  const quickStats = [
    {
      label: t("home.coach.stats.activeClients"),
      value: "24",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "+3",
    },
    {
      label: t("home.coach.stats.programsCreated"),
      value: "12",
      icon: Clipboard,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "+2",
    },
    {
      label: t("home.coach.stats.sessionsThisMonth"),
      value: "48",
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "+8",
    },
    {
      label: t("home.coach.stats.clientRetention"),
      value: "92%",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      trend: "+5%",
    },
  ];

  const todaySessions = [
    {
      time: "09:00 AM",
      client: "John Doe",
      type: t("home.coach.sessionTypes.training"),
      status: "upcoming",
    },
    {
      time: "11:00 AM",
      client: "Jane Smith",
      type: t("home.coach.sessionTypes.checkIn"),
      status: "upcoming",
    },
    {
      time: "02:00 PM",
      client: "Mike Johnson",
      type: t("home.coach.sessionTypes.consultation"),
      status: "upcoming",
    },
  ];

  const recentActivity = [
    {
      type: "workout",
      message: t("home.coach.activity.workoutCompleted", {
        client: "Sarah Williams",
      }),
      time: "2h ago",
      icon: Clipboard,
      color: "text-green-500",
    },
    {
      type: "message",
      message: t("home.coach.activity.newMessage", { client: "John Doe" }),
      time: "3h ago",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      type: "milestone",
      message: t("home.coach.activity.milestone", { client: "Mike Johnson" }),
      time: "5h ago",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      type: "program",
      message: t("home.coach.activity.programAssigned", {
        program: "Strength Builder",
      }),
      time: "1d ago",
      icon: Clipboard,
      color: "text-orange-500",
    },
  ];

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">
          {t("home.coach.welcome")}
        </h1>
        <p className="text-text-secondary">{t("home.coach.subtitle")}</p>
      </div>

      {/* Quick Stats Grid */}
      <QuickStatsGrid stats={quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Today's Sessions & Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <TodaySessions sessions={todaySessions} />
          <QuickActions actions={quickActions} />
        </div>

        {/* Right Column - Recent Activity & Pending Check-ins */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity activities={recentActivity} />
          <PendingCheckIns />
        </div>
      </div>
    </div>
  );
}
