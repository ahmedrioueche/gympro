import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
  accessRoute,
  analyticsRoute,
  announcementsRoute,
  clientsRoute,
  competitionsRoute,
  homeRoute,
  inventoryRoute,
  notificationsRoute,
  paymentsRoute,
  scheduleRoute,
  settingsRoute,
  storeRoute,
} from "./GymCoachRoutes";

export const GymCoachRootTree = GymCoachRootRoute.addChildren([
  homeRoute,
  accessRoute,
  clientsRoute,
  analyticsRoute,
  paymentsRoute,
  scheduleRoute,
  notificationsRoute,
  settingsRoute,
  announcementsRoute,
  storeRoute,
  inventoryRoute,
  competitionsRoute,
]);
