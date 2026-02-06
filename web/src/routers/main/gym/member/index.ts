import { GymMemberRootRoute } from "./GymMemberRootRoute";
import {
  accessRoute,
  announcementsRoute,
  attendanceRoute,
  competitionsRoute,
  homeRoute,
  inventoryRoute,
  notificationsRoute,
  settingsRoute,
  storeRoute,
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
  competitionsRoute,
  inventoryRoute,
  storeRoute,
]);
