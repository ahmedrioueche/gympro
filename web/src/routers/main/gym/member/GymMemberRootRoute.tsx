import { UserRole } from "@ahmedrioueche/gympro-client";
import { createRoute } from "@tanstack/react-router";
import GymMemberPage from "../../../../app/pages/main/gym/member/GymMemberPage";
import { GymRoleGuard } from "../../../../components/guards/GymRoleGuard";
import NotFound from "../../../../components/ui/NotFound";
import { GymRootRoute } from "../GymRootRoute";

export const GymMemberRootRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/member",
  component: () => (
    <GymRoleGuard
      allowedRoles={[UserRole.Member, UserRole.Owner, UserRole.Manager]}
    >
      <GymMemberPage />
    </GymRoleGuard>
  ),
  notFoundComponent: () => <NotFound />,
});
