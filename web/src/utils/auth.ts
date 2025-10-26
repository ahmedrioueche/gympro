import { Auth } from '../api/auth/auth';

/**
 * Comprehensive logout function that handles both frontend and backend logout
 * @param redirectTo - Optional redirect path after logout (defaults to '/auth/login')
 */
export const handleLogout = async (redirectTo: string = '/auth/login'): Promise<void> => {
  try {
    // 1. Call backend logout endpoint to clear cookies and handle cleanup
    await Auth.logout();

    // 2. Clear any frontend state/storage if needed
    // (You can add Zustand store clearing here when implemented)

    // 3. Clear any localStorage/sessionStorage if used
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    // 4. Clear any other auth-related data
    // (Add more cleanup as needed)

    console.log('Logout successful');

    // 5. Redirect to login page
    window.location.href = redirectTo;
  } catch (error) {
    console.error('Logout failed:', error);

    // Even if backend logout fails, clear frontend state and redirect
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    // Force redirect to login
    window.location.href = redirectTo;
  }
};

/**
 * Check if user is currently authenticated
 * @returns boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  // Check if auth cookies exist (they're httpOnly, so we can't read them directly)
  // For now, we'll rely on the backend /me endpoint to determine auth status
  // You can enhance this when implementing Zustand store
  return false; // Placeholder - implement based on your auth state management
};

/**
 * Get current user data
 * @returns Promise<UserProfile | null>
 */
export const getCurrentUser = async () => {
  try {
    const response = await Auth.getMe();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};
