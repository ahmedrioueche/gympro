import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { formatDate } from "../../../../../../../utils/date";
import { capitalize } from "../../../../../../../utils/helper";

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
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const columns: TableColumn<any>[] = [
    {
      key: "plan",
      header: t("common.plan", "Plan"),
      render: (record) => (
        <span className="text-sm font-medium text-text-primary capitalize">
          {record.subscription.typeDetails?.customName
            ? capitalize(record.subscription.typeDetails.customName)
            : capitalize(record.subscription.typeId)}
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
            record.subscription.status as string,
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
          </div>
        )}
        renderMobileCard={(record) => {
          const isExpanded = expandedIds.includes(record._id);
          return (
            <div className="p-4 bg-surface border-b border-border last:border-0">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(record._id)}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-text-primary capitalize">
                    {record.subscription.typeDetails?.customName
                      ? capitalize(record.subscription.typeDetails.customName)
                      : capitalize(record.subscription.typeId)}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {formatDate(record.subscription.startDate)} -{" "}
                    {formatDate(record.subscription.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${
                      record.subscription.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-surface-hover text-text-secondary"
                    }`}
                  >
                    {t(
                      `common.${record.subscription.status}`,
                      record.subscription.status as string,
                    )}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-text-secondary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-1">
                    {t("common.paymentMethod", "Payment Method")}
                  </p>
                  <p className="text-sm text-text-primary capitalize font-medium">
                    {record.subscription.paymentMethod || "-"}
                  </p>
                  <div className="mt-3">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-1">
                      {t("common.date", "Date Added")}
                    </p>
                    <p className="text-sm text-text-primary font-medium">
                      {formatDate(record.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
