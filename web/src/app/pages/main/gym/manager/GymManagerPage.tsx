import {
  GYM_PERMISSIONS,
  GymManagerFeature,
} from "@ahmedrioueche/gympro-client";
import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  Logs,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  Store,
  Trophy,
  UserCheck,
  UserCircle,
  Users,
} from "lucide-react";
import { APP_PAGES } from "../../../../../constants/navigation";
import { PAGE_CLASSES } from "../../../../../constants/styles";
import { useFeatureAccess } from "../../../../../hooks/useFeatureAccess";
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
    matchPaths: [APP_PAGES.gym.manager.members.link],
  },
  {
    label: "services_pricing",
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
    icon: <ShieldCheck className="w-5 h-5" />,
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
    label: "coaching",
    icon: <UserCheck className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.coaching.link,
    matchPaths: [APP_PAGES.gym.manager.coaching.link],
  },
  {
    label: "classes",
    icon: <Calendar className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.classes.link,
    matchPaths: [APP_PAGES.gym.manager.classes.link],
  },
  {
    label: "staff",
    icon: <UserCircle className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.staff.link,
    matchPaths: [APP_PAGES.gym.manager.staff.link],
  },
  {
    label: "marketing",
    icon: <Megaphone className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.marketing.link,
    matchPaths: [APP_PAGES.gym.manager.marketing.link],
  },
  {
    label: "inventory",
    icon: <Package className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.inventory.link,
    matchPaths: [APP_PAGES.gym.manager.inventory.link],
  },
  {
    label: "store",
    icon: <Store className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.store.link,
    matchPaths: [APP_PAGES.gym.manager.store.link],
  },
  {
    label: "competitions",
    icon: <Trophy className="w-5 h-5" />,
    path: APP_PAGES.gym.manager.competitions.link,
    matchPaths: [APP_PAGES.gym.manager.competitions.link],
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
  const { hasFeature } = useFeatureAccess();

  const filteredSidebarLinks = sidebarLinks.filter((link) => {
    switch (link.label) {
      case "members":
        return (
          hasPermission(GYM_PERMISSIONS.members.view) &&
          hasFeature(GymManagerFeature.MEMBERS)
        );
      case "services_pricing":
        return hasFeature(GymManagerFeature.SERVICES_PRICING);
      case "subscriptions":
        return hasFeature(GymManagerFeature.SUBSCRIPTIONS);
      case "access":
        return hasFeature(GymManagerFeature.ACCESS_CONTROL_QR);
      case "staff":
        return (
          hasPermission(GYM_PERMISSIONS.staff.view) &&
          hasFeature(GymManagerFeature.STAFF)
        );
      case "attendance":
        return (
          hasPermission(GYM_PERMISSIONS.attendance.view) &&
          hasFeature(GymManagerFeature.ATTENDANCE)
        );
      case "coaching":
        return hasFeature(GymManagerFeature.COACHING);
      case "analytics":
        return (
          hasPermission(GYM_PERMISSIONS.analytics.view) &&
          hasFeature(GymManagerFeature.ANALYTICS)
        );
      case "settings":
        return hasPermission(GYM_PERMISSIONS.settings.view);
      case "announcements":
        return (
          hasPermission(GYM_PERMISSIONS.communication.view) &&
          hasFeature(GymManagerFeature.ANNOUNCEMENTS)
        );
      case "marketing":
        return (
          hasPermission(GYM_PERMISSIONS.marketing.view) &&
          hasFeature(GymManagerFeature.MARKETING)
        );
      case "inventory":
        return (
          hasPermission(GYM_PERMISSIONS.inventory.view) &&
          hasFeature(GymManagerFeature.INVENTORY)
        );
      case "store":
        return (
          hasPermission(GYM_PERMISSIONS.store.view) &&
          hasFeature(GymManagerFeature.STORE)
        );
      case "competitions":
        return (
          hasPermission(GYM_PERMISSIONS.competitions.view) &&
          hasFeature(GymManagerFeature.COMPETITIONS)
        );
      case "classes":
        return (
          hasPermission(GYM_PERMISSIONS.schedules.view) &&
          hasFeature(GymManagerFeature.CLASSES)
        );
      default:
        // Home, subscriptions (?), access (?), notifications are always visible for now
        // or check logic later
        return true;
    }
  });

  return (
    <Nav sidebarLinks={filteredSidebarLinks}>
      <div className={PAGE_CLASSES}>
        <Outlet />
      </div>
    </Nav>
  );
}

export default GymManagerPage;
