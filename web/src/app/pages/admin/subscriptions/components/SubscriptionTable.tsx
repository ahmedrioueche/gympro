import type { AdminSubscriptionView } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../components/ui/NoData";
import Table, { type TableColumn } from "../../../../../components/ui/Table";

interface SubscriptionTableProps {
  subscriptions: AdminSubscriptionView[];
}

export const SubscriptionTable = ({
  subscriptions,
}: SubscriptionTableProps) => {
  const { t } = useTranslation();

  const columns: TableColumn<AdminSubscriptionView>[] = [
    {
      key: "userId",
      header: t("admin.subscriptions.table.gymOwner"),
      render: (sub) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {sub.userId?.profile?.fullName || t("common.unknown")}
          </span>
          <span className="text-xs text-text-secondary">
            {sub.userId?.profile?.email}
          </span>
        </div>
      ),
    },
    {
      key: "planName",
      header: t("admin.subscriptions.table.plan"),
      render: (sub) => (
        <div className="flex flex-col">
          <span className="font-medium text-text-primary capitalize">
            {sub.planName}
          </span>
          <span className="text-xs text-text-secondary capitalize">
            {sub.billingCycle}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.subscriptions.table.status"),
      render: (sub) => {
        const colors = {
          active:
            "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500",
          expired:
            "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500",
          cancelled:
            "bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-500",
          trialing:
            "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
        };
        const status = sub.status as keyof typeof colors;
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || colors.cancelled}`}
          >
            {t(`common.${sub.status}`)}
          </span>
        );
      },
    },
    {
      key: "currentPeriodEnd",
      header: t("admin.subscriptions.table.period"),
      render: (sub) => (
        <div className="text-sm text-text-secondary">
          {sub.currentPeriodStart &&
            format(new Date(sub.currentPeriodStart), "MMM dd, yyyy")}
          {" - "}
          {sub.currentPeriodEnd &&
            format(new Date(sub.currentPeriodEnd), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      key: "provider",
      header: t("admin.subscriptions.table.provider"),
      render: (sub) => (
        <span className="text-sm text-text-secondary capitalize">
          {sub.provider}
        </span>
      ),
    },
  ];

  return (
    <Table<AdminSubscriptionView>
      columns={columns}
      data={subscriptions}
      keyExtractor={(item) => item._id}
      emptyState={
        <NoData
          icon={CreditCard}
          title={t("admin.subscriptions.empty")}
          description={t("admin.subscriptions.subtitle")}
          className="p-12"
        />
      }
    />
  );
};
