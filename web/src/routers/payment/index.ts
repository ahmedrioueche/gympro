import { PaymentRootRoute } from "./PaymentRootRoute";
import { failureRoute, successRoute } from "./PaymentRoutes";

export const PaymentRouteTree = PaymentRootRoute.addChildren([
  successRoute,
  failureRoute,
]);
