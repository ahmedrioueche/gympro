import { ManagerRootRoute } from "./ManagerRootRoute";
import {
  analyticsRoute,
  coachingRoute,
  createGymRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  settingsRoute,
  subscriptionsRoute,
} from "./ManagerRoutes";

export const ManagerRootTree = ManagerRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  gymsRoute,
  createGymRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  coachingRoute,
]);
