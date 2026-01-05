import { createRoute } from "@tanstack/react-router";
import GymManagerPage from "../../../../app/pages/main/gym/manager/GymManagerPage";
import { GymRootRoute } from "../GymRootRoute";

export const GymManagerRootRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/manager",
  component: () => <GymManagerPage />,
});
