import { type ProgressHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface RecentWorkoutsProps {
  history?: ProgressHistory[];
  isLoading: boolean;
}

export const RecentWorkouts = ({ history, isLoading }: RecentWorkoutsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get last 5 activities
  const recentActivities = history
    ?.map((h) => ({ ...h }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-surface/90 rounded-xl border border-border p-6 h-full animate-pulse">
        <div className="h-6 w-32 bg-background/50 rounded mb-6" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-background/20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-text-primary">
          {t("progress.recent.title")}
        </h3>
        <button
          onClick={() => navigate({ to: APP_PAGES.member.training.link })}
          className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1"
        >
          {t("progress.recent.viewAll")}
          <ChevronRight size={14} />
        </button>
      </div>

      {!recentActivities?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center mb-3">
            <Calendar size={20} className="text-text-tertiary" />
          </div>
          <p className="text-sm text-text-secondary">
            {t("progress.recent.noWorkouts")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={`${activity.date}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary/50 hover:bg-background-tertiary transition-colors border border-transparent hover:border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {new Date(activity.date).getDate()}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {activity.durationMinutes} min • {activity.volumeKg} kg
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
