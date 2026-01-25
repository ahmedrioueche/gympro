import {
  formatPrice,
  type Currency,
  type GymCoachPayment,
} from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import Table, {
  type TableColumn,
} from "../../../../../../../components/ui/Table";
import { useLanguageStore } from "../../../../../../../store/language";

interface TransactionsTableProps {
  payments: GymCoachPayment[];
  currency: string;
}

export function TransactionsTable({
  payments,
  currency,
}: TransactionsTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-success bg-success/10 border-success/20";
      case "pending":
        return "text-warning bg-warning/10 border-warning/20";
      case "cancelled":
        return "text-error bg-danger/10 border-danger/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const columns: TableColumn<GymCoachPayment>[] = [
    {
      key: "date",
      header: t("common.date"),
      render: (payment) => (
        <span className="font-medium text-foreground">
          {format(new Date(payment.createdAt), "PPP")}
        </span>
      ),
    },
    {
      key: "description",
      header: t("common.description"),
      render: (payment) => (
        <span className="text-foreground/80">
          {payment.description || payment.category}
        </span>
      ),
    },
    {
      key: "type",
      header: t("common.type"),
      render: (payment) => (
        <span className="text-muted-foreground capitalize">{payment.type}</span>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      render: (payment) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
            payment.status,
          )}`}
        >
          {payment.status}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("common.amount"),
      align: "right",
      render: (payment) => (
        <span className="font-semibold text-foreground">
          {formatPrice(
            payment.amount,
            (payment.currency as unknown as Currency) ||
              (currency as unknown as Currency),
            language,
          )}
        </span>
      ),
    },
  ];

  return (
    <Table
      data={payments}
      columns={columns}
      keyExtractor={(item) => item._id}
      emptyState={
        <div className="flex flex-col items-center text-text-secondary justify-center gap-2">
          <div className="p-3 rounded-full bg-muted">
            <DollarSign className="w-6 h-6 " />
          </div>
          <p className="text-sm font-medium">{t("common.noData")}</p>
        </div>
      }
    />
  );
}
