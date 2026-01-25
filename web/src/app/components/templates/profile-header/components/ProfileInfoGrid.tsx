import type { User } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ProfileInfoGridProps {
  user: User;
  location: string;
  accountStatus: {
    label: string;
    bgColor: string;
    borderColor: string;
    color: string;
  };
  StatusIcon: LucideIcon;
}

function ProfileInfoGrid({
  user,
  location,
  accountStatus,
  StatusIcon,
}: ProfileInfoGridProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border">
      {/* Email */}
      {user.profile.email && (
        <div className="flex items-center gap-3 text-text-secondary group">
          <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary font-medium">
              {t("home.manager.profile.email")}
            </p>
            <p className="text-sm font-semibold text-text-primary truncate">
              {user.profile.email}
            </p>
          </div>
        </div>
      )}

      {/* Phone */}
      {user.profile.phoneNumber && (
        <div className="flex items-center gap-3 text-text-secondary group">
          <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
            <Phone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary font-medium">
              {t("home.manager.profile.phone")}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {user.profile.phoneNumber}
              {user.profile.phoneNumberVerified && (
                <CheckCircle2 className="inline w-3.5 h-3.5 ml-1 text-success" />
              )}
            </p>
          </div>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-3 text-text-secondary group">
        <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-secondary font-medium">
            {t("home.manager.profile.location")}
          </p>
          <p className="text-sm font-semibold text-text-primary truncate">
            {location}
          </p>
        </div>
      </div>

      {/* Member Since */}
      {user.createdAt && (
        <div className="flex items-center gap-3 text-text-secondary group">
          <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary font-medium">
              {t("home.manager.profile.memberSince")}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {format(new Date(user.createdAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      )}

      {/* Active Memberships (Generic) */}
      {user.memberships && user.memberships.length > 0 && (
        <div className="flex items-center gap-3 text-text-secondary group">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center border border-success/20">
            <CheckCircle2 className="w-4 h-4 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary font-medium">
              {t("home.manager.profile.activeMemberships")}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {user.memberships.length} {t("home.manager.profile.gyms")}
            </p>
          </div>
        </div>
      )}

      {/* Account Status Info */}
      <div className="flex items-center gap-3 text-text-secondary group">
        <div
          className={`w-10 h-10 rounded-lg ${accountStatus.bgColor} flex items-center justify-center border ${accountStatus.borderColor}`}
        >
          <StatusIcon className={`w-4 h-4 ${accountStatus.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-secondary font-medium">
            {t("home.manager.profile.accountStatus")}
          </p>
          <p className={`text-sm font-semibold ${accountStatus.color}`}>
            {user.profile.accountStatus === "active"
              ? t("home.manager.profile.statusActive")
              : t("home.manager.profile.statusPending")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoGrid;
