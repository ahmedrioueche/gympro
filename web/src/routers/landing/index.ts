import { landingRootRoute } from "./AdminRootRoute";
import {
  coachRoute,
  homeRoute,
  managerRoute,
  memberRoute,
} from "./AdminRoutes";

export const landingRouteTree = landingRootRoute.addChildren([
  homeRoute,
  memberRoute,
  managerRoute,
  coachRoute,
]);
