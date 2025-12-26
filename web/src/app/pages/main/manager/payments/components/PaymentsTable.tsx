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
      <div className="overflow-x-auto">
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
    </div>
  );
}

export default PaymentsTable;
