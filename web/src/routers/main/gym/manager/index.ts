import { GymManagerRootRoute } from "./GymManagerRootRoute";
import {
  accessRoute,
  analyticsRoute,
  attendanceRoute,
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
  attendanceRoute,
]);
