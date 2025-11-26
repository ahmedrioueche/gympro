import { Outlet } from "@tanstack/react-router";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: "🏠",
    path: APP_PAGES.manager.home.link,
    description: "manageMembers",
  },
  {
    label: "members",
    icon: "👥",
    path: APP_PAGES.manager.members.link,
    description: "manageMembers",
  },
  {
    label: "subscriptions",
    icon: "📋",
    path: APP_PAGES.manager.subscriptions.link,
    description: "manageSubscriptions",
  },
  {
    label: "coaching",
    icon: "⚡",
    path: APP_PAGES.manager.coaching.link,
    description: "manageCoaching",
  },
  {
    label: "payments",
    icon: "💳",
    path: APP_PAGES.manager.payments.link,
    description: "managePayments",
  },
  {
    label: "analytics",
    icon: "📊",
    path: APP_PAGES.manager.analytics.link,
    description: "viewAnalytics",
  },
  {
    label: "notifications",
    icon: "🔔",
    path: APP_PAGES.manager.notifications.link,
    description: "viewNotifications",
  },
  {
    label: "settings",
    icon: "⚙️",
    path: APP_PAGES.manager.settings.link,
    description: "customizeSettings",
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
