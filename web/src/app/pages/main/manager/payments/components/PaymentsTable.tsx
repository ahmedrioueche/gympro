import {
  CURRENCY_SYMBOLS,
  type GetAppPaymentDto,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../utils/date";

interface PaymentsTableProps {
  payments: GetAppPaymentDto[];
}

function PaymentsTable({ payments }: PaymentsTableProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed":
        return "bg-danger/10 text-danger border-danger/20";
      case "refunded":
        return "bg-muted text-text-secondary border-border";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "paddle":
        return "bg-primary/10 text-primary border-primary/20";
      case "chargily":
        return "bg-secondary/10 text-secondary border-secondary/20";
      default:
        return "bg-muted text-text-secondary border-border";
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.transactionId")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.date")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.plan")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.amount")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.status")}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                {t("payments.table.provider")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((payment) => (
              <tr
                key={payment._id}
                className="hover:bg-primary/5 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-text-secondary">
                    {payment.providerTransactionId.substring(0, 16)}...
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-text-secondary">
                    {formatDate(payment.paidAt || payment.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-text-primary">
                      {payment.plan?.name || "Unknown Plan"}
                    </span>
                    {payment.description && (
                      <span className="text-xs text-text-secondary mt-0.5">
                        {payment.description}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-text-primary">
                    {CURRENCY_SYMBOLS[
                      payment.currency as keyof typeof CURRENCY_SYMBOLS
                    ] || payment.currency}
                    {payment.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      payment.status
                    )} inline-block`}
                  >
                    {t(`payments.status.${payment.status}`)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getProviderColor(
                      payment.provider
                    )} inline-block`}
                  >
                    {t(`payments.provider.${payment.provider}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible on Mobile Only */}
      <div className="md:hidden divide-y divide-border">
        {payments.map((payment) => (
          <div key={payment._id} className="p-4 space-y-3">
            {/* Header: Plan Name and Amount */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary text-base">
                  {payment.plan?.name || "Unknown Plan"}
                </h3>
                {payment.description && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    {payment.description}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-text-primary text-lg">
                  {CURRENCY_SYMBOLS[
                    payment.currency as keyof typeof CURRENCY_SYMBOLS
                  ] || payment.currency}
                  {payment.amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Status and Provider Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  payment.status
                )}`}
              >
                {t(`payments.status.${payment.status}`)}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getProviderColor(
                  payment.provider
                )}`}
              >
                {t(`payments.provider.${payment.provider}`)}
              </span>
            </div>

            {/* Transaction Details */}
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {t("payments.table.transactionId")}:
                </span>
                <span className="font-mono text-xs text-text-secondary">
                  {payment.providerTransactionId.substring(0, 12)}...
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">
                  {t("payments.table.date")}:
                </span>
                <span className="text-text-primary">
                  {formatDate(payment.paidAt || payment.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentsTable;
