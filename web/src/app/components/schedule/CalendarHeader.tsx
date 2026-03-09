import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../../store/language";
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
  const { isRtl } = useLanguageStore();

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-y-4 gap-x-6 mb-8 mt-2">
      {/* Date Information */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
          {t("extra.viewingRange", "Viewing Week")}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
          {dateHeader}
        </h2>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-1 p-1 bg-surface border border-border rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={onPrevWeek}
          aria-label={t("common.previous", "Previous")}
          className="p-2.5 rounded-lg hover:bg-primary/5 text-text-secondary hover:text-primary transition-all active:scale-90"
        >
          <PrevIcon size={20} className="stroke-[2.5]" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={onToday}
          className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-text-primary hover:bg-primary/5 hover:text-primary rounded-lg transition-all"
        >
          {t("schedule.today")}
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={onNextWeek}
          aria-label={t("common.next", "Next")}
          className="p-2.5 rounded-lg hover:bg-primary/5 text-text-secondary hover:text-primary transition-all active:scale-90"
        >
          <NextIcon size={20} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
