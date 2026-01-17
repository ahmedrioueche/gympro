import type { RecentActivity as RecentActivityType } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface RecentActivityProps {
  activities: RecentActivityType[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        {t("coachAnalytics.recentActivity")}
      </h3>
      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 rounded-xl bg-surface-secondary"
            >
              {activity.clientAvatar ? (
                <img
                  src={activity.clientAvatar}
                  alt={activity.clientName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {activity.clientName?.[0]?.toUpperCase() || "?"}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {activity.description}
                </p>
                <p className="text-xs text-text-secondary">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary text-center py-8">
          {t("coachAnalytics.noRecentActivity")}
        </p>
      )}
    </div>
  );
};
