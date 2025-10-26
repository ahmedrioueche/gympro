import { createRootRoute } from '@tanstack/react-router';
import App from '../App';
import { OnboardingGuard } from '../components/OnboardingGuard';
import NotFound from '../components/ui/NotFound';

export const RootRoute = createRootRoute({
  component: () => (
    <OnboardingGuard>
      <App />
    </OnboardingGuard>
  ),
  notFoundComponent: () => <NotFound />,
});
