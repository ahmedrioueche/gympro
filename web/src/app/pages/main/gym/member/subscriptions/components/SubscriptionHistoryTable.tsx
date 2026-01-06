import { type SubscriptionInfo } from "@ahmedrioueche/gympro-client";
import { History } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../../../utils/date";

interface SubscriptionHistoryTableProps {
  history: any[]; // Using any[] temporarily because SubscriptionHistory interface might not match exactly with what we return
}

export function SubscriptionHistoryTable({
  history,
}: SubscriptionHistoryTableProps) {
  const { t } = useTranslation();

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden mt-8">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <History className="w-5 h-5 text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">
          {t("gymMember.subscriptions.history", "Subscription History")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-hover">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t("common.plan", "Plan")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t("common.duration", "Duration")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t("common.status", "Status")}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                {t("common.date", "Date Added")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((record: any, index: number) => {
              const sub: SubscriptionInfo = record.subscription;
              return (
                <tr key={index} className="hover:bg-surface-hover/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-text-primary">
                      {sub.typeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm text-text-primary">
                        {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                      ${
                        sub.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-surface-hover text-text-secondary"
                      }`}
                    >
                      {t(`common.${sub.status}`, sub.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {formatDate(record.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
