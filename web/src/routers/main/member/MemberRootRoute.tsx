import { createRoute } from "@tanstack/react-router";
import MemberPage from "../../../app/pages/main/member/MemberPage";
import { MainRootRoute } from "../MainRootRoute";

export const MemberRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/member",
  component: () => <MemberPage />,
});
