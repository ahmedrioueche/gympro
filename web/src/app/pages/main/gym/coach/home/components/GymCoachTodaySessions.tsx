import { Link, useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../../components/ui/Loading";
import { APP_PAGES } from "../../../../../../../constants/navigation";
import { useGymCoachSessions } from "../hooks/useGymCoachSessions";

export default function GymCoachTodaySessions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: sessions, isLoading } = useGymCoachSessions();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("home.coach.todaySessions.title", "Today's Sessions")}
        </h2>
        <Calendar className="w-5 h-5 text-text-secondary" />
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.slice(0, 3).map((session: any, idx) => (
            <Link
              to={`${APP_PAGES.gym.coach.schedule.link}`}
              key={session._id || idx}
              className="block p-4 rounded-xl bg-surface-hover border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <Clock className="w-4 h-4 text-primary" />
                  {new Date(session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    session.status === "completed"
                      ? "bg-green-500/10 text-green-500"
                      : session.status === "cancelled"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-text-secondary" />
                <p className="font-medium text-text-primary text-sm">
                  {session.client?.profile?.fullName || "Client"}
                </p>
              </div>
              <p className="text-xs text-text-secondary pl-6">
                {session.type || "Session"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-text-secondary">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {t("home.coach.todaySessions.empty", "No sessions today")}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate({ to: APP_PAGES.coach.schedule.link })}
        className="w-full mt-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors text-sm"
      >
        {t("home.coach.todaySessions.viewSchedule", "View Schedule")}
      </button>
    </div>
  );
}
