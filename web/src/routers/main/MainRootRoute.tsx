import { createRoute } from '@tanstack/react-router';
import MainPage from '../../app/pages/main/MainPage';
import { OnboardingGuard } from '../../components/OnboardingGuard';
import NotFound from '../../components/ui/NotFound';
import ProtectedRoute from '../../ProtectedRoute';
import { RootRoute } from '../rootRoute';

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <OnboardingGuard>
        <MainPage />
      </OnboardingGuard>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <NotFound />,
});
