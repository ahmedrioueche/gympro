import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { MainRootTree } from "./main";
import { CoachRootTree } from "./main/coach";
import { GymRootTree } from "./main/gym";
import { ManagerRootTree } from "./main/manager";
import { MemberRootTree } from "./main/member";
import { PaymentRootTree } from "./payment";
import { RootRoute } from "./rootRoute";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRootTree,
  MemberRootTree,
  ManagerRootTree,
  GymRootTree,
  PaymentRootTree,
  CoachRootTree,
]);

export const router = new Router({ routeTree });
