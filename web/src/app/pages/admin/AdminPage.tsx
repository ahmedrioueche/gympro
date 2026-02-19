import { Outlet } from "@tanstack/react-router";
import {
  AlertCircle,
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Dumbbell,
  FileText,
  Home,
  Settings,
  UserCheck,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect } from "react";
import { APP_PAGES } from "../../../constants/navigation";
import { PAGE_CLASSES } from "../../../constants/styles";
import { useAppPermissions } from "../../../hooks/useAppPermissions";
import { useUserStore } from "../../../store/user";
import Nav from "../../components/nav/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.admin.home.link,
    matchPaths: [APP_PAGES.admin.home.link],
  },
  {
    label: "pricing",
    icon: <DollarSign className="w-5 h-5" />,
    path: APP_PAGES.admin.pricing.link,
    matchPaths: [APP_PAGES.admin.pricing.link],
  },
  {
    label: "subscriptions",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.admin.subscriptions.link,
    matchPaths: [APP_PAGES.admin.subscriptions.link],
  },
  {
    label: "revenue",
    icon: <Wallet className="w-5 h-5" />,
    path: APP_PAGES.admin.revenue.link,
    matchPaths: [APP_PAGES.admin.revenue.link],
  },
  {
    label: "users",
    icon: <Users className="w-5 h-5" />,
    path: APP_PAGES.admin.users.link,
    matchPaths: [APP_PAGES.admin.users.link],
  },
  {
    label: "gyms",
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.admin.gyms.link,
    matchPaths: [APP_PAGES.admin.gyms.link],
  },
  {
    label: "coaching",
    icon: <UserCheck className="w-5 h-5" />,
    path: APP_PAGES.admin.coaching.link,
    matchPaths: [APP_PAGES.admin.coaching.link],
  },
  {
    label: "staff",
    icon: <UserCircle className="w-5 h-5" />,
    path: APP_PAGES.admin.staff.link,
    matchPaths: [APP_PAGES.admin.staff.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.admin.analytics.link,
    matchPaths: [APP_PAGES.admin.analytics.link],
  },
  {
    label: "reports",
    icon: <FileText className="w-5 h-5" />,
    path: APP_PAGES.admin.reports.link,
    matchPaths: [APP_PAGES.admin.reports.link],
  },
  {
    label: "alerts",
    icon: <AlertCircle className="w-5 h-5" />,
    path: APP_PAGES.admin.alerts.link,
    matchPaths: [APP_PAGES.admin.alerts.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.admin.notifications.link,
    matchPaths: [APP_PAGES.admin.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.admin.settings.link,
    matchPaths: [APP_PAGES.admin.settings.link],
  },
];

function AdminPage() {
  const { hasAppPermission, APP_PERMISSIONS } = useAppPermissions();
  const setActiveDashboard = useUserStore((state) => state.setActiveDashboard);

  useEffect(() => {
    setActiveDashboard("admin");
  }, [setActiveDashboard]);

  const filteredSidebarLinks = sidebarLinks.filter((link) => {
    switch (link.label) {
      case "pricing":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_PLANS);
      case "subscriptions":
      case "revenue":
      case "analytics":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_REVENUE);
      case "users":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_USERS);
      case "gyms":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_GYMS);
      case "coaching":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_COACH_REQUESTS);
      case "staff":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_EDITORS);
      case "reports":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_REPORTS);
      case "alerts":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_ALERTS);
      case "notifications":
        return hasAppPermission(APP_PERMISSIONS.MANAGE_NOTIFICATIONS);
      case "home":
      case "settings":
        return true;
      default:
        return false;
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

export default AdminPage;
