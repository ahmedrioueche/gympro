import { memberProfileRoute } from "../gym/coach/GymCoachRoutes";
import { PublicRootRoute } from "./PublicRootRoute";
import { coachProfileRoute } from "./PublicRoutes";

export const publicRouteTree = PublicRootRoute.addChildren([
  coachProfileRoute,
  memberProfileRoute,
]);
