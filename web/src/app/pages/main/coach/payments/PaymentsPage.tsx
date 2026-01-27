import {
  type GymCoachPayment,
  GymCoachPaymentStatus,
} from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import Table from "../../../../../components/ui/Table";
import PageHeader from "../../../../components/PageHeader";
import { RevenueStats } from "../../../../components/cards/RevenueStats";
import { useCoachPayments } from "./hooks/useCoachPayments";

function PaymentsPage() {
  const { t } = useTranslation();
  const { stats, payments, isLoading, totalPayments, currentPage } =
    useCoachPayments();

  const getStatusColor = (status: GymCoachPaymentStatus) => {
    switch (status) {
      case GymCoachPaymentStatus.PAID:
      case GymCoachPaymentStatus.CLEARED:
        return "text-green-500 bg-green-500/10";
      case GymCoachPaymentStatus.PENDING:
        return "text-orange-500 bg-orange-500/10";
      case GymCoachPaymentStatus.CANCELLED:
        return "text-red-500 bg-red-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatCurrency = (amount: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (isLoading) {
    return <Loading />;
  }

  // Define table columns
  const columns = [
    {
      key: "date",
      header: t("common.date"),
      render: (item: GymCoachPayment) => (
        <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
      ),
    },
    {
      key: "gym",
      header: t("common.gym"),
      render: (item: GymCoachPayment) => (
        <span>{(item.gymId as any)?.name || "N/A"}</span>
      ),
    },
    {
      key: "description",
      header: t("common.description"),
      render: (item: GymCoachPayment) => (
        <span className="text-gray-400">
          {item.description || item.category}
        </span>
      ),
    },
    {
      key: "status",
      header: t("common.status"),
      render: (item: GymCoachPayment) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.status,
          )}`}
        >
          {item.status.toUpperCase()}
        </span>
      ),
    },
    {
      key: "amount",
      header: t("common.amount"),
      render: (item: GymCoachPayment) => (
        <span
          className={`font-semibold ${
            item.type === "payout" ? "text-red-400" : "text-green-400"
          }`}
        >
          {item.type === "payout" ? "-" : "+"}
          {formatCurrency(item.amount, item.currency)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coach.payments.title", "Payments")}
        subtitle={t(
          "coach.payments.subtitle",
          "Manage your earnings and payout history",
        )}
        icon={Wallet}
      />

      {/* Stats Grid */}
      <RevenueStats
        stats={{
          totalEarned: stats?.totalEarned || 0,
          pendingBalance: stats?.pendingBalance || 0,
          totalPaidOut: stats?.totalPaidOut || 0,
        }}
        currency="USD"
      />

      <div>
        <h2 className="text-xl text-text-primary font-bold mb-4 mt-8">
          {t("coach.payments.history")}
        </h2>
        <Table
          data={payments}
          columns={columns}
          keyExtractor={(item) => item._id}
          emptyState={
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <span className="text-2xl opacity-50">📭</span>
              <span className="font-medium">{t("coach.payments.noData")}</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default PaymentsPage;
