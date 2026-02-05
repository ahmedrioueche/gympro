import { HelpCircle, MessageSquarePlus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import NoData from "../../../../../components/ui/NoData";
import PageHeader from "../../../../components/PageHeader";
import SupportReportsTable from "./components/SupportReportsTable";
import { useSupportPage } from "./hooks/useSupportPage";

export default function SupportPage() {
  const { t } = useTranslation();
  const { reports, isLoading, handleCreateReport } = useSupportPage();

  if (isLoading) {
    return (
      <>
        <PageHeader
          title={t("support.pageTitle")}
          subtitle={t("support.pageSubtitle")}
        />
        <Loading />
      </>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={t("support.pageTitle")}
        subtitle={t("support.pageSubtitle")}
        icon={HelpCircle}
        actionButton={{
          label: t("support.createReport"),
          onClick: handleCreateReport,
          icon: Plus,
        }}
      />

      {reports && reports.length > 0 ? (
        <SupportReportsTable reports={reports} />
      ) : (
        <NoData
          icon={MessageSquarePlus}
          title={t("support.empty")}
          description={t("support.emptyDesc")}
        />
      )}
    </div>
  );
}
