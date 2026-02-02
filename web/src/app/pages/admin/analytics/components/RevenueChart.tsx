import { TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "../../../../components/analytics/TrendChart";

interface RevenueChartProps {
  data: { date: string; amount: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.analytics.charts.revenue", "Revenue Growth")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t(
              "admin.analytics.charts.revenueDesc",
              "Platform revenue over time",
            )}
          </p>
        </div>
        <TrendingUp className="w-5 h-5 text-success" />
      </div>
      <div className="h-[250px] w-full mt-4">
        <TrendChart data={data} color="#10b981" height={250} />
      </div>
    </div>
  );
}
