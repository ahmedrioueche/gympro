import type { Session } from "@ahmedrioueche/gympro-client";
import { DayColumn } from "./DayColumn";

interface WeeklyGridProps {
  weekDays: Date[];
  sessions: Session[];
  getSessionsForDay: (day: Date, sessions: Session[]) => Session[];
  onSessionClick: (session: Session) => void;
}

export const WeeklyGrid = ({
  weekDays,
  sessions,
  getSessionsForDay,
  onSessionClick,
}: WeeklyGridProps) => {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:overflow-x-auto">
        {weekDays.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            sessions={getSessionsForDay(day, sessions)}
            onSessionClick={onSessionClick}
          />
        ))}
      </div>
    </div>
  );
};
