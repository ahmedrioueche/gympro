import type { GymAnalytics } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface GenderSplitProps {
  analytics: GymAnalytics | undefined;
}

export function GenderSplit({ analytics }: GenderSplitProps) {
  const { t } = useTranslation();

  const totalMembers = analytics?.metrics.totalMembers || 1;
  const maleCount = analytics?.genderDistribution.male || 0;
  const femaleCount = analytics?.genderDistribution.female || 0;

  const malePercentage = Math.round((maleCount / totalMembers) * 100);
  const femalePercentage = Math.round((femaleCount / totalMembers) * 100);

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-text-primary mb-6">
        {t("home.gym.genderSplit.title")}
      </h3>
      <div className="space-y-8">
        {/* Male */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary">
                {t("home.gym.genderSplit.male")}
              </span>
              <span className="text-2xl font-black text-blue-500">
                {maleCount}
              </span>
            </div>
            <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-2 py-1 rounded-lg">
              {malePercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
              style={{ width: `${malePercentage}%` }}
            />
          </div>
        </div>

        {/* Female */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-secondary">
                {t("home.gym.genderSplit.female")}
              </span>
              <span className="text-2xl font-black text-pink-500">
                {femaleCount}
              </span>
            </div>
            <span className="text-xs font-bold bg-pink-500/10 text-pink-500 px-2 py-1 rounded-lg">
              {femalePercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-1000"
              style={{ width: `${femalePercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
