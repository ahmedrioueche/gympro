import { useRouter } from '@tanstack/react-router';
import React, { useEffect, useRef, useState } from 'react';
import { Auth } from './api/auth/auth';
import LoadingPage from './components/ui/LoadingPage';
import { handleLogout } from './utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const MAX_RETRY_ATTEMPTS = 2; // Prevent infinite loops

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const retryCountRef = useRef(0);
  const isCheckingRef = useRef(false); // Prevent concurrent auth checks

  useEffect(() => {
    const checkAuth = async () => {
      // Prevent concurrent auth checks
      if (isCheckingRef.current) {
        return;
      }

      isCheckingRef.current = true;

      try {
        const res = await Auth.getMe();

        if (!res || !res.success) {
          // Check retry limit to prevent infinite loops
          if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
            await handleLogout('/auth/login');
            setLoading(false);
            return;
          }

          // Try to refresh the token before redirecting to login
          try {
            const refreshRes = await Auth.refreshToken();
            console.log('ProtectedRoute: refresh response:', refreshRes);

            if (refreshRes && refreshRes.success) {
              // Token refreshed successfully, retry the auth check
              retryCountRef.current++;

              // Use setTimeout to prevent immediate recursive call
              setTimeout(() => {
                isCheckingRef.current = false;
                checkAuth();
              }, 100);
              return;
            }
          } catch (refreshError) {
            console.error('ProtectedRoute: Token refresh failed:', refreshError);
          }

          await handleLogout('/auth/login');
          setLoading(false);
          return;
        }

        const user = res.data;

        // Check if email is verified (using your backend field name)
        if (user.isVerified === false) {
          router.navigate({ to: '/auth/verify-email' });
          setLoading(false);
          return;
        }

        // Check if onboarding is completed
        if (user.isOnBoarded === false) {
          router.navigate({ to: '/onboarding' });
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        // Check retry limit to prevent infinite loops
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          await handleLogout('/auth/login');
          setLoading(false);
          return;
        }

        // Try to refresh the token before redirecting to login
        try {
          const refreshRes = await Auth.refreshToken();
          if (refreshRes && refreshRes.success) {
            // Token refreshed successfully, retry the auth check
            retryCountRef.current++;

            // Use setTimeout to prevent immediate recursive call
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
        await handleLogout('/auth/login');
        setLoading(false);
        return;
      } finally {
        isCheckingRef.current = false;
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
