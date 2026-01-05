import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../../utils/date";
import type { MemberDisplay } from "./types";
import { getAvatarColor, getInitials, getStatusColor } from "./utils";

interface MembersTableProps {
  members: MemberDisplay[];
  onViewProfile?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MembersTable({
  members,
  onViewProfile,
  onEdit,
  onDelete,
}: MembersTableProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.avatar")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.name")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.email")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.status")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.joinDate")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("members.table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr
                key={member._id}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile?.(member._id);
                }}
                className="cursor-pointer hover:bg-primary/5 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div
                    className={`w-10 h-10 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-sm font-bold`}
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
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-text-primary">
                    {member.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-secondary">
                    {member.email || member.phone || "-"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      member.status
                    )} inline-block`}
                  >
                    {t(`members.status.${member.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-secondary">
                    {formatDate(member.joinDate)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewProfile?.(member._id)}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium"
                    >
                      {t("members.card.viewProfile")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(member._id);
                      }}
                      className="px-3 py-1.5 bg-background border border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(member._id);
                      }}
                      className="px-3 py-1.5 bg-background border border-border text-text-secondary rounded-lg hover:border-danger hover:text-danger transition-all duration-300"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
