import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.gym.home.link,
    matchPaths: [APP_PAGES.gym.home.link],
  },
  {
    label: "members",
    icon: <Users className="w-5 h-5" />,
    path: APP_PAGES.gym.members.link,
    matchPaths: [APP_PAGES.gym.members.link, APP_PAGES.gym.createMember.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.gym.subscriptions.link,
    matchPaths: [APP_PAGES.gym.subscriptions.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.gym.analytics.link,
    matchPaths: [APP_PAGES.gym.analytics.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.gym.notifications.link,
    matchPaths: [APP_PAGES.gym.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.gym.settings.link,
    matchPaths: [APP_PAGES.gym.settings.link],
  },
];

function GymPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <Outlet />
    </Nav>
  );
}

export default GymPage;
