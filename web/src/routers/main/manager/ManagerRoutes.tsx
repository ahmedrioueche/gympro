import { createRoute } from "@tanstack/react-router";
import AnalyticsPage from "../../../app/pages/main/manager/analytics/AnalyticsPage";
import BillingPage from "../../../app/pages/main/manager/billing/BillingPage";
import CoachingPage from "../../../app/pages/main/manager/coaching/CoachingPage";
import CreateGymPage from "../../../app/pages/main/manager/createGym/CreateGymPage";
import GymsPage from "../../../app/pages/main/manager/gyms/GymsPage";
import HomePage from "../../../app/pages/main/manager/home/HomePage";
import NotificationsPage from "../../../app/pages/main/manager/notifications/NotificationsPage";
import PaymentsPage from "../../../app/pages/main/manager/payments/PaymentsPage";
import SettingsPage from "../../../app/pages/main/manager/settings/SettingsPage";
import { ManagerRootRoute } from "./ManagerRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const gymsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/gyms",
  component: () => <GymsPage />,
});

export const createGymRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/gyms/create",
  component: () => <CreateGymPage />,
});

export const billingRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/billing",
  component: () => <BillingPage />,
});

export const paymentsRoute = createRoute({
  getParentRoute: () => ManagerRootRoute,
  path: "/payments",
  component: () => <PaymentsPage />,
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
