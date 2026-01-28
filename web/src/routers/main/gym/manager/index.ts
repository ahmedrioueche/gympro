import { GymManagerRootRoute } from "./GymManagerRootRoute";
import {
  accessRoute,
  analyticsRoute,
  announcementsRoute,
  attendanceRoute,
  coachingRoute,
  createMemberRoute,
  homeRoute,
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
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  accessRoute,
  attendanceRoute,
  pricingRoute,
  staffRoute,
  coachingRoute,
  announcementsRoute,
]);
