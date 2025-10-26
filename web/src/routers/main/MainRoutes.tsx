import { createRoute } from '@tanstack/react-router';
import { OnBoardingPage } from '../../app/main/onBoarding/OnBoardingPage';
import { MainRootRoute } from './MainRootRoute';

export const onBoardingRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: '/onboarding',
  component: () => <OnBoardingPage />,
});
