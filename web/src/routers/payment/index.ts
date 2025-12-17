import { PaymentRootRoute } from "./PaymentRootRoute";
import { failureRoute, successRoute } from "./PaymentRoutes";

export const PaymentRootTree = PaymentRootRoute.addChildren([
  successRoute,
  failureRoute,
]);
