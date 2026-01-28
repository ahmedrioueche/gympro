import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  Calendar,
  Clipboard,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface GymCoachRecentActivityProps {
  activities?: any[];
  isLoading?: boolean;
}

export default function GymCoachRecentActivity({
  activities,
  isLoading,
}: GymCoachRecentActivityProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 h-full animate-pulse" />
    );
  }

  // Helper to map activity type to icon and color
  const getActivityStyle = (type: string) => {
    switch (type) {
      case "program_assigned":
        return { icon: Clipboard, color: "text-purple-500" };
      case "session_completed":
        return { icon: Activity, color: "text-green-500" };
      case "new_client":
        return { icon: UserPlus, color: "text-blue-500" };
      case "message":
        return { icon: MessageSquare, color: "text-orange-500" };
      default:
        return { icon: Calendar, color: "text-text-secondary" };
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("home.coach.activity.title", "Recent Activity")}
        </h2>
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">
          {t("common.viewAll", "View All")}
        </span>
      </div>

      {activities && activities.length > 0 ? (
        <div className="space-y-6">
          {activities.slice(0, 5).map((activity, idx) => {
            const style = getActivityStyle(activity.type);
            const Icon = style.icon;

            return (
              <div key={idx} className="flex gap-4 group">
                <div
                  className={`mt-1 p-2 rounded-full bg-surface-hover ${style.color} bg-opacity-10 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-4 h-4 ${style.color}`} />
                </div>
                <div className="flex-1 pb-6 border-b border-border last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-text-primary mb-1">
                    {activity.message || activity.description}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {activity.createdAt &&
                    !isNaN(new Date(activity.createdAt).getTime())
                      ? formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })
                      : t("common.justNow", "Just now")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-text-secondary">
          <p>{t("home.coach.activity.empty", "No recent activity")}</p>
        </div>
      )}
    </div>
  );
}
