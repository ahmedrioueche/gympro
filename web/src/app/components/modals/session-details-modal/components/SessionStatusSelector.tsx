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
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {t("common.status")}
      </label>
      <div className="flex flex-wrap gap-2">
        {Object.values(SessionStatus).map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStatus === status
                ? "bg-primary text-white"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {t(`schedule.status.${status}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
