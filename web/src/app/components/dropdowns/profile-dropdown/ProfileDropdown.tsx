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

      {hasMultipleDashboards && (
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
