import { type ProgressHistory } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, ChevronRight, Clock, Dumbbell, History } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../constants/navigation";
import useWeightUnit from "../../../../../../hooks/useWeightUnit";

interface RecentWorkoutsProps {
  history?: ProgressHistory[];
}

export const RecentWorkouts = ({ history }: RecentWorkoutsProps) => {
  const { t } = useTranslation();
  const { unit: weightUnit } = useWeightUnit();
  const navigate = useNavigate();

  // Get last 5 activities
  const recentActivities = history
    ?.map((h) => ({ ...h }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-surface rounded-3xl border border-border/50 p-4 md:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-black text-text-primary tracking-tight">
            {t("progress.recent.title", "Recent Workouts")}
          </h3>
          <p className="text-[10px] md:text-xs text-text-secondary font-medium">
            {t("progress.recent.subtitle", "Your latest training sessions")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: APP_PAGES.member.training.link })}
          className="p-1.5 md:p-2 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
        >
          <History size={16} className="md:w-[18px] md:h-[18px]" />
        </button>
      </div>

      {!recentActivities?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6 md:py-8">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-surface-secondary flex items-center justify-center mb-3 md:mb-4">
            <Calendar
              size={24}
              className="md:w-7 md:h-7 text-text-secondary opacity-50"
            />
          </div>
          <p className="text-xs md:text-sm font-bold text-text-secondary px-4">
            {t("progress.recent.noWorkouts")}
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {recentActivities.map((activity, index) => (
            <div
              key={`${activity.date}-${index}`}
              onClick={() => navigate({ to: APP_PAGES.member.training.link })}
              className="group relative flex items-center justify-between p-3 md:p-4 rounded-2xl bg-surface-secondary/50 hover:bg-surface-secondary transition-all cursor-pointer border border-transparent hover:border-border/50 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex flex-col items-center justify-center border border-primary/10 group-hover:scale-105 transition-transform">
                  <span className="text-[9px] md:text-xs font-black text-primary uppercase leading-none">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      month: "short",
                    })}
                  </span>
                  <span className="text-base md:text-lg font-black text-text-primary leading-none mt-0.5">
                    {new Date(activity.date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-black text-text-primary group-hover:text-primary transition-colors">
                    {new Date(activity.date).toLocaleDateString(undefined, {
                      weekday: "long",
                    })}
                  </p>
                  <div className="flex items-center gap-2 md:gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <Clock size={10} className="text-primary" />
                      {activity.durationMinutes} min
                    </span>
                    <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                      <Dumbbell size={10} className="text-accent" />
                      {activity.volumeKg} {weightUnit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-1.5 md:p-2 rounded-xl bg-border/20 text-text-secondary opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate({ to: APP_PAGES.member.training.link })}
            className="w-full py-2.5 md:py-3 rounded-2xl bg-surface-secondary border border-border/50 text-[10px] md:text-xs text-text-primary uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            {t("progress.recent.viewAll")}
          </button>
        </div>
      )}
    </div>
  );
};
