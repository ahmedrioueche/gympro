import { createRoute } from "@tanstack/react-router";
import GymMemberPage from "../../../../app/pages/main/gym/member/GymMemberPage";
import { GymRootRoute } from "../GymRootRoute";

export const GymMemberRootRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/member",
  component: () => <GymMemberPage />,
});
