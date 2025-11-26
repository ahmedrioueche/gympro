import { createRoute } from "@tanstack/react-router";
import { OnboardingPage } from "../../app/pages/main/onBoarding/OnBoardingPage";
import { AlreadyOnboardedGuard } from "../../components/AlreadyOnboardedGuard";
import { MainRootRoute } from "./MainRootRoute";

export const onBoardingRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: "/onboarding",
  component: () => (
    <AlreadyOnboardedGuard>
      <OnboardingPage />
    </AlreadyOnboardedGuard>
  ),
});
