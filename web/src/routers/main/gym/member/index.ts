import { GymMemberRootRoute } from "./GymMemberRootRoute";
import {
  accessRoute,
  attendanceRoute,
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
  attendanceRoute,
]);
