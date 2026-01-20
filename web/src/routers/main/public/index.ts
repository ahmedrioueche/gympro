import { PublicRootRoute } from "./PublicRootRoute";
import { coachProfileRoute, memberProfileRoute } from "./PublicRoutes";

export const publicRouteTree = PublicRootRoute.addChildren([
  coachProfileRoute,
  memberProfileRoute,
]);
