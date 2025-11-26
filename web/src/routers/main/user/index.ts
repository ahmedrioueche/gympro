import { UserRootRoute } from "./UserRootRoute";
import { homeRoute, notificationsRoute, settingsRoute } from "./UserRoutes";

export const UserRootTree = UserRootRoute.addChildren([
  homeRoute,
  notificationsRoute,
  settingsRoute,
]);
