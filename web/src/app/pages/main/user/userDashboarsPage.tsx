import { Outlet } from "@tanstack/react-router";
import { APP_PAGES } from "../../../../constants/navigation";
import Nav from "../../../components/Nav";

const sidebarLinks = [
  {
    label: "home",
    icon: "🏠",
    path: APP_PAGES.dashboard.home.link,
    description: "manageAccount",
    role: ["owner", "manager", "member", "coach", "staff"],
  },
  {
    label: "notifications",
    icon: "🔔",
    path: APP_PAGES.dashboard.notifications.link,
    description: "viewNotifications",
    role: ["owner", "manager", "member", "coach", "staff"],
  },
  {
    label: "settings",
    icon: "⚙️",
    path: APP_PAGES.dashboard.settings.link,
    description: "customizeSettings",
    role: ["owner", "manager", "member", "coach", "staff"],
  },
];

function userDashboarsPage() {
  return (
    <Nav sidebarLinks={sidebarLinks}>
      <Outlet />
    </Nav>
  );
}

export default userDashboarsPage;
