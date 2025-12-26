import { type AppPaymentStatsDto } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface PaymentsStatsProps {
  stats: AppPaymentStatsDto;
}

function PaymentsStats({ stats }: PaymentsStatsProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      label: t("payments.stats.total"),
      value: stats.totalPayments.toString(),
      icon: "💳",
      color: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
    },
    {
      label: t("payments.stats.revenue"),
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: "💰",
      color: "from-green-500/10 to-green-600/10 border-green-500/20",
    },
    {
      label: t("payments.stats.thisMonth"),
      value: `$${stats.thisMonthRevenue.toFixed(2)}`,
      icon: "📈",
      color: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
    },
    {
      label: t("payments.stats.successRate"),
      value: `${stats.successRate.toFixed(1)}%`,
      icon: "✅",
      color: "from-primary/10 to-secondary/10 border-primary/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${stat.color} border rounded-xl p-4 transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-text-primary mb-1">
            {stat.value}
          </p>
          <p className="text-xs md:text-sm text-text-secondary">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default PaymentsStats;
