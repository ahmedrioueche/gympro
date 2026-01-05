import { GymMemberRootRoute } from "./GymMemberRootRoute";
import {
  accessRoute,
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
]);
