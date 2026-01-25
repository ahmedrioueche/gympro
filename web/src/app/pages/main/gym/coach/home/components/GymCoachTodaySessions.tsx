import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../../../constants/navigation";

interface Session {
  time: string;
  client: string;
  type: string;
  status: string;
}

interface GymCoachTodaySessionsProps {
  sessions?: Session[];
}

export default function GymCoachTodaySessions({
  sessions,
}: GymCoachTodaySessionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Mock data for specific gym sessions
  const defaultSessions: Session[] = [
    {
      time: "10:00 AM",
      client: "Alice Brown",
      type: "PT Session",
      status: "upcoming",
    },
    {
      time: "02:00 PM",
      client: "Bob Wilson",
      type: "Consultation",
      status: "upcoming",
    },
  ];

  const displaySessions = sessions || defaultSessions;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("home.coach.todaySessions.title", "Today's Sessions")}
        </h2>
        <Calendar className="w-5 h-5 text-text-secondary" />
      </div>

      {displaySessions.length > 0 ? (
        <div className="space-y-3">
          {displaySessions.map((session, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-hover border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                  <Clock className="w-4 h-4 text-primary" />
                  {session.time}
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {session.status}
                </span>
              </div>
              <p className="font-medium text-text-primary text-sm">
                {session.client}
              </p>
              <p className="text-xs text-text-secondary">{session.type}</p>
            </div>
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
