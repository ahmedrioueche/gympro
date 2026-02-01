import { createRoute } from "@tanstack/react-router";
import AdminPage from "../../app/pages/admin/AdminPage";
import { AdminGuard } from "../../components/guards/AdminGuard";
import { MainRootRoute } from "../main/MainRootRoute";

export const adminRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/admin",
  component: () => (
    <AdminGuard>
      <AdminPage />
    </AdminGuard>
  ),
});
