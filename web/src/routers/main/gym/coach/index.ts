import { GymCoachRootRoute } from "./GymCoachRootRoute";
import {
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
