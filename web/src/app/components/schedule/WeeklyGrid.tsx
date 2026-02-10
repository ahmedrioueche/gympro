import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { DayColumn } from "./DayColumn";

interface WeeklyGridProps {
  weekDays: Date[];
  sessions: Session[];
  gymClasses: GymClass[];
  getItemsForDay: <T>(
    day: Date,
    items: T[],
    getDate: (item: T) => string | Date,
  ) => T[];
  onSessionClick: (session: Session) => void;
  onClassClick?: (gymClass: GymClass) => void;
}

export const WeeklyGrid = ({
  weekDays,
  sessions,
  gymClasses,
  getItemsForDay,
  onSessionClick,
  onClassClick,
}: WeeklyGridProps) => {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:overflow-x-auto">
        {weekDays.map((day) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            sessions={getItemsForDay(day, sessions, (s) => s.startTime)}
            gymClasses={getItemsForDay(day, gymClasses, (c) => c.scheduledAt)}
            onSessionClick={onSessionClick}
            onClassClick={onClassClick}
          />
        ))}
      </div>
    </div>
  );
};
