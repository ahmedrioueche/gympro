import { CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import PageHeader from "../../../components/PageHeader";
import { StatsCards } from "./components/StatsCards";
import { SubscriptionTable } from "./components/SubscriptionTable";
import { useAdminSubscriptions } from "./hooks/useAdminSubscriptions";

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const { subscriptions, stats, isLoading, error } = useAdminSubscriptions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.subscriptions.title")}
          subtitle={t("admin.subscriptions.subtitle")}
          icon={CreditCard}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t("admin.subscriptions.title")}
        subtitle={t("admin.subscriptions.subtitle")}
        icon={CreditCard}
      />

      <StatsCards stats={stats} />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <SubscriptionTable subscriptions={subscriptions} />
      </div>
    </div>
  );
}
