import { createRoute } from '@tanstack/react-router';
import { OnBoardingPage } from '../../app/pages/main/onBoarding/OnBoardingPage';
import { MainRootRoute } from './MainRootRoute';

export const onBoardingRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: '/onboarding',
  component: () => <OnBoardingPage />,
});
