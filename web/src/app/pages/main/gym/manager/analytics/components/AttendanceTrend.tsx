import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import { Calendar, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import TrendChart from "../../../../../../components/analytics/TrendChart";

interface AttendanceTrendProps {
  data: GymAnalytics["attendanceTrend"];
}

export const AttendanceTrend = ({ data }: AttendanceTrendProps) => {
  const { t } = useTranslation();

  const totalCheckIns = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              {t("analytics.gym.charts.attendance", "Attendance Trend")}
            </h3>
            <p className="text-sm font-medium text-text-secondary/80">
              {t(
                "analytics.gym.charts.attendanceDesc",
                "Daily check-ins over time",
              )}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <TrendingUp size={14} className="font-bold" />
              <span className="text-xs font-black uppercase tracking-wider">
                {totalCheckIns} {t("common.total", "Total")}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full mt-4">
          <TrendChart
            data={data.map((item) => ({
              date: item.date,
              amount: item.count,
            }))}
            color="#8b5cf6"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};
