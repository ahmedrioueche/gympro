import type { DashboardType, UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { APP_PAGES } from "../../../../constants/navigation";
import { useUserStore } from "../../../../store/user";

export function useProfileDropdown() {
  const navigate = useNavigate();
  const { user, activeDashboard, setActiveDashboard, canAccessDashboard } =
    useUserStore();

  // Derive available dashboards from membership roles + dashboardAccess + user.role
  const availableDashboards = useMemo(() => {
    const dashboards = new Set<DashboardType>(user?.dashboardAccess || []);

    // Always include member
    dashboards.add("member");

    // Check membership roles for available dashboards
    user?.memberships?.forEach((m) => {
      if (typeof m === "string") return;
      const roles = m.roles || [];
      if (
        roles.includes("owner" as UserRole) ||
        roles.includes("manager" as UserRole) ||
        roles.includes("staff" as UserRole)
      ) {
        dashboards.add("manager");
      }
      if (roles.includes("coach" as UserRole)) {
        dashboards.add("coach");
      }
    });

    // Add based on role for backwards compatibility (users created before this feature)
    if (user?.role === "owner" || user?.role === "manager") {
      dashboards.add("manager");
    }
    if (user?.role === "coach") {
      dashboards.add("coach");
    }

    return Array.from(dashboards) as DashboardType[];
  }, [user?.dashboardAccess, user?.role, user?.memberships]);

  const hasMultipleDashboards = availableDashboards.length > 1;

  const initials = user?.profile?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleDashboardSwitch = (dashboard: DashboardType) => {
    if (!canAccessDashboard(dashboard)) return;

    setActiveDashboard(dashboard);

    // Navigate to dashboard home
    switch (dashboard) {
      case "manager":
        navigate({ to: APP_PAGES.manager.home.link });
        break;
      case "coach":
        navigate({ to: APP_PAGES.coach.link });
        break;
      case "member":
      default:
        navigate({ to: APP_PAGES.member.home.link });
        break;
    }
  };

  return {
    user,
    activeDashboard,
    availableDashboards,
    hasMultipleDashboards,
    initials,
    handleDashboardSwitch,
  };
}
