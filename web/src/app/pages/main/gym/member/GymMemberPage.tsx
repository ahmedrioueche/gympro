import { Outlet } from "@tanstack/react-router";
import { Bell, CreditCard, Home, Key, Logs, Settings } from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import Nav from "../../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.gym.member.home.link,
    matchPaths: [APP_PAGES.gym.member.home.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.gym.member.subscriptions.link,
    matchPaths: [APP_PAGES.gym.member.subscriptions.link],
  },
  {
    label: "access",
    icon: <Key className="w-5 h-5" />,
    path: APP_PAGES.gym.member.access.link,
    matchPaths: [APP_PAGES.gym.member.access.link],
  },
  {
    label: "attendance",
    icon: <Logs className="w-5 h-5" />,
    path: APP_PAGES.gym.member.attendance.link,
    matchPaths: [APP_PAGES.gym.member.attendance.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.gym.member.notifications.link,
    matchPaths: [APP_PAGES.gym.member.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.gym.member.settings.link,
    matchPaths: [APP_PAGES.gym.member.settings.link],
  },
];

function GymMemberPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-3 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymMemberPage;
