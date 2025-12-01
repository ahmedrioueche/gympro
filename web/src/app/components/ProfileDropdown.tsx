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
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
          <span className="text-white font-bold text-sm">{initials}</span>
        </div>
      }
      align="right"
    >
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="font-semibold text-sm text-text-primary">
          {user?.profile?.fullName || t("profile.defaultName")}
        </div>
        <div className="text-xs text-text-secondary">
          {user?.profile?.email || t("profile.defaultEmail")}
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
