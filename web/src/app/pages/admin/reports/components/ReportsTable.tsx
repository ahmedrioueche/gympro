import type { Report } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useModalStore } from "../../../../../store/modal";

interface ReportsTableProps {
  reports: Report[];
  isLoading: boolean;
}

export default function ReportsTable({
  reports,
  isLoading,
}: ReportsTableProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-500 bg-blue-500/10";
      case "in_progress":
        return "text-yellow-500 bg-yellow-500/10";
      case "resolved":
        return "text-green-500 bg-green-500/10";
      case "closed":
        return "text-gray-500 bg-gray-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "issue":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case "feature_request":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const columns: TableColumn<Report>[] = [
    {
      key: "subject",
      header: t("admin.reports.table.subject"),
      render: (report: Report) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface-secondary rounded-lg">
            {getTypeIcon(report.type)}
          </div>
          <div>
            <span className="font-medium text-text-primary block">
              {report.subject}
            </span>
            <span className="text-xs text-text-tertiary">
              {t(`admin.reports.type.${report.type}`)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: t("admin.reports.table.priority"),
      render: (report: Report) => (
        <span
          className={`text-sm font-medium ${getPriorityColor(report.priority)}`}
        >
          {t(`admin.reports.priority.${report.priority}`)}
        </span>
      ),
    },
    {
      key: "reporter",
      header: t("admin.reports.table.reporter"),
      render: (report: Report) => (
        <div className="flex items-center gap-2">
          {typeof report.reporter !== "string" && report.reporter.profile ? (
            <>
              <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs text-brand-primary font-bold">
                {report.reporter.profile.fullName?.[0]}
              </div>
              <span className="text-sm text-text-secondary">
                {report.reporter.profile.fullName}
              </span>
            </>
          ) : (
            <span className="text-sm text-text-secondary">Unknown</span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.reports.table.status"),
      render: (report: Report) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            report.status,
          )}`}
        >
          {t(`admin.reports.status.${report.status}`)}
        </span>
      ),
    },
    {
      key: "date",
      header: t("admin.reports.table.date"),
      render: (report: Report) => (
        <span className="text-sm text-text-secondary">
          {format(new Date(report.createdAt), "PP")}
        </span>
      ),
    },
  ];

  return (
    <Table
      data={reports}
      columns={columns}
      isLoading={isLoading}
      keyExtractor={(report) => report._id}
      onRowClick={(report) => {
        openModal("report_details", { report });
      }}
      emptyState={
        <NoData
          title={t("admin.reports.empty")}
          description={t("admin.reports.search_placeholder")}
          className=""
        />
      }
    />
  );
}
