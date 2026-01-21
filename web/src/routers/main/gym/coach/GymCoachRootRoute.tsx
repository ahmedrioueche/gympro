import { createRoute } from "@tanstack/react-router";
import GymCoachPage from "../../../../app/pages/main/gym/coach/GymCoachPage";
import { GymRoleGuard } from "../../../../components/guards/GymRoleGuard";
import NotFound from "../../../../components/ui/NotFound";
import { GymRootRoute } from "../GymRootRoute";

export const GymCoachRootRoute = createRoute({
  getParentRoute: () => GymRootRoute,
  path: "/coach",
  component: () => (
    <GymRoleGuard allowedRoles={["coach"]}>
      <GymCoachPage />
    </GymRoleGuard>
  ),
  notFoundComponent: () => <NotFound />,
});
