import { Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatusBadge from "../../../../../components/ui/StatusBadge";
import UserAvatar from "../../../../../components/ui/UserAvatar";

interface Props {
  profile: any;
  joinedAt: string;
  status: string;
}

export function CoachRequestHeader({ profile, joinedAt, status }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-4 p-4 bg-surface-hover rounded-xl border border-border">
      <UserAvatar
        avatar={profile?.profileImageUrl}
        name={profile?.fullName}
        size="lg"
        className="border-2 border-primary/20"
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold text-text-primary">
          {profile?.fullName || t("common.unknown")}
        </h3>
        <p className="text-sm text-text-secondary">
          {profile?.username ? `@${profile.username}` : ""}
        </p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {profile?.city || t("admin.coaching.reviewModal.unknownLocation")}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {t("admin.coaching.reviewModal.joined")}{" "}
            {joinedAt ? new Date(joinedAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>
      <StatusBadge status={status || "pending"} />
    </div>
  );
}
