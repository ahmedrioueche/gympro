import { type ProgressHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight, Clock, Dumbbell, History } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";

interface RecentWorkoutsProps {
  history?: ProgressHistory[];
}

export const RecentWorkouts = ({ history }: RecentWorkoutsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Get last 5 activities
  const recentActivities = history
    ?.map((h) => ({ ...h }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-surface rounded-3xl border border-border/50 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-black text-text-primary tracking-tight">
            {t("progress.recent.title", "Recent Workouts")}
          </h3>
          <p className="text-xs text-text-secondary font-medium">
            {t("progress.recent.subtitle", "Your latest training sessions")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: APP_PAGES.member.training.link })}
          className="p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
        >
          <History size={18} />
        </button>
      </div>

      {!recentActivities?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-3xl bg-surface-secondary flex items-center justify-center mb-4">
            <Calendar size={28} className="text-text-secondary opacity-50" />
          </div>
          <p className="text-sm font-bold text-text-secondary">
            {t("progress.recent.noWorkouts")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={`${activity.date}-${index}`}
              className="group relative flex items-center justify-between p-4 rounded-2xl bg-surface-secondary/50 hover:bg-surface-secondary transition-all cursor-pointer border border-transparent hover:border-border/50 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex flex-col items-center justify-center border border-primary/10 group-hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-primary uppercase leading-none">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      month: "short",
                    })}
                  </span>
                  <span className="text-lg font-black text-text-primary leading-none mt-0.5">
                    {new Date(activity.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black text-text-primary group-hover:text-primary transition-colors">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <Clock size={10} className="text-primary" />
                      {activity.durationMinutes} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <Dumbbell size={10} className="text-accent" />
                      {activity.volumeKg} kg
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-border/20 text-text-secondary opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={16} />
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate({ to: APP_PAGES.member.training.link })}
            className="w-full py-3 rounded-2xl bg-surface-secondary border border-border/50 text-text-secondary text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            {t("progress.recent.viewAll")}
          </button>
        </div>
      )}
    </div>
  );
};
