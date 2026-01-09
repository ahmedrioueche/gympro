import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  Dumbbell,
  Home,
  Settings,
  WalletCards,
} from "lucide-react";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: <Home className="w-5 h-5" />,
    path: APP_PAGES.manager.home.link,
    matchPaths: [APP_PAGES.manager.home.link],
  },
  {
    label: "gyms",
    icon: <Dumbbell className="w-5 h-5" />,
    path: APP_PAGES.manager.gyms.link,
    matchPaths: [APP_PAGES.manager.gyms.link, APP_PAGES.manager.createGym.link],
  },
  {
    label: "subscription",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.manager.subscription.link,
    matchPaths: [APP_PAGES.manager.subscription.link],
  },
  {
    label: "payments",
    icon: <WalletCards className="w-5 h-5" />,
    path: APP_PAGES.manager.payments.link,
    matchPaths: [APP_PAGES.manager.payments.link],
  },
  {
    label: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    path: APP_PAGES.manager.analytics.link,
    matchPaths: [APP_PAGES.manager.analytics.link],
  },
  {
    label: "notifications",
    icon: <Bell className="w-5 h-5" />,
    path: APP_PAGES.manager.notifications.link,
    matchPaths: [APP_PAGES.manager.notifications.link],
  },
  {
    label: "settings",
    icon: <Settings className="w-5 h-5" />,
    path: APP_PAGES.manager.settings.link,
    matchPaths: [APP_PAGES.manager.settings.link],
  },
];

function ManagerPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className="min-h-screen max-w-7xl mx-auto p-5 md:p-6 lg:p-8">
        <Outlet />
      </div>
    </Nav>
  );
}

export default ManagerPage;
