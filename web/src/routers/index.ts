import { Router } from "@tanstack/react-router";
import { adminRouteTree } from "./admin";
import { AuthRouteTree } from "./auth";
import { landingRouteTree } from "./landing";
import { MainRouteTree } from "./main";
import { PaymentRouteTree } from "./payment";
import { RootRoute } from "./rootRoute";

const routeTree = RootRoute.addChildren([
  AuthRouteTree,
  MainRouteTree,
  PaymentRouteTree,
  adminRouteTree,
  landingRouteTree,
]);

export const router = new Router({ routeTree });
