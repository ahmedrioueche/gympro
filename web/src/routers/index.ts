import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { MainRootTree } from "./main";
import { GymRootTree } from "./main/gym";
import { ManagerRootTree } from "./main/manager";
import { MemberRootTree } from "./main/member";
import { RootRoute } from "./rootRoute";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRootTree,
  MemberRootTree,
  ManagerRootTree,
  GymRootTree,
]);

export const router = new Router({ routeTree });
