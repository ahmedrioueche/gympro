import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  Home,
  Megaphone,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import Nav from "../../../../components/nav/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.home.link,
    matchPaths: [APP_PAGES.gym.coach.home.link],
  },
  {
    label: "clients",
    icon: <Users className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.clients.link,
    matchPaths: [APP_PAGES.gym.coach.clients.link],
  },
  {
    label: "schedule",
    icon: <Calendar className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.schedule.link,
    matchPaths: [APP_PAGES.gym.coach.schedule.link],
  },
  {
    label: "payments",
    icon: <Wallet className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.payments.link,
    matchPaths: [APP_PAGES.gym.coach.payments.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.analytics.link,
    matchPaths: [APP_PAGES.gym.coach.analytics.link],
  },
  {
    label: "announcements",
    icon: <Megaphone className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.announcements.link,
    matchPaths: [APP_PAGES.gym.coach.announcements.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.notifications.link,
    matchPaths: [APP_PAGES.gym.coach.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.gym.coach.settings.link,
    matchPaths: [APP_PAGES.gym.coach.settings.link],
  },
];

function GymCoachPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymCoachPage;
