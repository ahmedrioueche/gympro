import { createRoute } from "@tanstack/react-router";
import UserHomePage from "../../../app/pages/main/user/home/UserHomePage";
import UserNotificationsPage from "../../../app/pages/main/user/notifications/UserNotificationsPage";
import UserSettingsPage from "../../../app/pages/main/user/settings/UserSettingsPage";
import { UserRootRoute } from "./UserRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => UserRootRoute,
  path: "/",
  component: () => <UserHomePage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => UserRootRoute,
  path: "/notifications",
  component: () => <UserNotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => UserRootRoute,
  path: "/settings",
  component: () => <UserSettingsPage />,
});
