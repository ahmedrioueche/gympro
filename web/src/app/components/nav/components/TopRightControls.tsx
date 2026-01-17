import NotificationsDropdown from "../../NotificationsDropdown";
import ProfileDropdown from "../../ProfileDropdown";

interface TopRightControlsProps {
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onMembershipsClick: () => void;
  onLogoutClick: () => void;
}

export const TopRightControls = ({
  onProfileClick,
  onSettingsClick,
  onMembershipsClick,
  onLogoutClick,
}: TopRightControlsProps) => (
  <div className="flex items-center gap-2 md:gap-4 px-4 py-4">
    <NotificationsDropdown />

    <ProfileDropdown
      onProfileClick={onProfileClick}
      onSettingsClick={onSettingsClick}
      onMembershipsClick={onMembershipsClick}
      onLogoutClick={onLogoutClick}
    />
  </div>
);
