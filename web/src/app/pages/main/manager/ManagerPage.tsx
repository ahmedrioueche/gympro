import { Outlet } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  CreditCard,
  Dumbbell,
  HelpCircle,
  Home,
  Settings,
  WalletCards,
} from "lucide-react";
import { useEffect } from "react";
import { APP_PAGES } from "../../../../constants/navigation";
import { PAGE_CLASSES } from "../../../../constants/styles";
import { useUserStore } from "../../../../store/user";
import Nav from "../../../components/nav/Nav";

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
  {
    label: "support",
    icon: <HelpCircle className="w-5 h-5" />,
    path: APP_PAGES.manager.support.link,
    matchPaths: [APP_PAGES.manager.support.link],
  },
];

function ManagerPage() {
  const setActiveDashboard = useUserStore((state) => state.setActiveDashboard);

  useEffect(() => {
    setActiveDashboard("manager");
  }, [setActiveDashboard]);

  return (
    <Nav sidebarLinks={sidebarLinks}>
      <div className={PAGE_CLASSES}>
        <Outlet />
      </div>
    </Nav>
  );
}

export default ManagerPage;
