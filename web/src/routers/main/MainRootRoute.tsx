import { createRoute } from '@tanstack/react-router';
import MainPage from '../../app/main/MainPage';
import ProtectedRoute from '../../ProtectedRoute';
import { RootRoute } from '../rootRoute';

export const MainRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  ),
});
