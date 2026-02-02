import { Shield, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import SearchFilterBar from "../../../../components/ui/SearchFilterBar";
import { useModalStore } from "../../../../store/modal";
import PageHeader from "../../../components/PageHeader";
import { StaffTable } from "./components/StaffTable";
import { useStaff } from "./hooks/useStaff";

export default function StaffPage() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const { staff, isLoading, error, search, setSearch } = useStaff();

  const handleCreateEditor = () => {
    openModal("admin_create_editor");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.staff.title")}
          subtitle={t("admin.staff.subtitle")}
          icon={Shield}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.staff.title")}
        subtitle={t("admin.staff.subtitle")}
        icon={Shield}
        actionButton={{
          label: t("admin.staff.create_btn", "Add Editor"),
          icon: UserPlus,
          onClick: handleCreateEditor,
        }}
      />

      <div className="space-y-6">
        <SearchFilterBar
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("admin.staff.search_placeholder")}
        />

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
          <StaffTable staff={staff} />
        </div>
      </div>
    </div>
  );
}
