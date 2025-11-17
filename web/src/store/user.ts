import { type User, UserRole } from '@ahmedrioueche/gympro-client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User['profile']>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed/Helper methods
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isOwnerOrManager: () => boolean;
  canManageSubscriptions: () => boolean;
  canManageMembers: () => boolean;
  canManageStaff: () => boolean;
  isMember: () => boolean;
  isCoach: () => boolean;
  isStaff: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? ({ ...state.user, ...updates } as User) : null,
        })),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                profile: { ...state.user.profile, ...updates },
              }
            : null,
        })),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Helper methods
      getUserRole: () => {
        const { user } = get();
        return (user?.role as UserRole) || null;
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;

        if (Array.isArray(role)) {
          return role.includes(user.role as UserRole);
        }
        return user.role === role;
      },

      isOwnerOrManager: () => {
        const { user } = get();
        return user?.role === 'owner' || user?.role === 'manager';
      },

      canManageSubscriptions: () => {
        const { user } = get();
        if (user?.role === 'owner' || user?.role === 'manager') {
          return (user as any).gymAccess?.canManageSubscriptions ?? false;
        }
        return false;
      },

      canManageMembers: () => {
        const { user } = get();
        if (user?.role === 'owner' || user?.role === 'manager') {
          return (user as any).gymAccess?.canManageMembers ?? false;
        }
        return false;
      },

      canManageStaff: () => {
        const { user } = get();
        if (user?.role === 'owner' || user?.role === 'manager') {
          return (user as any).gymAccess?.canManageStaff ?? false;
        }
        return false;
      },

      isMember: () => {
        const { user } = get();
        return user?.role === 'member';
      },

      isCoach: () => {
        const { user } = get();
        return user?.role === 'coach';
      },

      isStaff: () => {
        const { user } = get();
        return user?.role === 'staff';
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for optimized component rendering
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
export const selectUserRole = (state: UserState) => state.getUserRole();
export const selectUserProfile = (state: UserState) => state.user?.profile;
