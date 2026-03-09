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

  const cards = [
    {
      value: stats.activeSubscriptions,
      label: t("home.member.stats.activeSubscriptions"),
      icon: CreditCard,
      colorFrom: "from-green-500",
      colorTo: "to-emerald-600",
      shadow: "shadow-green-500/20",
    },
    {
      value: stats.checkIns,
      label: t("home.member.stats.checkIns"),
      icon: Activity,
      colorFrom: "from-blue-500",
      colorTo: "to-indigo-600",
      shadow: "shadow-blue-500/20",
    },
    {
      value: stats.nextClass,
      label: t("home.member.stats.nextClass"),
      icon: Calendar,
      colorFrom: "from-orange-500",
      colorTo: "to-red-600",
      shadow: "shadow-orange-500/20",
    },
    {
      value: stats.daysStreak,
      label: t("home.member.stats.daysStreak"),
      icon: Timer,
      colorFrom: "from-purple-500",
      colorTo: "to-pink-600",
      shadow: "shadow-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="group relative overflow-hidden flex flex-col rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 items-center justify-center text-center gap-4"
          >
            {/* Background Gradient Glow */}
            <div
              className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${card.colorFrom} ${card.colorTo} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
            />

            <div
              className={`p-3 rounded-2xl bg-gradient-to-br ${card.colorFrom} ${card.colorTo} text-white shadow-lg ${card.shadow} shrink-0 relative z-10 transition-transform group-hover:scale-110 duration-300`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <span className="block text-3xl font-black tracking-tight text-text-primary mb-1">
                {card.value}
              </span>
              <span className="text-[10px] md:text-xs text-text-secondary font-bold uppercase tracking-widest">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
