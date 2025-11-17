import { Outlet, createRoute } from '@tanstack/react-router';
import NotFound from '../../components/ui/NotFound';
import { RootRoute } from '../rootRoute';
export const AuthRootRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: '/auth',
  component: () => (
    <div dir='ltr'>
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <NotFound />,
});
