import { ManagerRootRoute } from "./ManagerRootRoute";
import {
  analyticsRoute,
  billingRoute,
  coachingRoute,
  createGymRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  paymentsRoute,
  settingsRoute,
} from "./ManagerRoutes";

export const ManagerRootTree = ManagerRootRoute.addChildren([
  homeRoute,
  paymentsRoute,
  billingRoute,
  gymsRoute,
  createGymRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  coachingRoute,
]);
