import { createRoute } from "@tanstack/react-router";
import CoachProfilePage from "../../../app/pages/main/public/coach-profile/CoachProfilePage";
import MemberProfilePage from "../../../app/pages/main/public/member-profile/MemberProfilePage";
import { PublicRootRoute } from "./PublicRootRoute";

export const coachProfileRoute = createRoute({
  getParentRoute: () => PublicRootRoute,
  path: "/coach/profile/$coachId",
  component: () => <CoachProfilePage />,
});

export const memberProfileRoute = createRoute({
  getParentRoute: () => PublicRootRoute,
  path: "/member/profile/$userId",
  component: () => <MemberProfilePage />,
});
