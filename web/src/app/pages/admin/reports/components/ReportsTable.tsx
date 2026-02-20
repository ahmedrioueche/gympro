import { type Report } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import { Table, type TableColumn } from "../../../../../components/ui/Table";
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
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-500 bg-blue-500/10";
      case "in_progress":
        return "text-yellow-500 bg-yellow-500/10";
      case "resolved":
        return "text-green-500 bg-green-500/10";
      case "closed":
        return "text-text-secondary bg-surface-secondary";
      default:
        return "text-text-secondary bg-surface-secondary";
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
        return "text-text-secondary";
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
        return <FileText className="w-4 h-4 text-text-secondary" />;
    }
  };

  const columns: TableColumn<Report>[] = [
    {
      key: "expand",
      header: "",
      width: "w-10",
      render: (report: Report) =>
        report.responses && report.responses.length > 0 ? (
          <button
            onClick={(e) => toggleRow(report._id, e)}
            className="p-1 hover:bg-surface-secondary rounded-lg transition-colors"
          >
            {expandedRows.includes(report._id) ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        ) : null,
    },
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
            <span className="text-xs text-text-secondary">
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
          {report.reporter &&
          typeof report.reporter !== "string" &&
          report.reporter.profile ? (
            <>
              <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-xs text-text-primary font-bold">
                {report.reporter.profile.fullName?.[0]}
              </div>
              <span className="text-sm text-text-secondary">
                {report.reporter.profile.fullName}
              </span>
            </>
          ) : (
            <span className="text-sm text-text-secondary">
              {t("common.unknown")}
            </span>
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
    {
      key: "actions",
      header: "",
      width: "w-24",
      align: "right",
      render: (report: Report) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal("report_details", { report });
          }}
          className="flex items-center gap-1 text-xs font-medium text-text-primary hover:text-text-primary/80 transition-colors"
        >
          {t("common.view")}
          <ArrowRight className="w-3 h-3" />
        </button>
      ),
    },
  ];

  const renderMobileCard = (report: Report) => {
    const reporterName =
      report.reporter &&
      typeof report.reporter !== "string" &&
      report.reporter.profile
        ? report.reporter.profile.fullName
        : t("common.unknown");

    return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 bg-surface-secondary rounded-lg shrink-0">
              {getTypeIcon(report.type)}
            </div>
            <div className="min-w-0">
              <span className="font-medium text-text-primary block truncate">
                {report.subject}
              </span>
              <span className="text-xs text-text-secondary">
                {t(`admin.reports.type.${report.type}`)}
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(report.status)}`}
          >
            {t(`admin.reports.status.${report.status}`)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface-secondary border border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-surface flex items-center justify-center text-[10px] text-text-primary font-bold">
              {reporterName?.[0] || "?"}
            </div>
            <span className="text-xs text-text-secondary">{reporterName}</span>
          </div>
          <span
            className={`text-xs font-bold ${getPriorityColor(report.priority)}`}
          >
            {t(`admin.reports.priority.${report.priority}`)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-secondary">
            {format(new Date(report.createdAt), "PP")}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal("report_details", { report });
            }}
            className="flex items-center gap-1 text-xs font-medium text-text-primary hover:text-text-primary/80 transition-colors"
          >
            {t("common.view")}
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const renderMobileLoadingSkeleton = () => (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-border rounded-lg" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-border rounded w-32" />
            <div className="h-3 bg-border rounded w-16" />
          </div>
        </div>
        <div className="h-5 bg-border rounded-full w-16" />
      </div>
      <div className="h-10 bg-border rounded-xl" />
      <div className="flex justify-between">
        <div className="h-3 bg-border rounded w-20" />
        <div className="h-3 bg-border rounded w-12" />
      </div>
    </div>
  );

  return (
    <Table
      data={reports}
      columns={columns}
      isLoading={isLoading}
      keyExtractor={(report) => report._id}
      onRowClick={(report) => {
        openModal("report_details", { report });
      }}
      renderMobileCard={renderMobileCard}
      renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
      emptyState={
        <NoData
          title={t("admin.reports.empty")}
          description={t("admin.reports.search_placeholder")}
          className=""
        />
      }
      expandedRowKeys={expandedRows}
      renderExpandedRow={(report) => (
        <div className="bg-surface-secondary/50 p-4 border-t border-border">
          <div className="max-w-3xl mx-auto space-y-4">
            <h4 className="text-sm font-medium text-text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t("support.conversation")}
            </h4>
            {report.responses && report.responses.length > 0 ? (
              <div className="space-y-3">
                {report.responses.slice(-3).map((response, idx) => {
                  const reporterId =
                    typeof report.reporter === "string"
                      ? report.reporter
                      : report.reporter._id;
                  const senderId =
                    typeof response.sender === "string"
                      ? response.sender
                      : response.sender._id;
                  const senderIsReporter = senderId === reporterId;

                  return (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="font-bold text-text-primary shrink-0">
                        {senderIsReporter
                          ? t("support.user")
                          : t("support.admin")}
                        :
                      </span>
                      <span className="text-text-secondary">
                        {response.message}
                      </span>
                    </div>
                  );
                })}
                {report.responses.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal("report_details", { report });
                    }}
                    className="text-xs text-text-primary hover:underline"
                  >
                    {t("support.view_all_messages", {
                      count: report.responses.length,
                    })}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    />
  );
}
