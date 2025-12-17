import { createRoute } from "@tanstack/react-router";
import PaymentFailurePage from "../../app/pages/payment/failure/PaymentFailurePage";
import PaymentSuccessPage from "../../app/pages/payment/success/PaymentSuccessPage";
import { PaymentRootRoute } from "./PaymentRootRoute";

export const successRoute = createRoute({
  getParentRoute: () => PaymentRootRoute,
  path: "/success",
  component: () => <PaymentSuccessPage />,
});

export const failureRoute = createRoute({
  getParentRoute: () => PaymentRootRoute,
  path: "/failure",
  component: () => <PaymentFailurePage />,
});
