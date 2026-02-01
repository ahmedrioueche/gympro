import { adminRootRoute } from "./AdminRootRoute";
import {
  alertsRoute,
  analyticsRoute,
  coachingRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  pricingRoute,
  reportsRoute,
  revenueRoute,
  settingsRoute,
  staffRoute,
  subscriptionsRoute,
  usersRoute,
} from "./AdminRoutes";

export const adminRouteTree = adminRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  revenueRoute,
  usersRoute,
  gymsRoute,
  coachingRoute,
  staffRoute,
  notificationsRoute,
  settingsRoute,
  alertsRoute,
  reportsRoute,
  analyticsRoute,
  pricingRoute,
]);
