import { createRoute } from "@tanstack/react-router";
import UserDashboardPage from "../../../app/pages/main/user/userDashboarsPage";
import { MainRootRoute } from "../MainRootRoute";

export const UserRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/dashboard",
  component: () => <UserDashboardPage />,
});
