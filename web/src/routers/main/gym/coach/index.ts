import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
  analyticsRoute,
  announcementsRoute,
  clientsRoute,
  homeRoute,
  notificationsRoute,
  paymentsRoute,
  scheduleRoute,
  settingsRoute,
} from "./GymCoachRoutes";

export const GymCoachRootTree = GymCoachRootRoute.addChildren([
  homeRoute,
  clientsRoute,
  analyticsRoute,
  paymentsRoute,
  scheduleRoute,
  notificationsRoute,
  settingsRoute,
  announcementsRoute,
]);
