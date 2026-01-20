import { type ProgressStats } from "@ahmedrioueche/gympro-client";
import { Activity, Dumbbell, Flame, Trophy } from "lucide-react";
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
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: t("progress.stats.totalVolume"),
      value: `${(stats?.totalVolumeKg || 0).toLocaleString()} kg`,
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: t("progress.stats.currentStreak"),
      value: stats?.currentStreak || 0,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: t("progress.stats.bestStreak"),
      value: stats?.bestStreak || 0,
      icon: Trophy,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="p-4 bg-surface rounded-xl border border-border hover:border-primary/30 transition-colors flex flex-col gap-3"
          >
            <div
              className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}
            >
              <Icon size={20} className={item.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {item.value}
              </p>
              <p className="text-xs text-text-secondary font-medium">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
