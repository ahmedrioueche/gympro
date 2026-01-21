import { GymCoachRootTree } from "./coach";
import { GymRootRoute } from "./GymRootRoute";
import { GymManagerRootTree } from "./manager";
import { GymMemberRootTree } from "./member";

export const GymRootTree = GymRootRoute.addChildren([
  GymMemberRootTree,
  GymManagerRootTree,
  GymCoachRootTree,
]);
