import { SessionStatus } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";

interface SessionStatusSelectorProps {
  currentStatus?: SessionStatus;
  onStatusChange: (status: SessionStatus) => void;
}

export const SessionStatusSelector = ({
  currentStatus,
  onStatusChange,
}: SessionStatusSelectorProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2.5">
      {Object.values(SessionStatus).map((status) => (
        <button
          key={status}
          onClick={() => onStatusChange(status)}
          className={`px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
            currentStatus === status
              ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20 scale-105"
              : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/10"
          }`}
        >
          {t(`schedule.status.${status}`)}
        </button>
      ))}
    </div>
  );
};
