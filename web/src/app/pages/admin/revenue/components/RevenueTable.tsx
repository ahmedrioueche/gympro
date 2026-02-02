import type { AdminPaymentView } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";

interface RevenueTableProps {
  payments: AdminPaymentView[];
}

export const RevenueTable = ({ payments }: RevenueTableProps) => {
  const { t } = useTranslation();

  const columns: TableColumn<AdminPaymentView>[] = [
    {
      key: "userId",
      header: t("admin.revenue.table.gymOwner"),
      render: (payment) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {payment.userId?.profile?.fullName || t("common.unknown")}
          </span>
          <span className="text-xs text-text-secondary">
            {payment.userId?.profile?.email}
          </span>
        </div>
      ),
    },
    {
      key: "planName",
      header: t("admin.revenue.table.plan"),
      render: (payment) => (
        <span className="font-medium text-text-primary capitalize">
          {payment.planName}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("admin.revenue.table.amount"),
      render: (payment) => (
        <div className="font-bold text-text-primary">
          {payment.amount} {payment.currency}
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.revenue.table.status"),
      render: (payment) => {
        const colors = {
          completed:
            "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500",
          pending:
            "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500",
          failed:
            "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500",
          refunded:
            "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-500",
        };
        const status = payment.status as keyof typeof colors;
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || colors.pending}`}
          >
            {t(`payments.status.${payment.status}`)}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      header: t("admin.revenue.table.date"),
      render: (payment) => (
        <span className="text-sm text-text-secondary">
          {format(new Date(payment.createdAt), "MMM dd, yyyy HH:mm")}
        </span>
      ),
    },
    {
      key: "provider",
      header: t("admin.revenue.table.provider"),
      render: (payment) => (
        <span className="text-sm text-text-secondary capitalize">
          {payment.provider}
        </span>
      ),
    },
  ];

  return (
    <Table<AdminPaymentView>
      columns={columns}
      data={payments}
      keyExtractor={(item) => item._id}
      emptyState={
        <NoData
          icon={DollarSign}
          title={t("admin.revenue.empty")}
          description={t("admin.revenue.subtitle")}
          className="p-12"
        />
      }
    />
  );
};
