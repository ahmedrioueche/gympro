import { createRoute } from "@tanstack/react-router";
import UserDashboardPage from "../../../app/pages/main/user/userDashboarsPage";
import { MainRootRoute } from "../MainRootRoute";

export const MemberRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/member",
  component: () => <UserDashboardPage />,
});
