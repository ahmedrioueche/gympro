import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CalendarHeaderProps {
  dateHeader: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

export const CalendarHeader = ({
  dateHeader,
  onPrevWeek,
  onNextWeek,
  onToday,
}: CalendarHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-2 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </div>
        <h2 className="text-xl font-semibold text-text-primary">
          {dateHeader}
        </h2>
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
        >
          {t("schedule.today")}
        </button>
      </div>
    </div>
  );
};
