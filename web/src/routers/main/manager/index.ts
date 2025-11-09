import { ManagerRootRoute } from "./ManagerRootRoute";
import {
  analyticsRoute,
  coachingRoute,
  membersRoute,
  notificationsRoute,
  settingsRoute,
  subscriptionsRoute,
} from "./ManagerRoutes";

export const ManagerRootTree = ManagerRootRoute.addChildren([
  membersRoute,
  subscriptionsRoute,
  notificationsRoute,
  analyticsRoute,
  settingsRoute,
  coachingRoute,
]);
