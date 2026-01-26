import { Activity, Calendar, CreditCard, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MemberHomeStatsProps {
  stats: {
    activeSubscriptions: number;
    checkIns: number;
    nextClass: string;
    daysStreak: number;
  };
}

export const MemberHomeStats = ({ stats }: MemberHomeStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
        <div className="p-2 rounded-full bg-green-500/10 text-green-500">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-text-primary">
            {stats.activeSubscriptions}
          </span>
          <span className="text-xs text-text-secondary">
            {t("home.member.stats.activeSubscriptions")}
          </span>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
        <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-text-primary">
            {stats.checkIns}
          </span>
          <span className="text-xs text-text-secondary">
            {t("home.member.stats.checkIns")}
          </span>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
        <div className="p-2 rounded-full bg-orange-500/10 text-orange-500">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-text-primary">
            {stats.nextClass}
          </span>
          <span className="text-xs text-text-secondary">
            {t("home.member.stats.nextClass")}
          </span>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-primary/30 transition-colors">
        <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <span className="block text-2xl font-bold text-text-primary">
            {stats.daysStreak}
          </span>
          <span className="text-xs text-text-secondary">
            {t("home.member.stats.daysStreak")}
          </span>
        </div>
      </div>
    </div>
  );
};
