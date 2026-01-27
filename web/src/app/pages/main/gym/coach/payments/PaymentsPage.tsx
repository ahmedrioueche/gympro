import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import PageHeader from "../../../../../components/PageHeader";
import { RevenueStats } from "../../../../../components/cards/RevenueStats";
import { TransactionsTable } from "./components/TransactionsTable";
import { useGymCoachPayments } from "./hooks/useGymCoachPayments";

function PaymentsPage() {
  const { t } = useTranslation();
  const {
    commissionRate,
    payments,
    totalEarnings,
    pendingBalance,
    currency,
    isLoading,
  } = useGymCoachPayments();

  if (isLoading) {
    return (
      <>
        <PageHeader
          icon={DollarSign}
          title={t("coach.payments.title")}
          subtitle={t("coach.payments.description")}
        />
        <div className="md:py-20">
          <Loading fullScreen={false} />
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={DollarSign}
        title={t("coach.payments.title")}
        subtitle={t("coach.payments.description")}
      />

      {/* Stats */}
      <RevenueStats
        stats={{
          totalEarned: totalEarnings,
          pendingBalance: pendingBalance,
          commissionRate: commissionRate,
        }}
        currency={currency}
      />

      {/* Transactions History */}
      <div>
        <h2 className="text-xl text-text-primary font-bold mb-4 mt-8">
          {t("coach.payments.history")}
        </h2>
        <TransactionsTable payments={payments} currency={currency} />
      </div>
    </div>
  );
}

export default PaymentsPage;
