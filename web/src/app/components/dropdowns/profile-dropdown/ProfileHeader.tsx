import type { User } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeaderProps {
  user: User | null;
  initials?: string;
}

export function ProfileHeader({ user, initials }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-3 border-b border-border flex items-center gap-3">
      <ProfileAvatar user={user} initials={initials} />
      <div className="flex flex-col min-w-0">
        <div className="font-semibold text-sm text-text-primary truncate">
          {user?.profile?.fullName || t("profile.defaultName")}
        </div>
        <div className="text-xs text-text-secondary truncate">
          {user?.profile?.email || t("profile.defaultEmail")}
        </div>
      </div>
    </div>
  );
}
