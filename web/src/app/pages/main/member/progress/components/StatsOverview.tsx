import { type ProgressStats } from "@ahmedrioueche/gympro-client";
import { Award, Dumbbell, Flame, Scale, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatsOverviewProps {
  stats?: ProgressStats;
}

export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const { t } = useTranslation();

  const statItems = [
    {
      label: t("progress.stats.totalWorkouts"),
      value: stats?.totalWorkouts || 0,
      icon: Dumbbell,
      color: "from-blue-500 to-indigo-600",
      description: t("progress.stats.workoutsDesc", "Total training sessions"),
    },
    {
      label: t("progress.stats.totalVolume"),
      value: `${((stats?.totalVolumeKg || 0) / 1000).toFixed(1)}t`,
      icon: Scale,
      color: "from-purple-500 to-pink-600",
      description: t("progress.stats.volumeDesc", "Total weight lifted"),
    },
    {
      label: t("progress.stats.currentStreak"),
      value: stats?.currentStreak || 0,
      icon: Flame,
      color: "from-orange-500 to-red-600",
      description: t("progress.stats.streakDesc", "Consecutive days"),
    },
    {
      label: t("progress.stats.bestStreak"),
      value: stats?.bestStreak || 0,
      icon: Award,
      color: "from-emerald-500 to-teal-600",
      description: t("progress.stats.bestStreakDesc", "Your personal record"),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 cursor-default"
        >
          {/* Background Gradient Glow */}
          <div
            className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
          />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg shadow-primary/10`}
              >
                <item.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-[10px] font-bold">
                <TrendingUp size={12} />
                <span>{t("progress.stats.trend", { percent: 12 })}</span>
              </div>
            </div>

            <div>
              <p className="text-3xl font-black text-text-primary tracking-tight">
                {item.value}
              </p>
              <p className="text-sm font-bold text-text-secondary mt-1">
                {item.label}
              </p>
              <p className="text-[10px] text-text-secondary/60 mt-1 uppercase tracking-wider font-medium">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
