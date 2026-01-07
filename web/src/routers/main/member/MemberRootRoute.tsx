import { createRoute } from "@tanstack/react-router";
import MemberPage from "../../../app/pages/main/member/MemberPage";
import NotFound from "../../../components/ui/NotFound";
import { MainRootRoute } from "../MainRootRoute";

export const MemberRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/member",
  component: () => <MemberPage />,
  notFoundComponent: () => <NotFound />,
});
