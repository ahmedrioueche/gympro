import { GymManagerRootRoute } from "./GymManagerRootRoute";
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
} from "./GymManagerRoutes";

export const GymManagerRootTree = GymManagerRootRoute.addChildren([
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
