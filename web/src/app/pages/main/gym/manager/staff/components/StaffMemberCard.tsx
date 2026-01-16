import type { StaffMember } from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  Edit,
  Mail,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatPhoneForDisplay } from "../../../../../../../utils/phone.util";

interface StaffMemberCardProps {
  member: StaffMember;
  onEdit: () => void;
  onRemove: () => void;
}

export default function StaffMemberCard({
  member,
  onEdit,
  onRemove,
}: StaffMemberCardProps) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "manager":
        return "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30";
      case "coach":
        return "bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30";
      case "receptionist":
        return "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-secondary/30";
      case "cleaner":
      case "maintenance":
        return "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30";
      default:
        return "bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-secondary/30";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarGradient = (role: string) => {
    switch (role) {
      case "manager":
        return "from-primary via-primary/80 to-secondary";
      case "coach":
        return "from-success via-success/80 to-primary";
      case "receptionist":
        return "from-secondary via-secondary/80 to-primary";
      case "cleaner":
      case "maintenance":
        return "from-warning via-warning/80 to-primary";
      default:
        return "from-secondary via-secondary/80 to-primary";
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group relative bg-surface border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Content */}
      <div className="relative">
        {/* Header with avatar and menu */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={member.fullName}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-border group-hover:ring-primary/30 transition-all"
            />
          ) : (
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                member.role
              )} flex items-center justify-center shadow-lg`}
            >
              <span className="text-lg font-bold text-white">
                {getInitials(member.fullName)}
              </span>
            </div>
          )}

          {/* Name and Role */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary truncate text-lg">
              {member.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${getRoleBadgeStyles(
                  member.role
                )}`}
              >
                {t(`staff.roles.${member.role}`)}
              </span>
              {member.accountStatus === "pending_setup" && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-warning/10 text-warning border border-warning/30 animate-pulse">
                  {t("staff.pending")}
                </span>
              )}
            </div>
          </div>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-40 bg-background border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => {
                      onRemove();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t("common.delete")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-4 space-y-2">
          {member.email && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Mail className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <span className="truncate">{member.email}</span>
            </div>
          )}
          {member.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Phone className="w-4 h-4 text-text-secondary flex-shrink-0" />
              <span>{formatPhoneForDisplay(member.phoneNumber)}</span>
            </div>
          )}
        </div>

        {/* Footer with joined date */}
        {member.joinedAt && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {t("common.joined")} {formatDate(member.joinedAt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
