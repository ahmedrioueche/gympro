import {
  ReportPriority,
  ReportStatus,
  ReportType,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { useMyReports } from "../../../../../../hooks/queries/useReports";
import { useModalStore } from "../../../../../../store/modal";

export const useSupportPage = () => {
  const { t } = useTranslation();
  const { data: reports, isLoading } = useMyReports();
  const { openModal } = useModalStore();

  const handleCreateReport = () => {
    openModal("create-report");
  };

  const getTypeLabel = (type: ReportType) => {
    return t(`support.types.${type}`);
  };

  const getPriorityLabel = (priority: ReportPriority) => {
    return t(`support.priorities.${priority}`);
  };

  const getStatusLabel = (status: ReportStatus) => {
    return t(`support.statuses.${status}`);
  };

  return {
    reports,
    isLoading,
    handleCreateReport,
    getTypeLabel,
    getPriorityLabel,
    getStatusLabel,
  };
};
