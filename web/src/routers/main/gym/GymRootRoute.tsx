import { createRoute } from "@tanstack/react-router";
import GymPage from "../../../app/pages/main/gym/GymPage";
import { APP_PAGES } from "../../../constants/navigation";
import { useGymStore } from "../../../store/gym";
import { MainRootRoute } from "../MainRootRoute";

export const GymRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: APP_PAGES.gym.link,
  onLeave: () => {
    const { clearGym } = useGymStore.getState();
    clearGym();
  },
  component: () => <GymPage />,
});
