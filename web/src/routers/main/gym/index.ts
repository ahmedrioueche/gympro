import { GymRootRoute } from "./GymRootRoute";
import {
  accessLogsRoute,
  accessRoute,
  analyticsRoute,
  createMemberRoute,
  homeRoute,
  membersRoute,
  notificationsRoute,
  settingsRoute,
  subscriptionsRoute,
} from "./GymRoutes";

export const GymRootTree = GymRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  membersRoute,
  createMemberRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  accessRoute,
  accessLogsRoute,
]);
