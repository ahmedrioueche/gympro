import { useNavigate } from "@tanstack/react-router";
import {
  type LucideIcon,
  Activity as ActivityIcon,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";

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
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
          <ActivityIcon className="w-5 h-5 text-indigo-500" />
          {t("home.coach.recentActivity.title", "Activity Feed")}
        </h2>
        <button
          onClick={() => navigate({ to: APP_PAGES.coach.clients.link })}
          className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
        >
          {t("home.coach.recentActivity.viewAll", "See Everything")}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="space-y-6 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500/20 before:via-purple-500/10 before:to-transparent">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="group relative flex items-start gap-5 transition-all duration-300"
          >
            {/* Timeline Dot & Icon */}
            <div
              className={`relative z-10 p-2.5 rounded-2xl bg-surface border border-border shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-500 ${activity.color}`}
            >
              <activity.icon className="w-4 h-4" strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-text-primary font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors cursor-default">
                {activity.message}
              </p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-12  ">
            <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
              <MessageSquare
                className="w-8 h-8 text-text-secondary/30"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">
              {t("home.coach.recentActivity.empty", "Feed is quiet")}
            </p>
            <p className="text-[10px] text-text-secondary/60 uppercase mt-1">
              {t(
                "home.coach.recentActivity.emptyDesc",
                "Events will appear here",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
