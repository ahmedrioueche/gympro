import { addDays, endOfWeek, isSameDay, parseISO, startOfWeek } from "date-fns";
import { useState } from "react";
import { useDateFormat } from "../../../../../../hooks/useDateFormat";

export interface UseScheduleReturn {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  weekDays: Date[];
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToToday: () => void;
  getItemsForDay: <T>(
    day: Date,
    items: T[],
    getDate: (item: T) => string | Date,
  ) => T[];
  formatDateHeader: () => string;
}

export const useSchedule = (): UseScheduleReturn => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { format } = useDateFormat();

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

  const getItemsForDay = <T>(
    day: Date,
    items: T[],
    getDate: (item: T) => string | Date,
  ): T[] => {
    if (!items) return [];
    return items.filter((item) => {
      const date = getDate(item);
      const itemDate = typeof date === "string" ? parseISO(date) : date;
      return isSameDay(itemDate, day);
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
    getItemsForDay,
    formatDateHeader,
  };
};
