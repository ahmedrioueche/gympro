import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "../../../../components/analytics/TrendChart";

interface UserGrowthChartProps {
  data: { date: string; count: number }[];
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("admin.analytics.charts.members", "User Adoption")}
          </h3>
          <p className="text-sm text-text-secondary">
            {t(
              "admin.analytics.charts.membersDesc",
              "Total active users across all gyms",
            )}
          </p>
        </div>
        <Users className="w-5 h-5 text-primary" />
      </div>
      <div className="h-[250px] w-full mt-4">
        <TrendChart
          data={data.map((item) => ({
            date: item.date,
            amount: item.count,
          }))}
          color="#8b5cf6"
          height={250}
        />
      </div>
    </div>
  );
}
