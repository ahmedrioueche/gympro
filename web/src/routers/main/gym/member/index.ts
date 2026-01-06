import { GymMemberRootRoute } from "./GymMemberRootRoute";
import {
  accessLogsRoute,
  accessRoute,
  homeRoute,
  notificationsRoute,
  settingsRoute,
  subscriptionsRoute,
} from "./GymMemberRoutes";

export const GymMemberRootTree = GymMemberRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  notificationsRoute,
  settingsRoute,
  accessRoute,
  accessLogsRoute,
]);
