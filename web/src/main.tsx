import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { AppContextProvider } from './context/AppContext.tsx';
import { OnboardingProvider } from './context/OnboardingContext.tsx';
import './i18n';
import './index.css';
import { router } from './routers/index.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position={'bottom-left'} />
      <AppContextProvider>
        <OnboardingProvider>
          <RouterProvider router={router} />
        </OnboardingProvider>
      </AppContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
