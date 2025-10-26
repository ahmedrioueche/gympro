import { MainRootRoute } from './MainRootRoute';
import { onBoardingRoute } from './MainRoutes';

export const MainRootTree = MainRootRoute.addChildren([onBoardingRoute]);
