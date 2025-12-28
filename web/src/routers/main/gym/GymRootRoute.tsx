import { createRoute } from "@tanstack/react-router";
import GymPage from "../../../app/pages/main/gym/GymPage";
import { APP_PAGES } from "../../../constants/navigation";
import { MainRootRoute } from "../MainRootRoute";

export const GymRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: APP_PAGES.gym.link,

  component: () => <GymPage />,
});
