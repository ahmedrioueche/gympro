import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { MainRootTree } from "./main";
import { ManagerRootTree } from "./main/manager";
import { UserRootTree } from "./main/user";
import { RootRoute } from "./rootRoute";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRootTree,
  UserRootTree,
  ManagerRootTree,
]);

export const router = new Router({ routeTree });
