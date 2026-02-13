import type { Session, SessionType } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import UserAvatar from "../../../../components/ui/UserAvatar";

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
    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md group hover:border-primary/30 transition-all">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
        <UserAvatar
          avatar={member.profileImageUrl}
          alt={member.fullName}
          className="w-14 h-14 relative z-10 border-2 border-white/10"
        />
      </div>
      <div>
        <p className="font-bold text-white text-lg">
          {member.fullName || member.username}
        </p>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
            {formatServiceType(type)}
          </p>
        </div>
      </div>
    </div>
  );
};
