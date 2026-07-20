import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SessionList } from "./session-list/SessionList";

interface ProgramHistoryListProps {
  history: ProgramHistory[];
  onRestart: (programId: string) => void;
  isRestarting?: boolean;
}

export const ProgramHistoryList = ({
  history,
  onRestart,
  isRestarting,
}: ProgramHistoryListProps) => {
  const { t } = useTranslation();

  if (!history?.length) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {history.map((h) => (
          <HistoryItem
            key={h._id}
            item={h}
            onRestart={onRestart}
            isRestarting={isRestarting}
          />
        ))}
      </div>
    </div>
  );
};

const HistoryItem = ({
  item,
  onRestart,
  isRestarting,
}: {
  item: ProgramHistory;
  onRestart: (id: string) => void;
  isRestarting?: boolean;
}) => {
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

  const handleRestartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestart(item._id!);
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
      <div
        className="w-full flex justify-between items-center hover:bg-background-secondary transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-4 flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-text-primary">{program.name}</h4>
            <span
              className={`px-2 py-0.5 text-xs rounded-full border capitalize ${
                status === "completed"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : status === "active"
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : status === "paused"
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
              }`}
            >
              {t(`training.history.status.${status}`)}
            </span>
          </div>
          <span className="text-sm text-text-secondary">
            {formatDate(progress.startDate)} - {formatDate(progress.endDate)}
          </span>
        </div>

        <div className="p-4 flex items-center gap-4">
          {/* Restart Button */}
          <button
            onClick={handleRestartClick}
            disabled={isRestarting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
            title={t("common.restart", "Restart")}
          >
            <Play size={14} fill="currentColor" />
            <span className="hidden sm:inline">
              {t("common.restart", "Restart")}
            </span>
          </button>

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
      </div>

      {/* Expanded Content: Session List */}
      <div
        className={`bg-background-secondary transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[70vh] opacity-100 overflow-y-auto"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 border-t border-border">
          <SessionList sessions={progress.dayLogs} program={program} />
        </div>
      </div>
    </div>
  );
};
