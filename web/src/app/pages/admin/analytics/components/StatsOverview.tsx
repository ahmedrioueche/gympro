import { type GlobalStatsMetrics } from "@ahmedrioueche/gympro-client";
import {
  CreditCard,
  DollarSign,
  Dumbbell,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "../../../../components/analytics/StatCard";

interface StatsOverviewProps {
  metrics: GlobalStatsMetrics;
}

export default function StatsOverview({ metrics }: StatsOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title={t("admin.analytics.stats.totalRevenue", "Total Revenue")}
        value={`$${metrics.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        trend={metrics.revenueTrend}
        description={t("admin.analytics.trends.revenue", "vs last month")}
        color="from-emerald-500 to-teal-600"
      />
      <StatCard
        title={t("admin.analytics.stats.monthlyRevenue", "Monthly Revenue")}
        value={`$${metrics.monthlyRevenue.toLocaleString()}`}
        icon={CreditCard}
        description={t("admin.analytics.stats.monthlyDesc", "Current month")}
        color="from-blue-500 to-indigo-600"
      />
      <StatCard
        title={t("admin.analytics.stats.totalMembers", "Total Members")}
        value={metrics.totalMembers.toLocaleString()}
        icon={Users}
        trend={metrics.membersTrend}
        description={t("admin.analytics.trends.members", "vs last month")}
        color="from-purple-500 to-pink-600"
      />
      <StatCard
        title={t("admin.analytics.stats.activeMembers", "Active Members")}
        value={metrics.activeMembers.toLocaleString()}
        icon={UserCheck}
        description={t("admin.analytics.stats.activeDesc", "Paying members")}
        color="from-emerald-500 to-teal-600"
      />
      <StatCard
        title={t("admin.analytics.stats.totalGyms", "Total Gyms")}
        value={metrics.totalGyms.toLocaleString()}
        icon={Dumbbell}
        description={t("admin.analytics.stats.gymsDesc", "Businesses")}
        color="from-orange-500 to-red-600"
      />
    </div>
  );
}
