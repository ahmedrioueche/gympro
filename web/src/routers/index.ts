import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { RootRoute } from "./rootRoute";
import { MainRootTree } from "./main";
import { ManagerRootTree } from "./main/manager";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRootTree,
  ManagerRootTree,
]);

export const router = new Router({ routeTree });
