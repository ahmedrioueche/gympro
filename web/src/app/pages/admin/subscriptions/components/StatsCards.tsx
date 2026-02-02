import { AlertTriangle, CreditCard, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatsCardsProps {
  stats: {
    active: number;
    revenue: number;
    expiring: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("admin.subscriptions.stats.active"),
      value: stats.active,
      icon: CreditCard,
      color: "bg-blue-500",
    },
    {
      label: t("admin.subscriptions.stats.revenue"),
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      label: t("admin.subscriptions.stats.expiring"),
      value: stats.expiring,
      icon: AlertTriangle,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg"
        >
          <div className={`${card.color} p-3 rounded-xl text-white`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium">
              {card.label}
            </div>
            <div className="text-2xl font-bold text-text-primary mt-1">
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
