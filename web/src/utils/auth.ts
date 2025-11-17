import { authApi } from '@ahmedrioueche/gympro-client';
import { useUserStore } from '../store/user';

export const handleLogout = async (redirectTo: string = '/auth/login') => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    useUserStore.getState().clearUser();
    window.location.href = redirectTo;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await authApi.getMe();
    if (response.success && response.data) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};
