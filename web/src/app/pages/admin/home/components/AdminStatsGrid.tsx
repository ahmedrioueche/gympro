import { type AdminDashboardStats } from "@ahmedrioueche/gympro-client";
import { Activity, Building2, CreditCard, Users } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import GradientCard from "../../../../../components/ui/GradientCard";

interface AdminStatsGridProps {
  stats: AdminDashboardStats;
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <GradientCard>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {t("admin.home.overview.title", "System Overview")}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          {t("admin.home.overview.subtitle", "Key performance metrics")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Users - Blue */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalUsers}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {t("admin.home.stats.totalUsers")}
          </p>
        </div>

        {/* Active Gyms - Emerald */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.activeGyms}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {t("admin.home.stats.activeGyms")}
          </p>
        </div>

        {/* Revenue - Amber */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.totalRevenue.toLocaleString()}{" "}
              <span className="text-lg">DZD</span>
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {t("admin.home.stats.revenue")}
          </p>
        </div>

        {/* Pending Approvals - Red */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-lg bg-red-500/20 dark:bg-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">
              {stats.pendingApprovals}
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
            {t("admin.home.stats.pendingApprovals")}
          </p>
        </div>
      </div>
    </GradientCard>
  );
};

export default AdminStatsGrid;
