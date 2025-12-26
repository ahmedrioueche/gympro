import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface LastVisitedGym {
  name: string;
  activeMembers: number;
  todayCheckIns: number;
  revenueTrend: string;
  trendPositive: boolean;
}

interface GymOverviewProps {
  lastVisitedGym: LastVisitedGym | null;
}

function GymOverview({ lastVisitedGym }: GymOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {t("home.manager.gymOverview.title")}
        </h2>

        {lastVisitedGym ? (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-600/50 border border-slate-200 dark:border-slate-600 rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {lastVisitedGym.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {lastVisitedGym.activeMembers}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {t("home.manager.gymOverview.activeMembers")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  {lastVisitedGym.todayCheckIns}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {t("home.manager.gymOverview.todayCheckIns")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-4 text-center">
                <p
                  className={`text-3xl font-bold mb-1 ${
                    lastVisitedGym.trendPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {lastVisitedGym.revenueTrend}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {t("home.manager.gymOverview.revenueTrend")}
                </p>
              </div>
            </div>

            <Link
              to={APP_PAGES.manager.gyms.link}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t("home.manager.gymOverview.viewDetails")} →
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl">
              🏢
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {t("home.manager.gymOverview.noGymTitle")}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("home.manager.gymOverview.noGymDescription")}
            </p>
            <Link
              to={APP_PAGES.manager.createGym.link}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5" />
              {t("home.manager.gymOverview.createGym")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default GymOverview;
