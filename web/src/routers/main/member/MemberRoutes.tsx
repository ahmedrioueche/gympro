import { createRoute } from "@tanstack/react-router";
import UserHomePage from "../../../app/pages/main/user/home/UserHomePage";
import UserNotificationsPage from "../../../app/pages/main/user/notifications/UserNotificationsPage";
import UserSettingsPage from "../../../app/pages/main/user/settings/UserSettingsPage";
import { MemberRootRoute } from "./MemberRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/",
  component: () => <UserHomePage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/notifications",
  component: () => <UserNotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/settings",
  component: () => <UserSettingsPage />,
});
