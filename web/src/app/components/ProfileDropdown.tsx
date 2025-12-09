import { useTranslation } from "react-i18next";
import Dropdown, {
  DropdownDivider,
  DropdownItem,
} from "../../components/ui/Dropdown";
import { useUserStore } from "../../store/user";

interface ProfileDropdownProps {
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onMembershipsClick?: () => void;
  onLogoutClick?: () => void;
}

export default function ProfileDropdown({
  onProfileClick,
  onSettingsClick,
  onMembershipsClick,
  onLogoutClick,
}: ProfileDropdownProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();

  const initials = user?.profile?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dropdown
      trigger={
        <>
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
        </>
      }
      align="right"
    >
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

      {/* Menu Items */}
      <DropdownItem
        icon="👤"
        label={t("profile.menu.profile.label")}
        description={t("profile.menu.profile.description")}
        onClick={onProfileClick}
      />
      <DropdownItem
        icon="⚙️"
        label={t("profile.menu.settings.label")}
        description={t("profile.menu.settings.description")}
        onClick={onSettingsClick}
      />
      <DropdownItem
        icon="🏋️"
        label={t("profile.menu.memberships.label")}
        description={t("profile.menu.memberships.description")}
        onClick={onMembershipsClick}
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
