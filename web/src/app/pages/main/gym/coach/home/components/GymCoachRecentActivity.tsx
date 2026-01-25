import {
  Clipboard,
  MessageSquare,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Activity {
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface GymCoachRecentActivityProps {
  activities?: Activity[];
}

export default function GymCoachRecentActivity({
  activities,
}: GymCoachRecentActivityProps) {
  const { t } = useTranslation();

  const defaultActivities: Activity[] = [
    {
      type: "workout",
      message: t("home.coach.activity.workoutCompleted", {
        client: "Alice Brown",
        defaultValue: "Alice Brown completed a workout",
      }),
      time: "2h ago",
      icon: Clipboard,
      color: "text-green-500",
    },
    {
      type: "message",
      message: t("home.coach.activity.newMessage", {
        client: "Bob Wilson",
        defaultValue: "New message from Bob Wilson",
      }),
      time: "3h ago",
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      type: "milestone",
      message: t("home.coach.activity.milestone", {
        client: "Bob Wilson",
        defaultValue: "Bob Wilson reached a milestone",
      }),
      time: "5h ago",
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  const displayActivities = activities || defaultActivities;

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

      <div className="space-y-6">
        {displayActivities.map((activity, idx) => (
          <div key={idx} className="flex gap-4 group">
            <div
              className={`mt-1 p-2 rounded-full bg-surface-hover ${activity.color} bg-opacity-10 group-hover:scale-110 transition-transform`}
            >
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1 pb-6 border-b border-border last:border-0 last:pb-0">
              <p className="text-sm font-medium text-text-primary mb-1">
                {activity.message}
              </p>
              <p className="text-xs text-text-secondary">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
