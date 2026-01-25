import {
  formatPrice,
  type SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import GradientCard from "../../../../../../components/ui/GradientCard";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useLanguageStore } from "../../../../../../store/language";
import { useUserStore } from "../../../../../../store/user";

interface BusinessMetrics {
  totalGyms: number;
  activeMembers: number;
  totalStaff?: number;
  totalRevenue: number;
  monthlyRevenue: number;
  outstandingPayments?: number;
  issues?: number;
  currency?: string;
}

interface BusinessOverviewProps {
  metrics: BusinessMetrics;
}

function BusinessOverview({ metrics }: BusinessOverviewProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { language } = useLanguageStore();
  const hasBusinessData = metrics.totalGyms > 0;

  return (
    <GradientCard>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {t("home.manager.businessOverview.title")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t("home.manager.businessOverview.subtitle")}
        </p>
      </div>

      {hasBusinessData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Total Gyms */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center text-2xl">
                🏢
              </div>
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.totalGyms}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {t("home.manager.businessOverview.totalGyms")}
            </p>
          </div>

          {/* Active Members */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center text-2xl">
                👥
              </div>
              <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {metrics.activeMembers.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {t("home.manager.businessOverview.activeMembers")}
            </p>
          </div>

          {/* Total Staff */}
          {metrics.totalStaff !== undefined && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center text-2xl">
                  👔
                </div>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {metrics.totalStaff}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {t("home.manager.businessOverview.totalStaff")}
              </p>
            </div>
          )}

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-2xl">
                💰
              </div>
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {formatPrice(
                  metrics.totalRevenue,
                  (user?.appSettings?.locale?.currency as SupportedCurrency) ||
                    "USD",
                  user?.appSettings?.locale?.language || language || "en",
                )}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {t("home.manager.businessOverview.totalRevenue")}
            </p>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 dark:bg-orange-500/30 flex items-center justify-center text-2xl">
                📈
              </div>
              <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {formatPrice(
                  metrics.monthlyRevenue,
                  (user?.appSettings?.locale?.currency as SupportedCurrency) ||
                    "USD",
                  user?.appSettings?.locale?.language || language || "en",
                )}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {t("home.manager.businessOverview.monthlyRevenue")}
            </p>
          </div>

          {/* Outstanding Payments */}
          {metrics.outstandingPayments !== undefined && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 dark:bg-orange-500/30 flex items-center justify-center text-2xl">
                  ⚠️
                </div>
                <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {metrics.outstandingPayments}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {t("home.manager.businessOverview.outstandingPayments")}
              </p>
            </div>
          )}

          {/* Issues */}
          {metrics.issues !== undefined && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 dark:bg-red-500/30 flex items-center justify-center text-2xl">
                  🚨
                </div>
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {metrics.issues}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                {t("home.manager.businessOverview.issues")}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl">
            📊
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {t("home.manager.businessOverview.noDataTitle")}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t("home.manager.businessOverview.noDataDescription")}
          </p>
          <Link
            to={APP_PAGES.manager.createGym.link}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <PlusIcon className="w-5 h-5" />
            {t("home.manager.businessOverview.createFirstGym")}
          </Link>
        </div>
      )}
    </GradientCard>
  );
}

export default BusinessOverview;
