import { createRoute } from "@tanstack/react-router";
import LandingPage from "../../app/pages/landing/LandingPage";
import { RootRoute } from "../rootRoute";

export const landingRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/landing",
  component: () => <LandingPage />,
});
