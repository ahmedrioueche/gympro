import { createRoute } from "@tanstack/react-router";
import HomePage from "../../../../app/pages/main/gym/manager/home/HomePage";
import MembersPage from "../../../../app/pages/main/gym/manager/members/MembersPage";
import NotificationsPage from "../../../../app/pages/main/gym/manager/notifications/NotificationsPage";
import SettingsPage from "../../../../app/pages/main/gym/manager/settings/SettingsPage";
import { GymCoachRootRoute } from "./GymCoachRootRoute";

export const homeRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/",
  component: () => <HomePage />,
});

export const membersRoute = createRoute({
  getParentRoute: () => GymCoachRootRoute,
  path: "/members",
  component: () => <MembersPage />,
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
