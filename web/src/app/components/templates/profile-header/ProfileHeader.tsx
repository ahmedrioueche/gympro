import {
  type GetSubscriptionDto,
  type User,
} from "@ahmedrioueche/gympro-client";
import { Shield } from "lucide-react";

import GradientCard from "../../../../components/ui/GradientCard";
import ProfileAvatar from "./components/ProfileAvatar";
import ProfileInfoGrid from "./components/ProfileInfoGrid";
import { useProfileHeader } from "./hooks/useProfileHeader";

interface ProfileHeaderProps {
  user: User;
  subscription?: GetSubscriptionDto | null;
  /**
   * Optional action button to display in the top right (desktop) or below info (mobile)
   */
  action?: React.ReactNode;
}

function ProfileHeader({ user, subscription, action }: ProfileHeaderProps) {
  const { accountStatus, StatusIcon, location, roleDisplay } = useProfileHeader(
    user,
    subscription,
  );

  return (
    <GradientCard header={true} contentClassName="p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-6">
        {/* Avatar & Primary Info */}
        <div className="flex items-start gap-4">
          <ProfileAvatar user={user} />

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
              {user.profile.fullName || user.profile.username}
            </h1>
            {user.profile.fullName && user.profile.username && (
              <p className="text-text-secondary text-sm mb-2">
                @{user.profile.username}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold rounded-lg border border-border">
                <Shield className="w-3.5 h-3.5" />
                {roleDisplay}
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 ${accountStatus.bgColor} ${accountStatus.color} text-xs font-semibold rounded-lg border ${accountStatus.borderColor}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {accountStatus.label}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {action && <div className="lg:ml-auto">{action}</div>}
      </div>

      {/* Contact & Additional Info Grid */}
      <ProfileInfoGrid
        user={user}
        location={location}
        accountStatus={accountStatus}
        StatusIcon={StatusIcon}
      />
    </GradientCard>
  );
}

export default ProfileHeader;
