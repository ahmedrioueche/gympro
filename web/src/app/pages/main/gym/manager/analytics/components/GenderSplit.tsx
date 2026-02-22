import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import { User, UserCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GenderSplitProps {
  distribution: GymAnalytics["genderDistribution"];
  totalMembers: number;
}

export const GenderSplit = ({
  distribution,
  totalMembers,
}: GenderSplitProps) => {
  const { t } = useTranslation();

  const genderItems = [
    {
      label: t("home.gym.genderSplit.male", "Male"),
      value: distribution.male,
      color: "from-blue-400 to-blue-600",
      textColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
      icon: User,
    },
    {
      label: t("home.gym.genderSplit.female", "Female"),
      value: distribution.female,
      color: "from-pink-400 to-pink-600",
      textColor: "text-pink-500",
      bgColor: "bg-pink-500/10",
      icon: UserCircle,
    },
  ];

  const total = Math.max(1, totalMembers);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-surface p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <Users size={20} className="text-primary" />
              {t("analytics.gym.charts.genderDist", "Gender Distribution")}
            </h3>
            <p className="text-sm font-medium text-text-secondary/80">
              {t(
                "analytics.gym.charts.genderDistDesc",
                "Member demographics breakdown",
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {genderItems.map((item, idx) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={idx} className="relative group/item space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${item.bgColor} ${item.textColor} shadow-lg shadow-primary/5 group-hover/item:scale-110 transition-transform duration-500`}
                    >
                      <item.icon size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span
                        className={`text-3xl font-black ${item.textColor} tracking-tight`}
                      >
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${item.bgColor} ${item.textColor} border border-current/10`}
                  >
                    <span className="text-xs font-black tracking-wider text-current">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 w-full bg-border/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 shadow-md`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
