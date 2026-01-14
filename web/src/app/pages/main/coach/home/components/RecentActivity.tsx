import { useNavigate } from "@tanstack/react-router";
import { type LucideIcon, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface Activity {
  type: string;
  message: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("home.coach.recentActivity.title")}
        </h2>
        <button
          onClick={() => navigate({ to: APP_PAGES.coach.clients.link })}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {t("home.coach.recentActivity.viewAll")}
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 p-4 rounded-xl bg-surface-hover hover:bg-border/30 transition-colors"
          >
            <div className={`p-2 rounded-full bg-surface ${activity.color}`}>
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary font-medium mb-1">
                {activity.message}
              </p>
              <p className="text-xs text-text-secondary">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t("home.coach.recentActivity.empty")}</p>
        </div>
      )}
    </div>
  );
}
