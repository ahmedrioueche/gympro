import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
  accessRoute,
  analyticsRoute,
  attendanceRoute,
  homeRoute,
  membersRoute,
  notificationsRoute,
  pricingRoute,
  settingsRoute,
  staffRoute,
  subscriptionsRoute,
} from "./GymCoachRoutes";

export const GymManagerRootTree = GymCoachRootRoute.addChildren([
  homeRoute,
  subscriptionsRoute,
  membersRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  accessRoute,
  attendanceRoute,
  pricingRoute,
  staffRoute,
]);
