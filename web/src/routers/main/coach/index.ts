import { CoachRootRoute } from "./CoachRootRoute";
import {
  analyticsRoute,
  clientsRoute,
  exercisesRoute,
  gymsRoute,
  homeRoute,
  notificationsRoute,
  paymentsRoute,
  pricingRoute,
  programsRoute,
  scheduleRoute,
  settingsRoute,
} from "./CoachRoutes";

export const CoachRootTree = CoachRootRoute.addChildren([
  homeRoute,
  gymsRoute,
  scheduleRoute,
  clientsRoute,
  programsRoute,
  settingsRoute,
  notificationsRoute,
  exercisesRoute,
  analyticsRoute,
  pricingRoute,
  paymentsRoute,
]);
