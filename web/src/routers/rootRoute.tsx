import { createRootRoute } from "@tanstack/react-router";
import App from "../App";
import NotFound from "../components/ui/NotFound";

export const RootRoute = createRootRoute({
  component: () => <App />,
  notFoundComponent: () => <NotFound bgColor="bg-background" />,
});
