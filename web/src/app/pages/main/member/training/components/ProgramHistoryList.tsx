import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { ChevronRight, History } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionList } from "./SessionList";

interface ProgramHistoryListProps {
  history: ProgramHistory[];
}

export const ProgramHistoryList = ({ history }: ProgramHistoryListProps) => {
  const { t } = useTranslation();

  if (!history?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
        <History size={20} />
        {t("training.history.title")}
      </h3>
      <div className="space-y-4">
        {history.map((h) => (
          <HistoryItem key={h._id} item={h} />
        ))}
      </div>
    </div>
  );
};

const HistoryItem = ({ item }: { item: ProgramHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { program, progress, status } = item;
  const { t } = useTranslation();

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex justify-between items-center bg-card hover:bg-background-secondary transition-colors"
      >
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-text-primary">{program.name}</h4>
            <span
              className={`px-2 py-0.5 text-xs rounded-full border capitalize ${
                status === "completed"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : status === "active"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-gray-500/10 text-gray-500 border-gray-500/20"
              }`}
            >
              {t(`training.history.status.${status}`)}
            </span>
          </div>
          <span className="text- text-text-secondary">
            {formatDate(progress.startDate)} - {formatDate(progress.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-medium text-text-primary block">
              {t("training.history.sessions", {
                count: progress.daysCompleted,
              })}
            </span>
          </div>
          <ChevronRight
            size={20}
            className={`text-text-secondary transition-transform duration-300 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded Content: Session List */}
      <div
        className={`bg-background-tertiary transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 border-t border-border">
          <SessionList sessions={progress.dayLogs} program={program} />
        </div>
      </div>
    </div>
  );
};
