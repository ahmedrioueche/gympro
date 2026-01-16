import { createRoute } from "@tanstack/react-router";
import PublicPage from "../../../app/pages/main/public/PublicPage";
import NotFound from "../../../components/ui/NotFound";
import { MainRootRoute } from "../MainRootRoute";

export const PublicRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/public",
  component: () => <PublicPage />,
  notFoundComponent: () => <NotFound />,
});
