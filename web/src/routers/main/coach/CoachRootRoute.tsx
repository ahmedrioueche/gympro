import { createRoute } from "@tanstack/react-router";
import CoachPage from "../../../app/pages/main/coach/CoachPage";
import NotFound from "../../../components/ui/NotFound";
import { MainRootRoute } from "../MainRootRoute";

export const CoachRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/coach",
  component: () => <CoachPage />,
  notFoundComponent: () => <NotFound />,
});
