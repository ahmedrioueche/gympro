import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../components/ui/Error";
import Loading from "../../../../components/ui/Loading";
import PageHeader from "../../../components/PageHeader";
import { RevenueStats } from "./components/RevenueStats";
import { RevenueTable } from "./components/RevenueTable";
import { useAdminRevenue } from "./hooks/useAdminRevenue";

export default function RevenuePage() {
  const { t } = useTranslation();
  const { payments, stats, isLoading, error } = useAdminRevenue();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={t("admin.revenue.title")}
          subtitle={t("admin.revenue.subtitle")}
          icon={DollarSign}
        />
        <Loading />
      </div>
    );
  }

  if (error) return <ErrorComponent />;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t("admin.revenue.title")}
        subtitle={t("admin.revenue.subtitle")}
        icon={DollarSign}
      />

      <RevenueStats stats={stats} />

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <RevenueTable payments={payments} />
      </div>
    </div>
  );
}
