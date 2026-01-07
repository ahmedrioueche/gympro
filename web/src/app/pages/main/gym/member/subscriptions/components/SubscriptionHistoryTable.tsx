import { ChevronDown, ChevronUp, History } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { formatDate } from "../../../../../../../utils/date";

interface SubscriptionHistoryTableProps {
  history: any[];
}

export function SubscriptionHistoryTable({
  history,
}: SubscriptionHistoryTableProps) {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const columns: TableColumn<any>[] = [
    {
      key: "plan",
      header: t("common.plan", "Plan"),
      render: (record) => (
        <span className="text-sm font-medium text-text-primary capitalize">
          {record.subscription.typeId}
        </span>
      ),
    },
    {
      key: "duration",
      header: t("common.duration", "Duration"),
      render: (record) => (
        <span className="text-sm text-text-primary">
          {formatDate(record.subscription.startDate)} -{" "}
          {formatDate(record.subscription.endDate)}
        </span>
      ),
    },
    {
      key: "status",
      header: t("common.status", "Status"),
      render: (record) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
          ${
            record.subscription.status === "active"
              ? "bg-green-500/10 text-green-500"
              : "bg-surface-hover text-text-secondary"
          }`}
        >
          {t(
            `common.${record.subscription.status}`,
            record.subscription.status as string
          )}
        </span>
      ),
    },
    {
      key: "date",
      header: t("common.date", "Date Added"),
      render: (record) => (
        <span className="text-sm text-text-secondary">
          {formatDate(record.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (record) => {
        const isExpanded = expandedIds.includes(record._id);
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(record._id);
            }}
            className="p-1 hover:bg-surface-hover rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>
        );
      },
    },
  ];

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 px-1">
        <History className="w-5 h-5 text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">
          {t("gymMember.subscriptions.history", "Subscription History")}
        </h3>
      </div>

      <Table
        data={history}
        columns={columns}
        keyExtractor={(item) => item._id}
        expandedRowKeys={expandedIds}
        onRowClick={(item) => toggleExpand(item._id)}
        renderExpandedRow={(record) => (
          <div className="p-6 bg-surface-hover/30 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-1">
                {t("common.paymentMethod", "Payment Method")}
              </p>
              <p className="text-sm text-text-primary capitalize">
                {record.subscription.paymentMethod || "-"}
              </p>
            </div>
            {/* Add more details here if available, e.g. price, staff */}
          </div>
        )}
      />
    </div>
  );
}
