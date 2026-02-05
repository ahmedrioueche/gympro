import type { Alert } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Terminal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useModalStore } from "../../../../../store/modal";

interface AlertsTableProps {
  alerts: Alert[];
  isLoading: boolean;
}

export default function AlertsTable({ alerts, isLoading }: AlertsTableProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "text-blue-500 bg-blue-500/10";
      case "read":
        return "text-yellow-500 bg-yellow-500/10";
      case "resolved":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 font-bold underline";
      case "high":
        return "text-red-500 font-bold";
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
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "sentry":
        return <AlertCircle className="w-3 h-3 text-text-primary" />;
      case "pino":
        return <Terminal className="w-3 h-3 text-text-secondary" />;
      default:
        return <Info className="w-3 h-3 text-text-secondary" />;
    }
  };

  const columns: TableColumn<Alert>[] = [
    {
      key: "title",
      header: t("admin.alerts.table.title"),
      render: (alert: Alert) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface-secondary rounded-lg">
            {getTypeIcon(alert.type)}
          </div>
          <div className="max-w-xs md:max-w-md">
            <span className="font-medium text-text-primary block truncate">
              {alert.title}
            </span>
            <span className="text-xs text-text-secondary truncate block">
              {alert.message}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: t("admin.alerts.table.priority"),
      render: (alert: Alert) => (
        <span
          className={`text-sm font-medium ${getPriorityColor(alert.priority)}`}
        >
          {t(`admin.alerts.priority.${alert.priority}`)}
        </span>
      ),
    },
    {
      key: "source",
      header: t("admin.alerts.table.source"),
      render: (alert: Alert) => (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-secondary border border-border-subtle w-fit">
          {getSourceIcon(alert.source)}
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
            {t(`admin.alerts.source.${alert.source}`)}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.alerts.table.status"),
      render: (alert: Alert) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            alert.status,
          )}`}
        >
          {t(`admin.alerts.status.${alert.status}`)}
        </span>
      ),
    },
    {
      key: "date",
      header: t("admin.alerts.table.date"),
      render: (alert: Alert) => (
        <span className="text-sm text-text-secondary">
          {format(new Date(alert.createdAt), "PPp")}
        </span>
      ),
    },
  ];

  return (
    <Table
      data={alerts}
      columns={columns}
      isLoading={isLoading}
      keyExtractor={(alert) => alert._id}
      onRowClick={(alert) => {
        openModal("alert_details", { alert });
      }}
      emptyState={
        <NoData
          title={t("admin.alerts.empty")}
          description={t("admin.alerts.search_placeholder")}
          className=""
        />
      }
    />
  );
}
