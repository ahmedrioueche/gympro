import { createRoute } from "@tanstack/react-router";
import AccessPage from "../../../app/pages/main/gym/access/AccessPage";
import AnalyticsPage from "../../../app/pages/main/gym/analytics/AnalyticsPage";
import CreateMemberPage from "../../../app/pages/main/gym/createMember/CreateMemberPage";
import HomePage from "../../../app/pages/main/gym/home/HomePage";
import AccessLogsPage from "../../../app/pages/main/gym/logs/AccessLogsPage";
import MembersPage from "../../../app/pages/main/gym/members/MembersPage";
import NotificationsPage from "../../../app/pages/main/gym/notifications/NotificationsPage";
import SettingsPage from "../../../app/pages/main/gym/settings/SettingsPage";
import SubscriptionsPage from "../../../app/pages/main/gym/subscriptions/SubscriptionsPage";
import { GymRootRoute } from "./GymRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const membersRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/members",
  component: () => <MembersPage />,
});

export const createMemberRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/members/create",
  component: () => <CreateMemberPage />,
});

export const accessRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/access",
  component: () => <AccessPage />,
});

export const accessLogsRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/access/logs",
  component: () => <AccessLogsPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
