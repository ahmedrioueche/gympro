import { DollarSign, PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DummyPageWrapper } from "./DummyPageWrapper";

interface DummyManagerRevenueProps {
  title?: string;
  locationKey?: string;
}

export const DummyManagerRevenue: React.FC<DummyManagerRevenueProps> = ({
  title,
  locationKey = "managerRevenue",
}) => {
  const { t } = useTranslation();

  return (
    <DummyPageWrapper
      pageTitle={title || t("welcomeTour.dummies.managerRevenue.pageTitle")}
      locationKey={locationKey}
    >
      <div className="w-full max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-surface border border-border/50 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="text-green-500 w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-black text-text-primary leading-tight">
                    {t("welcomeTour.dummies.managerRevenue.title")}
                  </h4>
                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-none">
                    {t("welcomeTour.dummies.managerRevenue.last30Days")}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-success/10 text-success rounded-full text-[9px] font-black border border-success/20">
                {t("welcomeTour.dummies.managerRevenue.growth")}
              </span>
            </div>

            <div className="relative h-32 flex items-end justify-between gap-1 px-1 border-b border-l border-border/20 pb-1">
              {[30, 45, 35, 60, 50, 85, 65, 90, 75, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      i === 9
                        ? "bg-gradient-to-t from-green-500 to-emerald-400"
                        : "bg-green-500/20 group-hover:bg-green-500/40"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  {t("welcomeTour.dummies.managerRevenue.totalEarnings")}
                </span>
              </div>
              <div className="text-xl font-black text-text-primary italic">
                $24,580.00
              </div>
            </div>

            <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  {t("welcomeTour.dummies.managerRevenue.expenses")}
                </span>
              </div>
              <div className="text-xl font-black text-text-primary italic">
                $12,420.00
              </div>
            </div>

            <div className="bg-surface border border-border/40 rounded-2xl p-4 shadow-lg bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">
                  {t("welcomeTour.dummies.managerRevenue.profit")}
                </span>
              </div>
              <div className="text-xl font-black text-primary italic">
                $12,160.00
              </div>
            </div>
          </div>
        </div>
      </div>
    </DummyPageWrapper>
  );
};
