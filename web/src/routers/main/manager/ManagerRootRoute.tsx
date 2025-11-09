import { createRoute } from '@tanstack/react-router';
import ManagerPage from '../../../app/pages/main/manager/ManagerPage';
import { MainRootRoute } from '../MainRootRoute';

export const ManagerRootRoute = createRoute({
  getParentRoute: () => MainRootRoute,
  path: '/manager',
  component: () => <ManagerPage />,
});
