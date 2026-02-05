import {
  type Report,
  ReportPriority,
  ReportStatus,
} from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../../components/ui/Table";
import { useModalStore } from "../../../../../../store/modal";

interface SupportReportsTableProps {
  reports: Report[];
  isLoading?: boolean;
}

export default function SupportReportsTable({
  reports,
  isLoading,
}: SupportReportsTableProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const getPriorityBadge = (priority: ReportPriority) => {
    const colors = {
      [ReportPriority.LOW]:
        "bg-green-500/10 text-green-500 border-green-500/20",
      [ReportPriority.MEDIUM]:
        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      [ReportPriority.HIGH]: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[priority]}`}
      >
        {t(`support.priorities.${priority}`)}
      </span>
    );
  };

  const getStatusBadge = (status: ReportStatus) => {
    const colors = {
      [ReportStatus.OPEN]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      [ReportStatus.IN_PROGRESS]:
        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      [ReportStatus.RESOLVED]:
        "bg-green-500/10 text-green-500 border-green-500/20",
      [ReportStatus.CLOSED]:
        "bg-surface-secondary text-text-secondary border-border",
    };
    return (
      <span
        className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[status]}`}
      >
        {t(`support.statuses.${status}`)}
      </span>
    );
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
      header: t("support.table.subject"),
      render: (report: Report) => (
        <span className="font-medium text-text-primary">{report.subject}</span>
      ),
    },
    {
      key: "type",
      header: t("support.table.type"),
      render: (report: Report) => (
        <span className="text-text-secondary">
          {t(`support.types.${report.type}`)}
        </span>
      ),
    },
    {
      key: "priority",
      header: t("support.table.priority"),
      render: (report: Report) => getPriorityBadge(report.priority),
    },
    {
      key: "status",
      header: t("support.table.status"),
      render: (report: Report) => getStatusBadge(report.status),
    },
    {
      key: "createdAt",
      header: t("support.table.created"),
      render: (report: Report) => (
        <span className="text-text-secondary text-sm">
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
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

  return (
    <Table
      data={reports}
      columns={columns}
      isLoading={isLoading}
      keyExtractor={(report) => report._id}
      onRowClick={(report) => openModal("report_details", { report })}
      emptyState={
        <NoData
          title={t("support.empty")}
          description={t("support.emptyDesc")}
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
            {report.responses && report.responses.length > 0 && (
              <div className="space-y-3">
                {report.responses.slice(-3).map((response, idx) => {
                  const senderIsReporter =
                    typeof response.sender === "string"
                      ? response.sender ===
                        (typeof report.reporter === "string"
                          ? report.reporter
                          : report.reporter._id)
                      : typeof report.reporter !== "string" &&
                        response.sender._id === report.reporter._id;

                  return (
                    <div key={idx} className="flex gap-3 text-sm">
                      <span className="font-bold text-text-primary shrink-0">
                        {senderIsReporter
                          ? t("support.you")
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
            )}
          </div>
        </div>
      )}
    />
  );
}
