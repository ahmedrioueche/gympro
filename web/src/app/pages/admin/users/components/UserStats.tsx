import { Ban, Shield, UserPlus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserStatsProps {
  stats: {
    total: number;
    new: number;
    coaches: number;
    banned: number;
  };
}

export const UserStats = ({ stats }: UserStatsProps) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("admin.users.stats.total"),
      value: stats.total.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: t("admin.users.stats.new"),
      value: stats.new.toLocaleString(),
      icon: UserPlus,
      color: "bg-green-500",
    },
    {
      label: t("admin.users.stats.coaches"),
      value: stats.coaches.toLocaleString(),
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      label: t("admin.users.stats.banned"),
      value: stats.banned.toLocaleString(),
      icon: Ban,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg"
        >
          <div className={`${card.color} p-3 rounded-xl text-white`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-text-secondary font-medium">
              {card.label}
            </div>
            <div className="text-2xl font-bold text-text-primary mt-1">
              {card.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
