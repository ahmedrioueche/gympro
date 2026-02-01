import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Dumbbell,
  Home,
  Settings,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { APP_PAGES } from "../../../constants/navigation";
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
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.admin.coaching.link,
    matchPaths: [APP_PAGES.admin.coaching.link],
  },
  {
    label: "staff",
    icon: <UserCheck className="w-5 h-5" />,
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
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.admin.reports.link,
    matchPaths: [APP_PAGES.admin.reports.link],
  },
  {
    label: "alerts",
    icon: <BarChart3 className="w-5 h-5" />,
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
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default AdminPage;
