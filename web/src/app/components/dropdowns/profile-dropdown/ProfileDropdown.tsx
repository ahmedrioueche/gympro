import type { DashboardType, UserRole } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Dumbbell, GraduationCap } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import { APP_PAGES } from "../../../../constants/navigation";
import { useUserStore } from "../../../../store/user";

const DASHBOARD_CONFIG: Record<
  DashboardType,
  { icon: typeof Dumbbell; label: string; emoji: string }
> = {
  member: { icon: Dumbbell, label: "dashboard.member", emoji: "🏋️" },
  coach: { icon: GraduationCap, label: "dashboard.coach", emoji: "🎓" },
  manager: { icon: Briefcase, label: "dashboard.manager", emoji: "💼" },
};

interface ProfileDropdownProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onMembershipsClick?: () => void;
  onLogoutClick?: () => void;
  disabled?: boolean;
}

export default function ProfileDropdown({
  onSettingsClick,
  onLogoutClick,
  disabled = false,
}: ProfileDropdownProps) {
  const { t } = useTranslation();
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

  const avatarElement = (
    <>
      {user?.profile?.profileImageUrl ? (
        <img
          src={user.profile.profileImageUrl}
          alt={user?.profile?.fullName || "User"}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
          {initials}
        </div>
      )}
    </>
  );

  // If disabled, just return the avatar without dropdown functionality
  if (disabled) {
    return <div className="cursor-default">{avatarElement}</div>;
  }

  return (
    <Dropdown trigger={avatarElement} align="right">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        {/* Avatar */}
        {user?.profile?.profileImageUrl ? (
          <img
            src={user.profile.profileImageUrl}
            alt={user?.profile?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
            {initials}
          </div>
        )}

        {/* Name & Email */}
        <div className="flex flex-col min-w-0">
          <div className="font-semibold text-sm text-text-primary truncate">
            {user?.profile?.fullName || t("profile.defaultName")}
          </div>
          <div className="text-xs text-text-secondary truncate">
            {user?.profile?.email || t("profile.defaultEmail")}
          </div>
        </div>
      </div>

      {/* Dashboard Switcher Section */}
      {hasMultipleDashboards && (
        <>
          <div className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {t("dashboard.switchDashboard", "Switch Dashboard")}
          </div>
          {availableDashboards.map((dashboard) => {
            const config = DASHBOARD_CONFIG[dashboard];
            const isActive = dashboard === activeDashboard;

            return (
              <DropdownItem
                key={dashboard}
                icon={config.emoji}
                label={t(config.label)}
                onClick={() => handleDashboardSwitch(dashboard)}
                className={isActive ? "bg-primary/10" : ""}
              />
            );
          })}
          <DropdownDivider />
        </>
      )}

      <DropdownItem
        icon="⚙️"
        label={t("profile.menu.settings.label")}
        description={t("profile.menu.settings.description")}
        onClick={onSettingsClick}
      />

      <DropdownDivider />

      <DropdownItem
        icon="🚪"
        label={t("profile.menu.logout")}
        variant="danger"
        onClick={onLogoutClick}
      />
    </Dropdown>
  );
}
