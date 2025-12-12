import { ManagerRootRoute } from "./ManagerRootRoute";
import {
  analyticsRoute,
  coachingRoute,
  createGymRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  paymentsRoute,
  settingsRoute,
  subscriptionRoute,
} from "./ManagerRoutes";

export const ManagerRootTree = ManagerRootRoute.addChildren([
  homeRoute,
  paymentsRoute,
  subscriptionRoute,
  gymsRoute,
  createGymRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  coachingRoute,
]);
