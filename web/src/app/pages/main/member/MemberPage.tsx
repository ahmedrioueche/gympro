import { Outlet } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  Clipboard,
  CreditCard,
  Dumbbell,
  Home,
  Settings,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { APP_PAGES } from "../../../../constants/navigation";
import { PAGE_CLASSES } from "../../../../constants/styles";
import Nav from "../../../components/nav/Nav";
import { RestTimer } from "../../../components/timer/rest-timer/RestTimer";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.member.home.link,
    matchPaths: [APP_PAGES.member.home.link],
  },
  {
    label: "gyms",
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.member.gyms.link,
    matchPaths: [APP_PAGES.member.gyms.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.member.subscriptions.link,
    matchPaths: [APP_PAGES.member.subscriptions.link],
  },
  {
    label: "schedule",
    icon: <Calendar className="w-5 h-5" />,
    path: APP_PAGES.member.schedule.link,
    matchPaths: [APP_PAGES.member.schedule.link],
  },
  {
    label: "training",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.member.training.link,
    matchPaths: [APP_PAGES.member.training.link],
  },
  {
    label: "programs",
    icon: <Clipboard className="w-5 h-5" />,
    path: APP_PAGES.member.programs.link,
    matchPaths: [APP_PAGES.member.programs.link],
  },
  {
    label: "coaches",
    icon: <UserCheck className="w-5 h-5" />,
    path: APP_PAGES.member.coaches.link,
    matchPaths: [APP_PAGES.member.coaches.link],
  },
  {
    label: "exercises",
    icon: <Activity className="w-5 h-5" />,
    path: APP_PAGES.member.exercises.link,
    matchPaths: [APP_PAGES.member.exercises.link],
  },
  {
    label: "attendance",
    icon: <WalletCards className="w-5 h-5" />,
    path: APP_PAGES.member.attendance.link,
    matchPaths: [APP_PAGES.member.attendance.link],
  },
  {
    label: "progress",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.member.progress.link,
    matchPaths: [APP_PAGES.member.progress.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.member.notifications.link,
    matchPaths: [APP_PAGES.member.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.member.settings.link,
    matchPaths: [APP_PAGES.member.settings.link],
  },
];

function MemberPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className={PAGE_CLASSES}>
        <Outlet />
      </div>
      <RestTimer />
    </Nav>
  );
}

export default MemberPage;
