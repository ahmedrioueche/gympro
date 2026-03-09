import type { GymClass, Session } from "@ahmedrioueche/gympro-client";
import { isToday } from "date-fns";
import { useDateFormat } from "../../../hooks/useDateFormat";
import { ClassScheduleCard } from "./ClassScheduleCard";
import { SessionCard } from "./SessionCard";

interface DayColumnProps {
  day: Date;
  sessions: Session[];
  gymClasses: GymClass[];
  onSessionClick: (session: Session) => void;
  onClassClick?: (gymClass: GymClass) => void;
}

export const DayColumn = ({
  day,
  sessions,
  gymClasses,
  onSessionClick,
  onClassClick,
}: DayColumnProps) => {
  const { format } = useDateFormat();
  const isCurrentDay = isToday(day);
  const hasItems = gymClasses.length > 0 || sessions.length > 0;

  return (
    <div
      className={`md:min-w-[140px] md:flex-1 border-b md:border-b-0 md:border-e border-border last:border-0 ${
        isCurrentDay ? "bg-primary/5" : ""
      }`}
    >
      {/* Day Header — horizontal on mobile, centered on desktop */}
      <div
        className={`px-3 py-2 md:p-3 md:text-center border-b border-border flex items-center gap-2 md:block ${
          isCurrentDay ? "bg-primary/10" : "bg-surface-secondary"
        }`}
      >
        <p className="text-[10px] md:text-xs text-text-secondary uppercase tracking-wide">
          {format(day, "EEE")}
        </p>
        <p
          className={`text-sm md:text-lg font-semibold ${
            isCurrentDay ? "text-primary" : "text-text-primary"
          }`}
        >
          {format(day, "d")}
        </p>
        {!hasItems && (
          <span className="text-[10px] text-text-secondary/50 ms-auto md:hidden">
            —
          </span>
        )}
      </div>

      {/* Items — no min-height on mobile so empty days collapse */}
      <div
        className={`p-1.5 md:p-2 md:min-h-[400px] space-y-1.5 md:space-y-2 ${
          !hasItems ? "hidden md:block" : ""
        }`}
      >
        {gymClasses.map((gymClass) => (
          <ClassScheduleCard
            key={gymClass._id}
            gymClass={gymClass}
            onClick={() => onClassClick?.(gymClass)}
          />
        ))}
        {sessions.map((session) => (
          <SessionCard
            key={session._id}
            session={session}
            onClick={() => onSessionClick(session)}
            compact
          />
        ))}
      </div>
    </div>
  );
};
