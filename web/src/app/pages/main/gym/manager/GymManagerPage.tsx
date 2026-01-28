import { GYM_PERMISSIONS } from "@ahmedrioueche/gympro-client";
import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  Key,
  Logs,
  Megaphone,
  Settings,
  UserCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import { usePermissions } from "../../../../../hooks/usePermissions";
import Nav from "../../../../components/nav/Nav";

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
      APP_PAGES.gym.manager.create_member.link,
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
    label: "staff",
    icon: <UserCircle className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.staff.link,
    matchPaths: [APP_PAGES.gym.manager.staff.link],
  },
  {
    label: "coaching",
    icon: <UserCheck className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.coaching.link,
    matchPaths: [APP_PAGES.gym.manager.coaching.link],
  },
  {
    label: "attendance",
    icon: <Logs className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.attendance.link,
    matchPaths: [APP_PAGES.gym.manager.attendance.link],
  },
  {
    label: "announcements",
    icon: <Megaphone className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.announcements.link,
    matchPaths: [APP_PAGES.gym.manager.announcements.link],
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
  const { hasPermission } = usePermissions();

  const filteredSidebarLinks = sidebarLinks.filter((link) => {
    switch (link.label) {
      case "members":
        return hasPermission(GYM_PERMISSIONS.members.view);
      case "pricing":
        return hasPermission(GYM_PERMISSIONS.pricing.view);
      case "staff":
        return hasPermission(GYM_PERMISSIONS.staff.view);
      case "attendance":
        return hasPermission(GYM_PERMISSIONS.attendance.view);
      case "analytics":
        return hasPermission(GYM_PERMISSIONS.analytics.view);
      case "settings":
        return hasPermission(GYM_PERMISSIONS.settings.view);
      case "announcements":
        return hasPermission(GYM_PERMISSIONS.communication.view);
      default:
        // Home, subscriptions (?), access (?), notifications are always visible for now
        // or check logic later
        return true;
    }
  });

  return (
    <Nav sidebarLinks={filteredSidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymManagerPage;
