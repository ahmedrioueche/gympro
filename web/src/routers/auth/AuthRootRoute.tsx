import { Outlet, createRoute } from "@tanstack/react-router";
import { RootRoute } from "../rootRoute";
export const AuthRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/auth",
  component: () => (
    <div dir="ltr">
      <Outlet />
    </div>
  ),
});
