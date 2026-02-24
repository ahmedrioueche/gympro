import { type User, UserRole } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { ShieldAlert, ShieldCheck, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import UserAvatar from "../../../../../components/ui/UserAvatar";
import { useModalStore } from "../../../../../store/modal";
import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";

interface UserTableProps {
  users: User[];
}

export const UserTable = ({ users }: UserTableProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { mutate: toggleStatus, isPending } = useUpdateUserStatus();

  const handleToggleStatus = (user: User) => {
    const isActivating = user.profile?.isActive === false;

    openModal("confirm", {
      title: isActivating
        ? t("admin.users.modals.activate_title", "Activate User")
        : t("admin.users.modals.deactivate_title", "Deactivate User"),
      text: isActivating
        ? t(
            "admin.users.modals.activate_message",
            "Are you sure you want to activate this user? They will regain access to the platform.",
          )
        : t(
            "admin.users.modals.deactivate_message",
            "Are you sure you want to deactivate this user? They will be locked out of the platform immediately.",
          ),
      confirmText: isActivating ? t("common.activate") : t("common.deactivate"),
      confirmVariant: isActivating ? "primary" : "danger",
      onConfirm: () => toggleStatus(user._id),
    });
  };

  const roleColors: Record<string, string> = {
    [UserRole.Admin]:
      "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500",
    [UserRole.AppEditor]:
      "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500",
    [UserRole.Coach]:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
    [UserRole.Owner]:
      "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500",
    [UserRole.Manager]:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500",
    [UserRole.Member]:
      "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-500",
  };

  const columns: TableColumn<User>[] = [
    {
      key: "profile",
      header: t("admin.users.table.user"),
      render: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar
            avatar={user.profile?.profileImageUrl}
            className="w-10 h-10 border-2 border-background shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">
              {user.profile?.fullName || user.profile?.username}
            </span>
            <span className="text-xs text-text-secondary truncate max-w-[180px]">
              {user.profile?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: t("admin.users.table.role"),
      render: (user) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleColors[user.role] || roleColors[UserRole.Member]}`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("admin.users.table.joined"),
      render: (user) => (
        <span className="text-sm text-text-secondary">
          {user.createdAt
            ? format(new Date(user.createdAt), "MMM dd, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      header: t("admin.users.table.status"),
      render: (user) => (
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${user.profile?.isActive !== false ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
          />
          <span className="text-sm font-medium text-text-primary">
            {user.profile?.isActive !== false
              ? t("common.active")
              : t("common.inactive")}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (user) => {
        const isProtected =
          user.role === UserRole.Admin || user.role === UserRole.AppEditor;
        const isActive = user.profile?.isActive !== false;

        if (isProtected) return null;

        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(user);
            }}
            disabled={isPending}
            className={`p-2 rounded-lg transition-all ${
              isActive
                ? "text-red-500 hover:bg-red-500/10"
                : "text-green-500 hover:bg-green-500/10"
            }`}
            title={isActive ? t("common.deactivate") : t("common.activate")}
          >
            {isActive ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </button>
        );
      },
    },
  ];

  const handleRowClick = (user: User) => {
    openModal("user_profile", { user });
  };

  const renderMobileCard = (user: User) => {
    const isProtected =
      user.role === UserRole.Admin || user.role === UserRole.AppEditor;
    const isActive = user.profile?.isActive !== false;

    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar
              avatar={user.profile?.profileImageUrl}
              className="w-10 h-10 border-2 border-background shadow-sm"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary">
                {user.profile?.fullName || user.profile?.username}
              </span>
              <span className="text-xs text-text-secondary">
                {user.profile?.email}
              </span>
            </div>
          </div>
          {!isProtected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(user);
              }}
              disabled={isPending}
              className={`p-2 rounded-lg transition-all ${
                isActive
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-green-500 hover:bg-green-500/10"
              }`}
            >
              {isActive ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.users.table.role")}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${roleColors[user.role] || roleColors[UserRole.Member]}`}
            >
              {user.role}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              {t("admin.users.table.status")}
            </span>
            <div className="flex items-center gap-1.5">
              <div
                className={`w-2 h-2 rounded-full ${user.profile?.isActive !== false ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
              />
              <span className="text-xs font-medium text-text-primary">
                {user.profile?.isActive !== false
                  ? t("common.active")
                  : t("common.inactive")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xs text-text-secondary">
            {t("admin.users.table.joined")}
          </span>
          <span className="text-xs text-text-primary font-medium">
            {user.createdAt
              ? format(new Date(user.createdAt), "MMM dd, yyyy")
              : "N/A"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Table<User>
      columns={columns}
      data={users}
      keyExtractor={(item) => item._id}
      onRowClick={handleRowClick}
      renderMobileCard={renderMobileCard}
      emptyState={
        <NoData
          icon={UserIcon}
          title={t("admin.users.empty")}
          description={t("admin.users.subtitle")}
          className="p-12"
        />
      }
    />
  );
};
