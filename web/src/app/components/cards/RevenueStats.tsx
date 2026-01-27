import { formatPrice, type Currency } from "@ahmedrioueche/gympro-client";
import { DollarSign, History, TrendingUp, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";

export interface RevenueStatsData {
  totalEarned: number;
  pendingBalance: number;
  commissionRate?: number;
  totalPaidOut?: number;
}

interface RevenueStatsProps {
  stats: RevenueStatsData;
  currency: string;
}

export function RevenueStats({ stats, currency }: RevenueStatsProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  const cards = [
    // Commission Rate (Optional)
    stats.commissionRate !== undefined && {
      key: "commission",
      icon: TrendingUp,
      label: t("coach.payments.commissionRate", "Commission Rate"),
      value: `${stats.commissionRate}%`,
      color: "primary",
    },
    // Pending Balance
    {
      key: "pending",
      icon: Wallet,
      label: t("coach.payments.pending", "Pending Balance"),
      value: formatPrice(stats.pendingBalance, currency as Currency, language),
      color: "warning", // orange
    },
    // Total Earned
    {
      key: "earned",
      icon: DollarSign,
      label: t("coach.payments.totalEarned", "Total Earned"),
      value: formatPrice(stats.totalEarned, currency as Currency, language),
      color: "success", // green
    },
    // Total Payouts (Optional)
    stats.totalPaidOut !== undefined && {
      key: "payouts",
      icon: History,
      label: t("coach.payments.totalPayouts", "Total Payouts"),
      value: formatPrice(stats.totalPaidOut, currency as Currency, language),
      color: "blue",
    },
  ].filter(Boolean) as any[];

  // Define color styles mapping
  const colorStyles: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    primary: {
      // purple usually
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/20",
    },
    warning: {
      // orange
      bg: "bg-orange-500/10",
      text: "text-orange-500",
      border: "border-orange-500/20",
    },
    success: {
      // green
      bg: "bg-green-500/10",
      text: "text-green-500",
      border: "border-green-500/20",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      border: "border-blue-500/20",
    },
  };

  return (
    <div
      className={`grid gap-6 md:grid-cols-${cards.length > 3 ? 4 : cards.length} text-text-primary`}
    >
      {cards.map((card) => {
        const styles = colorStyles[card.color] || colorStyles.primary;
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className={`relative overflow-hidden rounded-2xl p-6 bg-surface border ${styles.border} shadow-sm group hover:shadow-md transition-all duration-300`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon
                className={`w-24 h-24 ${styles.text} transform rotate-12 translate-x-4 -translate-y-4`}
              />
            </div>
            <div className="relative z-10">
              <div className={`p-3 ${styles.bg} rounded-xl w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${styles.text}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {card.label}
                </p>
                <h3 className="text-3xl font-bold text-foreground">
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
