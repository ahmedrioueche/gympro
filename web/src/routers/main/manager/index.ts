import { ManagerRootRoute } from "./ManagerRootRoute";
import {
  analyticsRoute,
  coachingRoute,
  homeRoute,
  membersRoute,
  notificationsRoute,
  settingsRoute,
  subscriptionsRoute,
} from "./ManagerRoutes";

export const ManagerRootTree = ManagerRootRoute.addChildren([
  homeRoute,
  membersRoute,
  subscriptionsRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  coachingRoute,
]);
