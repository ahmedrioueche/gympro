import { createRoute } from "@tanstack/react-router";
import CoachingPage from "../../app/pages/admin/coaching/CoachingPage";
import GymsPage from "../../app/pages/admin/gyms/GymsPage";
import HomePage from "../../app/pages/admin/home/HomePage";
import NotificationsPage from "../../app/pages/admin/notifications/NotificationsPage";
import RevenuePage from "../../app/pages/admin/revenue/RevenuePage";
import SettingsPage from "../../app/pages/admin/settings/SettingsPage";
import StaffPage from "../../app/pages/admin/staff/StaffPage";
import SubscriptionsPage from "../../app/pages/admin/subscriptions/SubscriptionsPage";
import UsersPage from "../../app/pages/admin/users/UsersPage";
import { adminRootRoute } from "./AdminRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const revenueRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/revenue",
  component: () => <RevenuePage />,
});

export const gymsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/gyms",
  component: () => <GymsPage />,
});

export const usersRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/users",
  component: () => <UsersPage />,
});

export const coachingRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/coaching",
  component: () => <CoachingPage />,
});

export const staffRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/staff",
  component: () => <StaffPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
