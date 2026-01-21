import { createRoute } from "@tanstack/react-router";
import AnalyticsPage from "../../../../app/pages/main/gym/coach/analytics/AnalyticsPage";
import ClientsPage from "../../../../app/pages/main/gym/coach/clients/ClientsPage";
import HomePage from "../../../../app/pages/main/gym/coach/home/HomePage";
import NotificationsPage from "../../../../app/pages/main/gym/coach/notifications/NotificationsPage";
import PaymentsPage from "../../../../app/pages/main/gym/coach/payments/PaymentsPage";
import SchedulePage from "../../../../app/pages/main/gym/coach/schedule/SchedulePage";
import SettingsPage from "../../../../app/pages/main/gym/coach/settings/SettingsPage";
import { GymCoachRootRoute } from "./GymCoachRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const clientsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/clients",
  component: () => <ClientsPage />,
});

export const scheduleRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/schedule",
  component: () => <SchedulePage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const paymentsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/payments",
  component: () => <PaymentsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});
