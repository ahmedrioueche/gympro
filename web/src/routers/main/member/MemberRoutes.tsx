import { createRoute } from "@tanstack/react-router";
import AttendancePage from "../../../app/pages/main/member/attendace/AttendancePage";
import ExercisesPage from "../../../app/pages/main/member/exercises/ExercisesPage";
import GymsPage from "../../../app/pages/main/member/gyms/GymsPage";
import HomePage from "../../../app/pages/main/member/home/HomePage";
import NoftificationsPage from "../../../app/pages/main/member/notifications/NoftificationsPage";
import ProgramsPage from "../../../app/pages/main/member/programs/ProgramsPage";
import ProgressPage from "../../../app/pages/main/member/progress/ProgressPage";
import SettingsPage from "../../../app/pages/main/member/settings/SettingsPage";
import SubscriptionsPage from "../../../app/pages/main/member/subscriptions/SubscriptionsPage";
import TrainingPage from "../../../app/pages/main/member/training/TrainingPage";
import { MemberRootRoute } from "./MemberRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const gymsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/gyms",
  component: () => <GymsPage />,
});

export const subscriptionsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/subscriptions",
  component: () => <SubscriptionsPage />,
});

export const programsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/programs",
  component: () => <ProgramsPage />,
});

export const trainingRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/training",
  component: () => <TrainingPage />,
});

export const exercisesRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/exercises",
  component: () => <ExercisesPage />,
});

export const progressRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/progress",
  component: () => <ProgressPage />,
});

export const attendanceRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/attendance",
  component: () => <AttendancePage />,
});

export const settingsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/settings",
  component: () => <SettingsPage />,
});

export const notificationsRoute = createRoute({
  getParentRoute: () => MemberRootRoute,
  path: "/notifications",
  component: () => <NoftificationsPage />,
});
