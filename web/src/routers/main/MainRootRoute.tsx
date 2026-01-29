import { createRoute } from "@tanstack/react-router";
import MainPage from "../../app/pages/main/MainPage";
import { OnboardingGuard } from "../../components/guards/OnboardingGuard";
import { SubscriptionGuard } from "../../components/guards/SubscriptionGuard";
import NotFound from "../../components/ui/NotFound";
import ProtectedRoute from "../../ProtectedRoute";
import { RootRoute } from "../rootRoute";

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  id: "main-layout",
  component: () => (
    <ProtectedRoute>
      <OnboardingGuard>
        <SubscriptionGuard>
          <MainPage />
        </SubscriptionGuard>
      </OnboardingGuard>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <NotFound bgColor="bg-background" />,
});
