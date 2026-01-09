import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../../utils/date";
import type { MemberDisplay } from "./types";
import { getAvatarColor, getInitials, getStatusColor } from "./utils";

interface MemberCardProps {
  member: MemberDisplay;
  onViewProfile?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MemberCard({
  member,
  onViewProfile,
  onEdit,
  onDelete,
}: MemberCardProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onViewProfile(member._id)}
      className="bg-surface cursor-pointer border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group"
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
        >
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(member.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            {member.email || member.phone || "-"}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="flex gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            member.status
          )}`}
        >
          {t(`members.status.${member.status}`)}
        </span>
      </div>

      {/* Join Date */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
        <span>📅</span>
        <span>
          {t("members.card.memberSince")} {formatDate(member.joinDate)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(member._id);
          }}
          className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium text-sm"
        >
          {t("members.card.viewProfile")}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(member._id);
          }}
          className="px-4 py-2 bg-background border border-border text-text-secondary rounded-lg hover:border-danger hover:text-danger transition-all duration-300"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
