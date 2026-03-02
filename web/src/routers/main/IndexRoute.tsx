import { createRoute, Navigate } from "@tanstack/react-router";
import { useUserStore } from "../../store/user";
import { getRedirectUrl } from "../../utils/roles";
import { MainRootRoute } from "./MainRootRoute";

export const IndexRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/",
  component: () => {
    const { user } = useUserStore();

    if (!user) {
      return <Navigate to="/landing" />;
    }

    const redirectUrl = getRedirectUrl({
      role: user.role as any,
      isOnBoarded: user.profile.isOnBoarded,
    });

    return <Navigate to={redirectUrl} />;
  },
});
