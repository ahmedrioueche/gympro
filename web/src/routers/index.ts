import { Router } from "@tanstack/react-router";
import { AuthRouteTree } from "./auth";
import { RootRoute } from "./rootRoute";
import { MainRootTree } from "./main";

const routeTree = RootRoute.addChildren([AuthRouteTree, MainRootTree]);

export const router = new Router({ routeTree });
