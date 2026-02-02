import { type AppEditorUser } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Key, Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import UserAvatar from "../../../../../components/ui/UserAvatar";
import { useModalStore } from "../../../../../store/modal";
import { useStaff } from "../hooks/useStaff";

interface StaffTableProps {
  staff: AppEditorUser[];
}

export const StaffTable = ({ staff }: StaffTableProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { removeEditor, isRemoving } = useStaff();

  const handleRemove = (editor: AppEditorUser) => {
    openModal("confirm", {
      title: t("admin.staff.remove_title", "Remove Editor"),
      text: t("admin.staff.remove_message", {
        name: editor.profile.fullName || editor.profile.username,
        defaultValue:
          "Are you sure you want to remove this editor? They will lose all platform access.",
      }),
      confirmText: t("common.remove"),
      confirmVariant: "danger",
      onConfirm: () => removeEditor(editor._id),
    });
  };

  const handleManagePermissions = (editor: AppEditorUser) => {
    openModal("admin_manage_permissions", {
      editor,
    });
  };

  const columns: TableColumn<AppEditorUser>[] = [
    {
      key: "profile",
      header: t("admin.staff.table.user"),
      render: (editor) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            avatar={editor.profile.profileImageUrl}
            className="w-10 h-10 border-2 border-background shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">
              {editor.profile.fullName || editor.profile.username}
            </span>
            <span className="text-xs text-text-secondary truncate max-w-[180px]">
              {editor.profile.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "username",
      header: t("admin.staff.table.username"),
      render: (editor) => (
        <span className="text-sm font-medium text-text-secondary">
          @{editor.profile.username}
        </span>
      ),
    },
    {
      key: "permissions",
      header: t("admin.staff.table.permissions"),
      render: (editor) => (
        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
          {(editor.appPermissions || []).length > 0 ? (
            editor.appPermissions?.map((perm) => (
              <span
                key={perm}
                className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase"
              >
                {perm.replace("_", " ")}
              </span>
            ))
          ) : (
            <span className="text-xs text-text-secondary italic">
              {t("admin.staff.no_permissions", "No permissions")}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: t("admin.staff.table.joined"),
      render: (editor) => (
        <span className="text-sm text-text-secondary">
          {editor.createdAt
            ? format(new Date(editor.createdAt), "MMM dd, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (editor) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleManagePermissions(editor)}
            className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-all"
            title={t("admin.staff.manage_permissions", "Manage Permissions")}
          >
            <Key className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleRemove(editor)}
            disabled={isRemoving}
            className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
            title={t("common.remove")}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table<AppEditorUser>
      columns={columns}
      data={staff}
      keyExtractor={(item) => item._id}
      emptyState={
        <NoData
          icon={Shield}
          title={t("admin.staff.empty")}
          description={t("admin.staff.subtitle")}
          className="p-12"
        />
      }
    />
  );
};
