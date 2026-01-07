import { type PaymentTransaction } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Table,
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { cn } from "../../../../../../../utils/helper";

interface PaymentHistoryTableProps {
  payments: PaymentTransaction[];
  isLoading?: boolean;
}

export function PaymentHistoryTable({
  payments,
  isLoading = false,
}: PaymentHistoryTableProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: t("memberProfile.payments.completed"),
          bgClass: "bg-emerald-500/10",
          textClass: "text-emerald-400",
          borderClass: "border-emerald-500/20",
        };
      case "pending":
        return {
          label: t("memberProfile.payments.pending"),
          bgClass: "bg-amber-500/10",
          textClass: "text-amber-400",
          borderClass: "border-amber-500/20",
        };
      case "failed":
        return {
          label: t("memberProfile.payments.failed"),
          bgClass: "bg-rose-500/10",
          textClass: "text-rose-400",
          borderClass: "border-rose-500/20",
        };
      default:
        return {
          label: status,
          bgClass: "bg-zinc-800",
          textClass: "text-zinc-400",
          borderClass: "border-zinc-700",
        };
    }
  };

  const columns: TableColumn<PaymentTransaction>[] = [
    {
      key: "date",
      header: t("common.date"),
      render: (payment) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-100">
            {format(new Date(payment.date), "MMM dd, yyyy")}
          </span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
            {format(new Date(payment.date), "HH:mm")}
          </span>
        </div>
      ),
      renderSkeleton: () => <div className="h-4 bg-border rounded w-24" />,
    },
    {
      key: "amount",
      header: t("common.amount"),
      render: (payment) => (
        <div className="flex flex-col">
          <span className="text-sm font-black text-primary italic">
            {payment.amount.toLocaleString()} {payment.currency}
          </span>
        </div>
      ),
      renderSkeleton: () => <div className="h-4 bg-border rounded w-16" />,
    },
    {
      key: "status",
      header: t("common.status"),
      render: (payment) => {
        const config = getStatusConfig(payment.status);
        return (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
              config.bgClass,
              config.textClass,
              config.borderClass
            )}
          >
            {config.label}
          </span>
        );
      },
      renderSkeleton: () => <div className="h-5 bg-border rounded-lg w-20" />,
    },
    {
      key: "method",
      header: t("memberProfile.payments.method"),
      render: (payment) => (
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          {payment.method}
        </span>
      ),
      renderSkeleton: () => <div className="h-4 bg-border rounded w-16" />,
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
      <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
        <CreditCard className="w-10 h-10 opacity-20" />
      </div>
      <p className="font-black uppercase tracking-[0.2em] text-sm mb-2">
        {t("memberProfile.payments.empty")}
      </p>
      <p className="text-xs font-medium text-zinc-600">
        {t("memberProfile.payments.emptyDesc")}
      </p>
    </div>
  );

  const renderMobileCard = (payment: PaymentTransaction) => {
    const config = getStatusConfig(payment.status);
    return (
      <div className="p-5 border-b border-zinc-800/50 last:border-b-0 hover:bg-zinc-800/30 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-sm font-black text-zinc-100 uppercase tracking-tight">
              {format(new Date(payment.date), "MMM dd, yyyy")}
            </span>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              {t("memberProfile.payments.reference")}:{" "}
              {payment.referenceId?.slice(-8) || "N/A"}
            </span>
          </div>
          <span className="text-lg font-black text-primary italic">
            {payment.amount.toLocaleString()} {payment.currency}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            {payment.method}
          </span>
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
              config.bgClass,
              config.textClass,
              config.borderClass
            )}
          >
            {config.label}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Table
      columns={columns}
      data={payments}
      keyExtractor={(payment) =>
        payment.referenceId || `${payment.date}-${payment.amount}`
      }
      isLoading={isLoading}
      skeletonRowCount={3}
      emptyState={emptyState}
      rowClassName={() => "group hover:bg-border/40 cursor-default"}
      renderMobileCard={renderMobileCard}
      wrapperClassName="bg-transparent"
    />
  );
}
