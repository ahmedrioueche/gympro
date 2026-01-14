import {
  authApi,
  UserRole,
  type DashboardType,
  type User,
} from "@ahmedrioueche/gympro-client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCurrentUser } from "../utils";

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null; // timestamp in ms
  cacheTTL: number; // e.g., 5 minutes in ms
  activeDashboard: DashboardType; // Currently active dashboard

  // Actions
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: Partial<User["profile"]>) => void;
  updateSettings: (updates: Partial<User["appSettings"]>) => void;
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
  fetchUser: () => Promise<User | null>;

  // Dashboard methods
  setActiveDashboard: (dashboard: DashboardType) => void;
  canAccessDashboard: (dashboard: DashboardType) => boolean;
  getDefaultDashboard: () => DashboardType;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastFetchedAt: null,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      activeDashboard: "member" as DashboardType,

      // Actions
      setUser: (user) => {
        // Determine the default dashboard based on user role
        let defaultDashboard: DashboardType = "member";
        if (user) {
          if (user.role === "owner" || user.role === "manager") {
            defaultDashboard = "manager";
          } else if (user.role === "coach") {
            defaultDashboard = "coach";
          }
        }

        set({
          user,
          isAuthenticated: !!user,
          error: null,
          lastFetchedAt: Date.now(),
          activeDashboard: defaultDashboard,
        });
      },

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

      updateSettings: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                appSettings: state.user.appSettings
                  ? { ...state.user.appSettings, ...updates }
                  : (updates as any),
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

      fetchUser: async () => {
        const {
          user,
          lastFetchedAt,
          cacheTTL,
          setUser,
          clearUser,
          setLoading,
        } = get();
        const now = Date.now();
        const cacheValid = lastFetchedAt && now - lastFetchedAt < cacheTTL;

        if (user && cacheValid) {
          return user; // use cached user
        }

        setLoading(true);

        let retryCount = 0;

        while (retryCount < 2) {
          try {
            const currentUser = await getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setLoading(false);
              return currentUser;
            }

            // Try refresh if no user
            const refreshRes = await authApi.refresh();
            if (refreshRes?.success) {
              retryCount++;
              continue; // retry getCurrentUser
            }

            break; // no user and refresh failed
          } catch (err) {
            console.error("fetchUserWithCacheAndRefresh error:", err);
            retryCount++;
          }
        }

        clearUser();
        setLoading(false);
        return null;
      },

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
        return user?.role === "owner" || user?.role === "manager";
      },

      canManageSubscriptions: () => {
        const { user } = get();
        if (user?.role === "owner" || user?.role === "manager") {
          return (user as any).gymAccess?.canManageSubscriptions ?? false;
        }
        return false;
      },

      canManageMembers: () => {
        const { user } = get();
        if (user?.role === "owner" || user?.role === "manager") {
          return (user as any).gymAccess?.canManageMembers ?? false;
        }
        return false;
      },

      canManageStaff: () => {
        const { user } = get();
        if (user?.role === "owner" || user?.role === "manager") {
          return (user as any).gymAccess?.canManageStaff ?? false;
        }
        return false;
      },

      isMember: () => {
        const { user } = get();
        return user?.role === "member";
      },

      isCoach: () => {
        const { user } = get();
        return user?.role === "coach";
      },

      isStaff: () => {
        const { user } = get();
        return user?.role === "receptionist" || user?.role === "manager";
      },

      // Dashboard methods
      setActiveDashboard: (dashboard) => set({ activeDashboard: dashboard }),

      canAccessDashboard: (dashboard) => {
        const { user } = get();
        if (!user) return false;
        const access = user.dashboardAccess || ["member"];
        return access.includes(dashboard);
      },

      getDefaultDashboard: () => {
        const { user } = get();
        if (!user) return "member";
        // Default based on role
        if (user.role === "owner" || user.role === "manager") return "manager";
        if (user.role === "coach") return "coach";
        return "member";
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeDashboard: state.activeDashboard,
      }),
    }
  )
);

// Selectors for optimized component rendering
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) =>
  state.isAuthenticated;
export const selectUserRole = (state: UserState) => state.getUserRole();
export const selectUserProfile = (state: UserState) => state.user?.profile;
