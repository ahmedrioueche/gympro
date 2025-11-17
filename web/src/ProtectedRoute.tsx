import { authApi } from '@ahmedrioueche/gympro-client';
import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useRef } from 'react';
import LoadingPage from './components/ui/LoadingPage';
import { useUserStore } from './store/user';
import { getCurrentUser } from './utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const MAX_RETRY_ATTEMPTS = 2;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const retryCountRef = useRef(0);
  const isCheckingRef = useRef(false);

  const { user, isLoading, setUser, setLoading, clearUser, isAuthenticated } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent concurrent auth checks
      if (isCheckingRef.current) {
        return;
      }

      isCheckingRef.current = true;
      setLoading(true);

      try {
        // Try to get current user from the API
        const user = await getCurrentUser();

        if (!user) {
          // Check retry limit to prevent infinite loops
          if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
            clearUser();
            router.navigate({ to: '/auth/login' });
            setLoading(false);
            return;
          }

          // Try to refresh the token before redirecting to login
          try {
            const refreshRes = await authApi.refresh();
            console.log('ProtectedRoute: refresh response:', refreshRes);

            if (refreshRes && refreshRes.success) {
              // Token refreshed successfully, retry the auth check
              retryCountRef.current++;

              setTimeout(() => {
                isCheckingRef.current = false;
                checkAuth();
              }, 100);
              return;
            }
          } catch (refreshError) {
            console.error('ProtectedRoute: Token refresh failed:', refreshError);
          }

          clearUser();
          router.navigate({ to: '/auth/login' });
          setLoading(false);
          return;
        }

        // Set user in store - this is where we populate the store!
        setUser(user);

        // Check if email is verified
        if (user.profile.isValidated === false) {
          router.navigate({ to: '/auth/verify-email' });
          setLoading(false);
          return;
        }

        // Check if onboarding is completed
        if (user.profile.isOnBoarded === false) {
          router.navigate({ to: '/onboarding' });
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error('ProtectedRoute: Auth check failed:', error);

        // Check retry limit to prevent infinite loops
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          clearUser();
          router.navigate({ to: '/auth/login' });
          setLoading(false);
          return;
        }

        // Try to refresh the token before redirecting to login
        try {
          const refreshRes = await authApi.refresh();
          if (refreshRes && refreshRes.success) {
            // Token refreshed successfully, retry the auth check
            retryCountRef.current++;

            setTimeout(() => {
              isCheckingRef.current = false;
              checkAuth();
            }, 100);
            return;
          }
        } catch (refreshError) {
          console.error('ProtectedRoute: Token refresh failed:', refreshError);
        }

        // If refresh fails, redirect to login
        console.log('ProtectedRoute: Refresh failed, redirecting to login');
        clearUser();
        router.navigate({ to: '/auth/login' });
        setLoading(false);
      } finally {
        isCheckingRef.current = false;
      }
    };

    // Only check auth if user is not already authenticated or if we don't have user data
    if (!isAuthenticated || !user) {
      checkAuth();
    } else {
      // User is already authenticated, just verify the stored data is still valid
      setLoading(false);
    }
  }, [router, setUser, setLoading, clearUser, isAuthenticated, user]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
