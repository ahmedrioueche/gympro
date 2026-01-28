import {
  Calendar,
  Clipboard,
  type LucideIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../../components/ui/Loading";

export interface QuickStat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
  trend?: string;
}

interface GymCoachQuickStatsProps {
  stats?: any; // The real stats object from API
  isLoading?: boolean;
}

export default function GymCoachQuickStats({
  stats,
  isLoading,
}: GymCoachQuickStatsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Loading />;
  }

  // specific stats for this gym context
  const displayStats: QuickStat[] = [
    {
      label: t("home.coach.stats.activeClients", "Active Clients"),
      value: stats?.activeClientsCount || 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: stats?.clientsTrend, // e.g. "+2"
    },
    {
      label: t("home.coach.stats.programsCreated", "Programs"),
      value: stats?.activeProgramsCount || 0,
      icon: Clipboard,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: stats?.programsTrend,
    },
    {
      label: t("home.coach.stats.sessionsThisMonth", "Sessions"),
      value: stats?.completedSessionsCount || 0,
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: stats?.sessionsTrend,
    },
    {
      label: t("home.coach.stats.clientRetention", "Retention"),
      value: `${stats?.retentionRate || 0}%`,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      trend: stats?.retentionTrend,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            {stat.trend && (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-text-primary mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
