import { createRoute } from "@tanstack/react-router";
import PaymentPage from "../../app/pages/payment/PaymentPage";
import { MainRootRoute } from "../main/MainRootRoute";

export const PaymentRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/payment",
  component: () => <PaymentPage />,
});
