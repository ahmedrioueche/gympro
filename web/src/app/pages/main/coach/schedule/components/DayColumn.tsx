import type { Session } from "@ahmedrioueche/gympro-client";
import { format, isToday } from "date-fns";
import { SessionCard } from "./SessionCard";

interface DayColumnProps {
  day: Date;
  sessions: Session[];
  onSessionClick: (session: Session) => void;
}

export const DayColumn = ({
  day,
  sessions,
  onSessionClick,
}: DayColumnProps) => {
  const isCurrentDay = isToday(day);

  return (
    <div
      className={`flex-1 w-full md:w-auto md:min-w-[140px] border-b md:border-b-0 md:border-r border-border last:border-0 ${
        isCurrentDay ? "bg-primary/5" : ""
      }`}
    >
      {/* Day Header */}
      <div
        className={`p-3 text-center border-b border-border ${
          isCurrentDay ? "bg-primary/10" : "bg-surface-secondary"
        }`}
      >
        <p className="text-xs text-text-secondary uppercase tracking-wide">
          {format(day, "EEE")}
        </p>
        <p
          className={`text-lg font-semibold ${
            isCurrentDay ? "text-primary" : "text-text-primary"
          }`}
        >
          {format(day, "d")}
        </p>
      </div>

      {/* Sessions */}
      <div className="p-2 min-h-[150px] md:min-h-[400px] space-y-2">
        {sessions.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            onClick={() => onSessionClick(session)}
          />
        ))}
      </div>
    </div>
  );
};
