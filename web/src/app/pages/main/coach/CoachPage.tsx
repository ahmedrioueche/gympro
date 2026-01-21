import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  Clipboard,
  DollarSign,
  Dumbbell,
  Home,
  Settings,
  Users,
} from "lucide-react";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/nav/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.coach.home.link,
    matchPaths: [APP_PAGES.coach.home.link],
  },
  {
    label: "gyms",
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.coach.gyms.link,
    matchPaths: [APP_PAGES.coach.gyms.link],
  },
  {
    label: "clients",
    icon: <Users className="w-5 h-5" />,
    path: APP_PAGES.coach.clients.link,
    matchPaths: [APP_PAGES.coach.clients.link],
  },
  {
    label: "pricing",
    icon: <DollarSign className="w-5 h-5" />,
    path: APP_PAGES.coach.pricing.link,
    matchPaths: [APP_PAGES.coach.pricing.link],
  },
  {
    label: "programs",
    icon: <Clipboard className="w-5 h-5" />,
    path: APP_PAGES.coach.programs.link,
    matchPaths: [APP_PAGES.coach.programs.link],
  },
  {
    label: "exercises",
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.coach.exercises.link,
    matchPaths: [APP_PAGES.coach.exercises.link],
  },
  {
    label: "schedule",
    icon: <Calendar className="w-5 h-5" />,
    path: APP_PAGES.coach.schedule.link,
    matchPaths: [APP_PAGES.coach.schedule.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.coach.analytics.link,
    matchPaths: [APP_PAGES.coach.analytics.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.coach.notifications.link,
    matchPaths: [APP_PAGES.coach.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.coach.settings.link,
    matchPaths: [APP_PAGES.coach.settings.link],
  },
];

function CoachPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default CoachPage;
