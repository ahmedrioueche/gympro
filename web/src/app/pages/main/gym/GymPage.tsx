import { Outlet } from "@tanstack/react-router";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: "🏠",
    path: APP_PAGES.gym.home.link,
    description: "manageGym",
    matchPaths: [APP_PAGES.gym.home.link],
  },
  {
    label: "members",
    icon: "🏋️",
    path: APP_PAGES.gym.members.link,
    description: "manageMembers",
    matchPaths: [APP_PAGES.gym.members.link, APP_PAGES.gym.createMember.link],
  },
  {
    label: "subscriptions",
    icon: "💳",
    path: APP_PAGES.gym.subscriptions.link,
    description: "manageSubscriptions",
    matchPaths: [APP_PAGES.gym.subscriptions.link],
  },
  {
    label: "analytics",
    icon: "📊",
    path: APP_PAGES.gym.analytics.link,
    description: "viewAnalytics",
    matchPaths: [APP_PAGES.gym.analytics.link],
  },
  {
    label: "notifications",
    icon: "🔔",
    path: APP_PAGES.gym.notifications.link,
    description: "viewNotifications",
    matchPaths: [APP_PAGES.gym.notifications.link],
  },
  {
    label: "settings",
    icon: "⚙️",
    path: APP_PAGES.gym.settings.link,
    description: "customizeSettings",
    matchPaths: [APP_PAGES.gym.settings.link],
  },
];

function GymPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <Outlet />
    </Nav>
  );
}

export default GymPage;
