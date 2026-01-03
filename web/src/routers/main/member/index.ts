import { MemberRootRoute } from "./MemberRootRoute";
import {
  attendanceRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  programsRoute,
  progressRoute,
  settingsRoute,
  subscriptionsRoute,
  trainingRoute,
} from "./MemberRoutes";

export const MemberRootTree = MemberRootRoute.addChildren([
  homeRoute,
  gymsRoute,
  subscriptionsRoute,
  programsRoute,
  settingsRoute,
  notificationsRoute,
  progressRoute,
  attendanceRoute,
  trainingRoute,
]);
