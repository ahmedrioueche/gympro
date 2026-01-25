import type { Session } from "@ahmedrioueche/gympro-client";
import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { useState } from "react";

export interface UseScheduleReturn {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  weekDays: Date[];
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToToday: () => void;
  getSessionsForDay: (day: Date, sessions: Session[]) => Session[];
  formatDateHeader: () => string;
}

export const useSchedule = (): UseScheduleReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const goToNextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 7));
  };

  const goToPrevWeek = () => {
    setCurrentDate((prev) => addDays(prev, -7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getSessionsForDay = (day: Date, sessions: Session[]): Session[] => {
    if (!sessions) return [];
    return sessions.filter((session) => {
      const sessionDate =
        typeof session.startTime === "string"
          ? parseISO(session.startTime)
          : session.startTime;
      return isSameDay(sessionDate, day);
    });
  };

  const formatDateHeader = () => {
    return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  };

  return {
    currentDate,
    weekStart,
    weekEnd,
    weekDays,
    goToNextWeek,
    goToPrevWeek,
    goToToday,
    getSessionsForDay,
    formatDateHeader,
  };
};
