import { Outlet } from "@tanstack/react-router";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: "🏠",
    path: APP_PAGES.manager.home.link,
    description: "manageAccount",
    matchPaths: [APP_PAGES.manager.home.link],
  },
  {
    label: "gyms",
    icon: "🏋️",
    path: APP_PAGES.manager.gyms.link,
    description: "manageGyms",
    matchPaths: [APP_PAGES.manager.gyms.link, APP_PAGES.manager.createGym.link],
  },
  {
    label: "payments",
    icon: "💳",
    path: APP_PAGES.manager.payments.link,
    description: "managePayments",
    matchPaths: [APP_PAGES.manager.payments.link],
  },
  {
    label: "analytics",
    icon: "📊",
    path: APP_PAGES.manager.analytics.link,
    description: "viewAnalytics",
    matchPaths: [APP_PAGES.manager.analytics.link],
  },
  {
    label: "notifications",
    icon: "🔔",
    path: APP_PAGES.manager.notifications.link,
    description: "viewNotifications",
    matchPaths: [APP_PAGES.manager.notifications.link],
  },
  {
    label: "settings",
    icon: "⚙️",
    path: APP_PAGES.manager.settings.link,
    description: "customizeSettings",
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
