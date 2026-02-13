import { MemberRootRoute } from "./MemberRootRoute";
import {
  attendanceRoute,
  coachesRoute,
  exercisesRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  programsRoute,
  progressRoute,
  scheduleRoute,
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
  scheduleRoute,
  exercisesRoute,
  coachesRoute,
]);
