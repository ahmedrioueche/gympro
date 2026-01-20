import { type SubscriptionHistory } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, type TableColumn } from "../../../../../../components/ui/Table";

interface MemberSubscriptionsTableProps {
  history: SubscriptionHistory[];
}

export const MemberSubscriptionsTable = ({
  history,
}: MemberSubscriptionsTableProps) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "active":
        return "✅";
      case "expired":
        return "⏰";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "expired":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "cancelled":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const columns: TableColumn<SubscriptionHistory>[] = [
    {
      key: "icon",
      header: "",
      width: "w-12",
      render: (record) => (
        <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">
          {getStatusIcon(record.subscription.status)}
        </span>
      ),
    },
    {
      key: "type",
      header: t("memberProfile.subscription.type"),
      render: (record) => (
        <span className="font-bold text-white uppercase tracking-wide">
          {record.subscription.typeId || "Regular"}
        </span>
      ),
    },
    {
      key: "startDate",
      header: t("memberProfile.subscription.startDate"),
      render: (record) => (
        <span className="text-sm text-zinc-400 font-medium">
          {new Date(record.subscription.startDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "endDate",
      header: t("memberProfile.subscription.endDate"),
      render: (record) => (
        <div className="flex flex-col">
          <span className="text-sm text-white font-medium">
            {new Date(record.subscription.endDate).toLocaleDateString()}
          </span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            {formatDistanceToNow(new Date(record.subscription.endDate), {
              addSuffix: true,
            })}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      render: (record) => (
        <span
          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(
            record.subscription.status
          )}`}
        >
          {record.subscription.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "center",
      width: "w-24",
      render: (record) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand((record as any)._id || "");
          }}
          className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-colors"
        >
          {expandedId === (record as any)._id ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      ),
    },
  ];

  const renderExpandedDetails = (record: SubscriptionHistory) => (
    <div className="px-6 py-6 bg-white/[0.02] border-t border-white/5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
            {t("memberProfile.subscription.paymentMethod")}
          </p>
          <p className="text-sm font-bold text-white capitalize">
            {record.subscription.paymentMethod || "—"}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
            {t("memberProfile.subscription.notes")}
          </p>
          <p className="text-sm font-medium text-zinc-400">
            {record.notes || "—"}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMobileCard = (record: SubscriptionHistory) => {
    const isExpanded = expandedId === (record as any)._id;
    return (
      <div className="p-4 bg-surface border-b border-white/5 last:border-0">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleExpand((record as any)._id || "")}
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl filter grayscale">
              {getStatusIcon(record.subscription.status)}
            </span>
            <div>
              <p className="font-bold text-white uppercase tracking-wide">
                {record.subscription.typeId || "Regular"}
              </p>
              <p className="text-xs text-zinc-400">
                {new Date(record.subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(
                record.subscription.status
              )}`}
            >
              {record.subscription.status}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-zinc-400 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                  {t("memberProfile.subscription.startDate")}
                </p>
                <p className="text-sm text-zinc-300">
                  {new Date(record.subscription.startDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                  {t("memberProfile.subscription.paymentMethod")}
                </p>
                <p className="text-sm text-zinc-300 capitalize">
                  {record.subscription.paymentMethod || "—"}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                  {t("memberProfile.subscription.notes")}
                </p>
                <p className="text-sm text-zinc-300">{record.notes || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Table
      data={history}
      columns={columns}
      keyExtractor={(item) => (item as any)._id || Math.random().toString()}
      wrapperClassName="bg-surface border border-border rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl"
      headerClassName="bg-gradient-to-r from-primary/5 to-transparent border-b border-white/5"
      onRowClick={(item) => toggleExpand((item as any)._id || "")}
      rowClassName={() => "group hover:bg-white/[0.02] cursor-pointer"}
      expandedRowKeys={expandedId ? [expandedId] : []}
      renderExpandedRow={renderExpandedDetails}
      renderMobileCard={renderMobileCard}
      emptyState={
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-2xl opacity-50">📭</span>
          <span className="font-medium">
            {t("memberProfile.subscription.noHistory")}
          </span>
        </div>
      }
    />
  );
};
