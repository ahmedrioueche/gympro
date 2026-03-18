import { landingRootRoute } from "./LandingRootRoute";
import {
  coachRoute,
  cookiesRoute,
  homeRoute,
  managerRoute,
  memberRoute,
  privacyRoute,
  termsRoute,
} from "./LandingRoutes";

export const landingRouteTree = landingRootRoute.addChildren([
  homeRoute,
  memberRoute,
  managerRoute,
  coachRoute,
  privacyRoute,
  termsRoute,
  cookiesRoute,
]);
