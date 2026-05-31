import { UserRole } from "@ahmedrioueche/gympro-client";
import { Maximize2, Minimize2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Dropdown, {
  DropdownDivider,
  DropdownItem,
} from "../../../../components/ui/Dropdown";
import { useFullscreen } from "../../../../hooks/useFullscreen";
import useScreen from "../../../../hooks/useScreen";
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
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  disabled = false,
}: ProfileDropdownProps) {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const { isFullscreen, isSupported, toggleFullscreen } = useFullscreen();

  const {
    user,
    activeDashboard,
    availableDashboards,
    hasMultipleDashboards,
    initials,
    handleDashboardSwitch,
  } = useProfileDropdown();

  const avatarElement = <ProfileAvatar user={user} initials={initials} />;

  if (disabled) {
    return <div className="cursor-default">{avatarElement}</div>;
  }

  return (
    <Dropdown trigger={avatarElement} align="right">
      {(closeDropdown) => (
        <>
          <ProfileHeader user={user} initials={initials} />

          <DropdownItem
            icon="👤"
            label={t("profile.menu.profile.label")}
            description={t("profile.menu.profile.description")}
            onClick={() => {
              closeDropdown();
              onProfileClick?.();
            }}
          />

          {hasMultipleDashboards &&
            user.role !== UserRole.Admin &&
            user.role !== UserRole.AppEditor && (
              <DashboardSwitcher
                availableDashboards={availableDashboards}
                activeDashboard={activeDashboard}
                onSwitch={(dashboard) => {
                  closeDropdown();
                  handleDashboardSwitch(dashboard);
                }}
              />
            )}

          <DropdownItem
            icon="⚙️"
            label={t("profile.menu.settings.label")}
            description={t("profile.menu.settings.description")}
            onClick={() => {
              closeDropdown();
              onSettingsClick?.();
            }}
          />

          {!availableDashboards.includes("coach") &&
            user.role !== UserRole.Coach &&
            user.coachVerification?.status !== "pending" &&
            user.role !== UserRole.Admin && (
              <DropdownItem
                icon="🎓"
                label={t("profile.menu.becomeCoach.label")}
                description={t("profile.menu.becomeCoach.description")}
                onClick={() => {
                  closeDropdown();
                  import("../../../../store/modal").then(
                    ({ useModalStore }) => {
                      useModalStore
                        .getState()
                        .openModal("request_coach_access");
                    },
                  );
                }}
              />
            )}

          {isMobile && (
            <>
              <DropdownDivider />
              <DropdownItem
                icon={
                  isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )
                }
                label={
                  isFullscreen
                    ? t("profile.menu.fullscreen.exit")
                    : t("profile.menu.fullscreen.enter")
                }
                description={t("profile.menu.fullscreen.description")}
                onClick={async () => {
                  closeDropdown();
                  if (!isSupported) {
                    toast.error(t("profile.menu.fullscreen.unsupported"));
                    return;
                  }
                  const ok = await toggleFullscreen();
                  if (!ok) {
                    toast.error(t("profile.menu.fullscreen.unsupported"));
                  }
                }}
              />
              <DropdownDivider />
            </>
          )}

          {!isMobile && <DropdownDivider />}

          <DropdownItem
            icon="🚪"
            label={t("profile.menu.logout")}
            variant="danger"
            onClick={() => {
              closeDropdown();
              onLogoutClick?.();
            }}
          />
        </>
      )}
    </Dropdown>
  );
}
