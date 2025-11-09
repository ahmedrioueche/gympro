import { createRoute } from "@tanstack/react-router";
import MainPage from "../../app/pages/main/MainPage";
import { RootRoute } from "../rootRoute";

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: () => <MainPage />,
});
