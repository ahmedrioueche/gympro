import { createRoute } from "@tanstack/react-router";
import AnalyticsPage from "../../../app/pages/main/manager/analytics/AnalyticsPage";
import CoachingPage from "../../../app/pages/main/manager/coaching/CoachingPage";
import HomePage from "../../../app/pages/main/manager/home/HomePage";
import MembersPage from "../../../app/pages/main/manager/members/MembersPage";
import NotificationsPage from "../../../app/pages/main/manager/notifications/NotificationsPage";
import SettingsPage from "../../../app/pages/main/manager/settings/SettingsPage";
import SubscriptionsPage from "../../../app/pages/main/manager/subscriptions/SubscriptionsPage";
import { ManagerRootRoute } from "./ManagerRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const membersRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/members",
  component: () => <MembersPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const coachingRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/coaching",
  component: () => <CoachingPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
