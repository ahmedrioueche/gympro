import { format, parseISO } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { SessionClientInfo } from "./SessionClientInfo";
import { SessionStatusSelector } from "./SessionStatusSelector";
import { useSessionDetails } from "./useSessionDetails";

export const SessionDetailsModal = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    session,
    notes,
    setNotes,
    currentStatus,
    handleStatusChange,
    handleSaveNotes,
    handleDelete,
    closeModal,
    isUpdating,
  } = useSessionDetails();

  if (!isOpen || !session) return null;

  const startTime =
    typeof session.startTime === "string"
      ? parseISO(session.startTime)
      : session.startTime;
  const endTime =
    typeof session.endTime === "string"
      ? parseISO(session.endTime)
      : session.endTime;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("schedule.sessionDetails")}
      subtitle={format(startTime, "EEEE, MMMM d, yyyy")}
      icon={Calendar}
      primaryButton={{
        label: t("common.save"),
        onClick: handleSaveNotes,
        loading: isUpdating,
      }}
    >
      <div className="space-y-6">
        {/* Time */}
        <div className="bg-surface-secondary rounded-xl p-4">
          <p className="text-sm text-text-secondary mb-1">
            {t("schedule.form.time")}
          </p>
          <p className="text-lg font-semibold text-text-primary">
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </p>
        </div>

        {/* Client Info */}
        <SessionClientInfo member={session.member} type={session.type} />

        {/* Status */}
        <SessionStatusSelector
          currentStatus={currentStatus}
          onStatusChange={handleStatusChange}
        />

        {/* Location */}
        {session.location && (
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {t("schedule.form.location")}
            </p>
            <p className="text-text-primary">{session.location}</p>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("schedule.form.notes")}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
          />
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-xl text-red-500 bg-red-500/10 hover:bg-red-500/20 font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t("schedule.deleteSession")}
        </button>
      </div>
    </BaseModal>
  );
};

export default SessionDetailsModal;
