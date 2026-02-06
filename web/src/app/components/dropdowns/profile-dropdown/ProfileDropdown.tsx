import { UserRole } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import { DashboardSwitcher } from "./DashboardSwitcher";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileHeader } from "./ProfileHeader";
import { useProfileDropdown } from "./useProfileDropdown";

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

  const {
    user,
    activeDashboard,
    availableDashboards,
    hasMultipleDashboards,
    initials,
    handleDashboardSwitch,
  } = useProfileDropdown();

  const avatarElement = <ProfileAvatar user={user} initials={initials} />;

  // If disabled, just return the avatar without dropdown functionality
  if (disabled) {
    return <div className="cursor-default">{avatarElement}</div>;
  }

  return (
    <Dropdown trigger={avatarElement} align="right">
      <ProfileHeader user={user} initials={initials} />

      {hasMultipleDashboards &&
        user.role !== UserRole.Admin &&
        user.role !== UserRole.AppEditor && (
          <DashboardSwitcher
            availableDashboards={availableDashboards}
            activeDashboard={activeDashboard}
            onSwitch={handleDashboardSwitch}
          />
        )}

      <DropdownItem
        icon="⚙️"
        label={t("profile.menu.settings.label")}
        description={t("profile.menu.settings.description")}
        onClick={onSettingsClick}
      />

      {/* Coach Request - Only if not a coach and not an admin */}
      {!availableDashboards.includes("coach") &&
        user.role !== UserRole.Coach &&
        user.coachVerification?.status !== "pending" &&
        user.role !== UserRole.Admin && (
          <DropdownItem
            icon="🎓"
            label={t("profile.menu.becomeCoach", "Become a Coach")}
            description={t(
              "profile.menu.becomeCoachDesc",
              "Request coach access",
            )}
            onClick={() => {
              import("../../../../store/modal").then(({ useModalStore }) => {
                useModalStore.getState().openModal("request_coach_access");
              });
            }}
          />
        )}

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
