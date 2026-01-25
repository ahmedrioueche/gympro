import { formatPrice, type Currency } from "@ahmedrioueche/gympro-client";
import { DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../../../../../store/language";

interface RevenueStatsProps {
  stats: {
    totalEarned: number;
    pendingBalance: number;
    commissionRate: number;
  };
  currency: string;
}

export function RevenueStats({ stats, currency }: RevenueStatsProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();

  return (
    <div className="grid gap-6 md:grid-cols-3 text-text-primary">
      {/* Commission Rate */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrendingUp className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <div className="p-3 bg-primary/20 rounded-xl w-fit mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {t("coach.payments.commissionRate")}
            </p>
            <h3 className="text-3xl font-bold text-foreground">
              {stats.commissionRate}%
            </h3>
          </div>
        </div>
      </div>

      {/* Pending Balance */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent border border-warning/20 shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="w-24 h-24 text-warning transform rotate-12 translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <div className="p-3 bg-warning/20 rounded-xl w-fit mb-4">
            <Wallet className="w-6 h-6 text-warning" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {t("coach.payments.pendingBalance")}
            </p>
            <h3 className="text-3xl font-bold text-foreground">
              {formatPrice(
                stats.pendingBalance,
                currency as Currency,
                language,
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Total Earned */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-success/10 via-success/5 to-transparent border border-success/20 shadow-sm group hover:shadow-md transition-all duration-300">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <DollarSign className="w-24 h-24 text-success transform rotate-12 translate-x-4 -translate-y-4" />
        </div>
        <div className="relative z-10">
          <div className="p-3 bg-success/20 rounded-xl w-fit mb-4">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {t("coach.payments.totalEarned")}
            </p>
            <h3 className="text-3xl font-bold text-foreground">
              {formatPrice(stats.totalEarned, currency as Currency, language)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
