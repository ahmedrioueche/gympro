import type { Session, SessionType } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../../../../components/ui/UserAvatar";

interface SessionClientInfoProps {
  member: Session["member"];
  type?: SessionType;
}

export const SessionClientInfo = ({ member, type }: SessionClientInfoProps) => {
  const { t } = useTranslation();

  if (!member) return null;

  const formatServiceType = (type?: string) => {
    if (!type) return "";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-xl">
      <UserAvatar
        avatar={member.profileImageUrl}
        alt={member.fullName}
        className="w-12 h-12"
      />
      <div>
        <p className="font-semibold text-text-primary">
          {member.fullName || member.username}
        </p>
        <p className="text-sm text-text-secondary">{formatServiceType(type)}</p>
      </div>
    </div>
  );
};
