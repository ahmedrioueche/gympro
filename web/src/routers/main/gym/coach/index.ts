import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
  accessRoute,
  analyticsRoute,
  attendanceRoute,
  createMemberRoute,
  homeRoute,
  memberProfileRoute,
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
  createMemberRoute,
  memberProfileRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  accessRoute,
  attendanceRoute,
  pricingRoute,
  staffRoute,
]);
