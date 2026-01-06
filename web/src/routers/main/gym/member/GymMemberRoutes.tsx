import { createRoute } from "@tanstack/react-router";
import AttendancePage from "../../../../app/pages/main/gym/member/access-logs/AttendancePage";
import AccessPage from "../../../../app/pages/main/gym/member/access/AccessPage";
import HomePage from "../../../../app/pages/main/gym/member/home/HomePage";
import NotificationsPage from "../../../../app/pages/main/gym/member/notifications/NotificationsPage";
import SettingsPage from "../../../../app/pages/main/gym/member/settings/SettingsPage";
import SubscriptionsPage from "../../../../app/pages/main/gym/member/subscriptions/SubscriptionsPage";
import { GymMemberRootRoute } from "./GymMemberRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const accessRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/access",
  component: () => <AccessPage />,
});

export const attendanceRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/attendance",
  component: () => <AttendancePage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => GymMemberRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
