import { Outlet } from "@tanstack/react-router";
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  Logs,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  Store,
  Trophy,
} from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import { PAGE_CLASSES } from "../../../../../constants/styles";
import Nav from "../../../../components/nav/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.gym.member.home.link,
    matchPaths: [APP_PAGES.gym.member.home.link],
  },
  {
    label: "access",
    icon: <ShieldCheck className="w-5 h-5" />,
    path: APP_PAGES.gym.member.access.link,
    matchPaths: [APP_PAGES.gym.member.access.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.gym.member.subscriptions.link,
    matchPaths: [APP_PAGES.gym.member.subscriptions.link],
  },
  {
    label: "classes",
    icon: <Calendar className="w-5 h-5" />,
    path: APP_PAGES.gym.member.classes.link,
    matchPaths: [APP_PAGES.gym.member.classes.link],
  },

  {
    label: "attendance",
    icon: <Logs className="w-5 h-5" />,
    path: APP_PAGES.gym.member.attendance.link,
    matchPaths: [APP_PAGES.gym.member.attendance.link],
  },
  {
    label: "store",
    icon: <Store className="w-5 h-5" />,
    path: APP_PAGES.gym.member.store.link,
    matchPaths: [APP_PAGES.gym.member.store.link],
  },
  {
    label: "inventory",
    icon: <Package className="w-5 h-5" />,
    path: APP_PAGES.gym.member.inventory.link,
    matchPaths: [APP_PAGES.gym.member.inventory.link],
  },
  {
    label: "competitions",
    icon: <Trophy className="w-5 h-5" />,
    path: APP_PAGES.gym.member.competitions.link,
    matchPaths: [APP_PAGES.gym.member.competitions.link],
  },
  {
    label: "announcements",
    icon: <Megaphone className="w-5 h-5" />,
    path: APP_PAGES.gym.member.announcements.link,
    matchPaths: [APP_PAGES.gym.member.announcements.link],
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
      <div className={PAGE_CLASSES}>
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymMemberPage;
