import { createRoute } from "@tanstack/react-router";
import ManagerPage from "../../../app/pages/main/manager/ManagerPage";
import { APP_PAGES } from "../../../constants/navigation";
import { MainRootRoute } from "../MainRootRoute";

export const ManagerRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: APP_PAGES.manager.link,
  component: () => <ManagerPage />,
});
