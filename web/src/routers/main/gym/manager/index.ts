import { GymManagerRootRoute } from "./GymManagerRootRoute";
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
} from "./GymManagerRoutes";

export const GymManagerRootTree = GymManagerRootRoute.addChildren([
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
