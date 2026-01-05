import { UserRole } from "@ahmedrioueche/gympro-client";
import { createRoute } from "@tanstack/react-router";
import GymManagerPage from "../../../../app/pages/main/gym/manager/GymManagerPage";
import { GymRoleGuard } from "../../../../components/guards/GymRoleGuard";
import { GymRootRoute } from "../GymRootRoute";

export const GymManagerRootRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/manager",
  component: () => (
    <GymRoleGuard allowedRoles={[UserRole.Owner, UserRole.Manager]}>
      <GymManagerPage />
    </GymRoleGuard>
  ),
});
