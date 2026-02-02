import { UserRole } from "@ahmedrioueche/gympro-client";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import SearchFilterBar, {
  type FilterOption,
} from "../../../../components/ui/SearchFilterBar";
import PageHeader from "../../../components/PageHeader";
import { UserStats } from "./components/UserStats";
import { UserTable } from "./components/UserTable";
import { useAdminUsers } from "./hooks/useAdminUsers";

export default function UsersPage() {
  const { t } = useTranslation();
  const {
    users,
    stats,
    isLoading,
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
  } = useAdminUsers();

  const roleOptions: FilterOption[] = [
    { value: "all", label: t("common.all_roles", "All Roles") },
    { value: UserRole.Admin, label: "Admin" },
    { value: UserRole.AppEditor, label: "App Editor" },
    { value: UserRole.Coach, label: "Coach" },
    { value: UserRole.Owner, label: "Gym Owner" },
    { value: UserRole.Manager, label: "Gym Manager" },
    { value: UserRole.Member, label: "Member" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.users.title")}
          subtitle={t("admin.users.subtitle")}
          icon={Users}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t("admin.users.title")}
        subtitle={t("admin.users.subtitle")}
        icon={Users}
      />

      <UserStats stats={stats} />

      <div className="space-y-6">
        <SearchFilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder={t(
            "admin.users.search_placeholder",
            "Search users by name, email or username...",
          )}
          filterValue={roleFilter}
          onFilterChange={setRoleFilter}
          filterOptions={roleOptions}
        />

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
          <UserTable users={users} />
        </div>
      </div>
    </div>
  );
}
