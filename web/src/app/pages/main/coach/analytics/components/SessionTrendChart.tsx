import type { TrendDataPoint } from "@ahmedrioueche/gympro-client";
import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "../../../../../components/analytics/TrendChart";

interface SessionTrendChartProps {
  data: TrendDataPoint[];
}

export const SessionTrendChart = ({ data }: SessionTrendChartProps) => {
  const { t } = useTranslation();

  // Map TrendDataPoint to the format expected by TrendChart
  const chartData = data.map((point) => ({
    date: point.date,
    amount: point.value,
  }));

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("coachAnalytics.charts.sessionTrend")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t("coachAnalytics.charts.sessionTrendDesc")}
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>
      <div className="h-[250px] w-full mt-4">
        <TrendChart data={chartData} color="#8b5cf6" height={250} />
      </div>
    </div>
  );
};
