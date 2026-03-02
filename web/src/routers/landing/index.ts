import { landingRootRoute } from "./AdminRootRoute";
import {
  coachRoute,
  cookiesRoute,
  homeRoute,
  managerRoute,
  memberRoute,
  privacyRoute,
  termsRoute,
} from "./AdminRoutes";

export const landingRouteTree = landingRootRoute.addChildren([
  homeRoute,
  memberRoute,
  managerRoute,
  coachRoute,
  privacyRoute,
  termsRoute,
  cookiesRoute,
]);
