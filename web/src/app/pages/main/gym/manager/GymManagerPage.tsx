import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  Key,
  Logs,
  Settings,
  Users,
} from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import Nav from "../../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.home.link,
    matchPaths: [APP_PAGES.gym.manager.home.link],
  },
  {
    label: "members",
    icon: <Users className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.members.link,
    matchPaths: [
      APP_PAGES.gym.manager.members.link,
      APP_PAGES.gym.manager.createMember.link,
    ],
  },
  {
    label: "pricing",
    icon: <DollarSign className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.pricing.link,
    matchPaths: [APP_PAGES.gym.manager.pricing.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.subscriptions.link,
    matchPaths: [APP_PAGES.gym.manager.subscriptions.link],
  },
  {
    label: "access",
    icon: <Key className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.access.link,
    matchPaths: [APP_PAGES.gym.manager.access.link],
  },
  {
    label: "attendance",
    icon: <Logs className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.attendance.link,
    matchPaths: [APP_PAGES.gym.manager.attendance.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.analytics.link,
    matchPaths: [APP_PAGES.gym.manager.analytics.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.notifications.link,
    matchPaths: [APP_PAGES.gym.manager.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.settings.link,
    matchPaths: [APP_PAGES.gym.manager.settings.link],
  },
];

function GymManagerPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymManagerPage;
