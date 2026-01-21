import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
  homeRoute,
  membersRoute,
  notificationsRoute,
  settingsRoute,
} from "./GymCoachRoutes";

export const GymManagerRootTree = GymCoachRootRoute.addChildren([
  homeRoute,
  membersRoute,
  notificationsRoute,
  settingsRoute,
]);
