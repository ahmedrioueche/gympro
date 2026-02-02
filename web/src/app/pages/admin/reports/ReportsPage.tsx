import { FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchFilterBar from "../../../../components/ui/SearchFilterBar";
import { useAdminReports } from "../../../../hooks/queries/useReports";
import PageHeader from "../../../components/PageHeader";
import ReportsTable from "./components/ReportsTable";

export default function ReportsPage() {
  const { t } = useTranslation();
  const { data: reports, isLoading } = useAdminReports();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReports = reports?.data?.filter((report) =>
    report.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.reports.title")}
        subtitle={t("admin.reports.subtitle")}
        icon={FileText}
      />

      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("admin.reports.search_placeholder")}
        />
      </div>

      <ReportsTable reports={filteredReports || []} isLoading={isLoading} />
    </div>
  );
}
