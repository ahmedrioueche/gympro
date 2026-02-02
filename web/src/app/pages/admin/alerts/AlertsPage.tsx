import { Bell } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../../components/ui/SearchFilterBar";
import { useAlerts } from "../../../../hooks/queries/useAlerts";
import PageHeader from "../../../components/PageHeader";
import AlertsTable from "./components/AlertsTable";

export default function AlertsPage() {
  const { t } = useTranslation();
  const { alerts, isLoading } = useAlerts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = alerts?.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("admin.alerts.title")}
        subtitle={t("admin.alerts.subtitle")}
        icon={Bell}
      />

      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder={t("admin.alerts.search_placeholder")}
        />
      </div>

      <AlertsTable alerts={filteredAlerts || []} isLoading={isLoading} />
    </div>
  );
}
