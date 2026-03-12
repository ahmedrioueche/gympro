import { useTranslation } from "react-i18next";
import { Table, type TableColumn } from "../../../../../../../components/ui/Table";
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
  onDelete,
}: MembersTableProps) {
  const { t } = useTranslation();

  const columns: TableColumn<MemberDisplay>[] = [
    {
      key: "avatar",
      header: t("members.table.avatar"),
      width: "w-20",
      render: (member) => (
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
      ),
    },
    {
      key: "name",
      header: t("members.table.name"),
      render: (member) => (
        <span className="font-semibold text-text-primary">{member.name}</span>
      ),
    },
    {
      key: "email",
      header: t("members.table.email"),
      render: (member) => (
        <span className="text-text-secondary">
          {member.email || member.phone || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("members.table.status"),
      render: (member) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
            member.status
          )} inline-block`}
        >
          {t(`members.status.${member.status}`)}
        </span>
      ),
    },
    {
      key: "joinDate",
      header: t("members.table.joinDate"),
      render: (member) => (
        <span className="text-text-secondary">
          {formatDate(member.joinDate)}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("members.table.actions"),
      align: "right",
      render: (member) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onViewProfile?.(member._id)}
            className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium"
          >
            {t("members.card.viewProfile")}
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
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={members}
      keyExtractor={(member) => member._id}
      onRowClick={(member) => onViewProfile?.(member._id)}
    />
  );
}
