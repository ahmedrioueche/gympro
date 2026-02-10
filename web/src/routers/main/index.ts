import { IndexRoute } from "./IndexRoute";
import { MainRootRoute } from "./MainRootRoute";
import { onBoardingRoute } from "./MainRoutes";
import { CoachRootTree } from "./coach";
import { GymRootTree } from "./gym";
import { ManagerRootTree } from "./manager";
import { MemberRootTree } from "./member";

export const MainRouteTree = MainRootRoute.addChildren([
  IndexRoute,
  onBoardingRoute,
  MemberRootTree,
  ManagerRootTree,
  GymRootTree,
  CoachRootTree,
]);
