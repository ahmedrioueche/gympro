import type { Gym, User } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { Building2, User as UserIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import GradientCard from "../../../../../components/ui/GradientCard";

interface RecentActivityProps {
  users: User[];
  gyms: Gym[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ users, gyms }) => {
  const { t } = useTranslation();

  const activities = [
    ...users.map((u) => ({
      type: "user",
      data: u,
      date: new Date(u.createdAt || Date.now()),
    })),
    ...gyms.map((g) => ({
      type: "gym",
      data: g,
      date: new Date(g.createdAt || Date.now()),
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5); // Show top 5 combined

  return (
    <GradientCard>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        {t("admin.home.recentActivity.title")}
      </h2>

      {activities.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl">
            📭
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {t("admin.home.recentActivity.emptyTitle", "No Activity Yet")}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {t(
              "admin.home.recentActivity.emptyDesc",
              "New users and gyms will appear here",
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const isUser = activity.type === "user";
            const item = activity.data as any; // Cast for simpler access
            const name = isUser ? item.fullName || item.username : item.name;
            const Icon = isUser ? UserIcon : Building2;
            const colorClass = isUser
              ? "bg-blue-500/10 text-blue-500"
              : "bg-green-500/10 text-green-500";
            const actionText = isUser
              ? "New user joined"
              : "New gym registered";

            return (
              <div
                key={index}
                className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0"
              >
                <div className={`p-3 rounded-full ${colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {actionText}
                  </p>
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {formatDistanceToNow(activity.date, { addSuffix: true })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GradientCard>
  );
};

export default RecentActivity;
