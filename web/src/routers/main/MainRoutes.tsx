import { createRoute } from '@tanstack/react-router';
import { OnboardingPage } from '../../app/pages/main/onboarding/OnboardingPage';
import { MainRootRoute } from './MainRootRoute';

export const onBoardingRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: '/onboarding',
  component: () => <OnboardingPage />,
});
