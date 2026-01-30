import { adminRootRoute } from "./AdminRootRoute";
import {
  coachingRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  revenueRoute,
  settingsRoute,
  staffRoute,
  subscriptionsRoute,
  usersRoute,
} from "./AdminRoutes";

export const adminRootTree = adminRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  revenueRoute,
  usersRoute,
  gymsRoute,
  coachingRoute,
  staffRoute,
  notificationsRoute,
  settingsRoute,
]);
