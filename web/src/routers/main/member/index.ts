import { MemberRootRoute } from "./MemberRootRoute";
import { homeRoute, notificationsRoute, settingsRoute } from "./MemberRoutes";

export const MemberRootTree = MemberRootRoute.addChildren([
  homeRoute,
  notificationsRoute,
  settingsRoute,
]);
