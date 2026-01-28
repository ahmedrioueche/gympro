import { GymMemberRootRoute } from "./GymMemberRootRoute";
import {
  accessRoute,
  announcementsRoute,
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
  announcementsRoute,
]);
