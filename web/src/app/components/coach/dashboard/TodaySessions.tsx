import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../constants/navigation";

interface Session {
  time: string;
  client: string;
  type: string;
  status: string;
}

interface TodaySessionsProps {
  sessions: Session[];
}

export default function TodaySessions({ sessions }: TodaySessionsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          {t("home.coach.todaySessions.title", "Today's Lineup")}
        </h2>
        <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
          <Calendar className="w-4 h-4 text-primary" strokeWidth={2.5} />
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session, idx) => (
            <div
              key={idx}
              className="group p-4 rounded-2xl bg-background border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10">
                  <Clock className="w-3 h-3" />
                  {session.time}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                  {session.status}
                </span>
              </div>
              <div>
                <p className="font-black text-text-primary text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                  {session.client}
                </p>
                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">
                  {session.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 rounded-2xl ">
          <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center mx-auto mb-4 border border-border shadow-inner">
            <Calendar className="w-8 h-8 text-text-secondary/30" />
          </div>
          <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">
            {t("home.coach.todaySessions.empty", "No sessions today")}
          </p>
          <p className="text-[10px] text-text-secondary/60 uppercase mt-1">
            {t("home.coach.todaySessions.emptyDesc", "Enjoy your free time!")}
          </p>
        </div>
      )}

      <button
        onClick={() => navigate({ to: APP_PAGES.coach.schedule.link })}
        className="group w-full mt-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover font-black uppercase tracking-widest transition-all text-[11px] shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        {t("home.coach.todaySessions.viewSchedule", "Full Schedule")}
        <Calendar className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
