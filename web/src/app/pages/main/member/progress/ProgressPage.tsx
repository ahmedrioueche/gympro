import { TrendingUp, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../../components/PageHeader";
import { ActivityCalendar } from "./components/ActivityCalendar";
import { RecentWorkouts } from "./components/RecentWorkouts";
import { StatsOverview } from "./components/StatsOverview";
import { useProgressHistory, useProgressStats } from "./hooks/useProgress";

const ProgressPage = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useProgressStats();
  const { data: history, isLoading: historyLoading } = useProgressHistory();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        icon={TrendingUp}
        title={t("progress.title")}
        subtitle={t("progress.subtitle")}
        extra={
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
            <Zap size={16} className="text-primary fill-primary" />
            <span className="text-xs font-black text-primary uppercase tracking-wider">
              {t("progress.streakBadge", { count: stats?.currentStreak || 0 })}
            </span>
          </div>
        }
      />

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityCalendar history={history} />
        </div>
        <div>
          <RecentWorkouts history={history} />
        </div>
      </div>

      {/* Motivational Quote or Hint */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary to-indigo-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <h4 className="text-xl font-black tracking-tight">
            {t("progress.motivation.title")}
          </h4>
          <p className="text-white/80 text-sm font-medium mt-1 max-w-md">
            {t("progress.motivation.subtitle", {
              count: stats?.totalWorkouts || 0,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
