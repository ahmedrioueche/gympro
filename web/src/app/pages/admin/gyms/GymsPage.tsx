import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import SearchFilterBar from "../../../../components/ui/SearchFilterBar";
import PageHeader from "../../../components/PageHeader";
import { GymStats } from "./components/GymStats";
import { GymTable } from "./components/GymTable";
import { useAdminGyms } from "./hooks/useAdminGyms";

export default function GymsPage() {
  const { t } = useTranslation();
  const {
    gyms,
    stats,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
  } = useAdminGyms();

  const statusOptions = [
    { value: "all", label: t("common.all", "All") },
    { value: "active", label: t("common.active", "Active") },
    { value: "inactive", label: t("common.inactive", "Inactive") },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.gyms.title")}
          subtitle={t("admin.gyms.subtitle")}
          icon={Dumbbell}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t("admin.gyms.title")}
        subtitle={t("admin.gyms.subtitle")}
        icon={Dumbbell}
      />

      <GymStats stats={stats} />

      <div className="space-y-6">
        <SearchFilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("admin.gyms.search_placeholder")}
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={statusOptions}
        />

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
          <GymTable gyms={gyms} />
        </div>
      </div>
    </div>
  );
}
