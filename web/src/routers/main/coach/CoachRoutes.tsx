import { createRoute } from "@tanstack/react-router";
import AnalyticsPage from "../../../app/pages/main/coach/analytics/AnalyticsPage";
import ClientsPage from "../../../app/pages/main/coach/clients/ClientsPage";
import ExercisesPage from "../../../app/pages/main/coach/exercises/ExercisesPage";
import GymsPage from "../../../app/pages/main/coach/gyms/GymsPage";
import HomePage from "../../../app/pages/main/coach/home/HomePage";
import NotificationsPage from "../../../app/pages/main/coach/notifications/NotificationsPage";
import ProfilePage from "../../../app/pages/main/coach/profile/ProfilePage";
import ProgramsPage from "../../../app/pages/main/coach/programs/ProgramsPage";
import SchedulePage from "../../../app/pages/main/coach/schedule/SchedulePage";
import SettingsPage from "../../../app/pages/main/coach/settings/SettingsPage";
import { CoachRootRoute } from "./CoachRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const gymsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/gyms",
  component: () => <GymsPage />,
});

export const clientsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/clients",
  component: () => <ClientsPage />,
});

export const profileRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/profile",
  component: () => <ProfilePage />,
});

export const programsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/programs",
  component: () => <ProgramsPage />,
});

export const scheduleRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/schedule",
  component: () => <SchedulePage />,
});

export const exercisesRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/exercises",
  component: () => <ExercisesPage />,
});

export const analyticsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/analytics",
  component: () => <AnalyticsPage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => CoachRootRoute,
  path: "/notifications",
  component: () => <NotificationsPage />,
});
