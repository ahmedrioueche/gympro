import { MainRootRoute } from "./MainRootRoute";
import { onBoardingRoute } from "./MainRoutes";
import { CoachRootTree } from "./coach";
import { GymRootTree } from "./gym";
import { ManagerRootTree } from "./manager";
import { MemberRootTree } from "./member";

export const MainRootTree = MainRootRoute.addChildren([
  onBoardingRoute,
  MemberRootTree,
  ManagerRootTree,
  GymRootTree,
  CoachRootTree,
]);
