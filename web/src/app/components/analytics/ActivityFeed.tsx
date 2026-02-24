import type { RecentActivity as RecentActivityType } from "@ahmedrioueche/gympro-client";
import { Bell, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActivityFeedProps {
  activities: RecentActivityType[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const { t } = useTranslation();

  return (
    <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:shadow-xl hover:shadow-primary/5">
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-8">
          <div className="space-y-1">
            <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <Bell size={18} className="text-primary md:w-5 md:h-5" />
              {t("coachAnalytics.recentActivity", "Recent Activity")}
            </h3>
            <p className="text-xs md:text-sm font-medium text-text-secondary/80">
              {t(
                "coachAnalytics.recentActivityDesc",
                "Latest updates from your coaching business",
              )}
            </p>
          </div>
        </div>

        {activities && activities.length > 0 ? (
          <div className="space-y-2 md:space-y-3">
            {activities.slice(0, 6).map((activity, idx) => (
              <div
                key={idx}
                className="group/item flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-surface border border-border/40 hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
              >
                {activity.clientAvatar ? (
                  <img
                    src={activity.clientAvatar}
                    alt={activity.clientName}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl object-cover ring-2 ring-border/50 group-hover/item:ring-primary/30 transition-all"
                  />
                ) : (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center ring-2 ring-border/50 group-hover/item:ring-primary/30 transition-all">
                    <User size={18} className="text-primary md:w-5 md:h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] md:text-sm font-bold text-text-primary truncate">
                    {activity.description}
                  </p>
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-text-secondary/60 mt-0.5">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="hidden sm:block opacity-0 group-hover/item:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 md:py-12 space-y-3">
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-surface-secondary text-text-secondary/40">
              <Bell size={32} className="md:w-10 md:h-10" />
            </div>
            <p className="text-xs md:text-sm font-bold text-text-secondary/60">
              {t("coachAnalytics.noRecentActivity", "No recent activity found")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
