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
    label: "billing",
    icon: <CreditCard className="w-5 h-5" />,
    path: APP_PAGES.manager.billing.link,
    matchPaths: [APP_PAGES.manager.billing.link],
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
      <Outlet />
    </Nav>
  );
}

export default ManagerPage;
