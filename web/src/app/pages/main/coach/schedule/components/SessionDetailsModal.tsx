import { SessionStatus } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Calendar, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../../components/ui/BaseModal";
import {
  useDeleteSession,
  useUpdateSession,
} from "../../../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../../../store/modal";
import {
  getMessage,
  showStatusToast,
} from "../../../../../../utils/statusMessage";

export const SessionDetailsModal = () => {
  const { t } = useTranslation();
  const { currentModal, sessionDetailsProps, closeModal, openModal } =
    useModalStore();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const isOpen = currentModal === "session_details";
  const session = sessionDetailsProps?.session;

  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (session) {
      setNotes(session.notes || "");
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const startTime =
    typeof session.startTime === "string"
      ? parseISO(session.startTime)
      : session.startTime;
  const endTime =
    typeof session.endTime === "string"
      ? parseISO(session.endTime)
      : session.endTime;

  const handleStatusChange = async (status: SessionStatus) => {
    const response = await updateSession.mutateAsync({
      id: session._id,
      data: { status },
    });
    const message = getMessage({ success: !!response, data: response }, t);
    showStatusToast(message, toast);
  };

  const handleSaveNotes = async () => {
    const response = await updateSession.mutateAsync({
      id: session._id,
      data: { notes },
    });
    const message = getMessage({ success: !!response, data: response }, t);
    showStatusToast(message, toast);
  };

  const handleDelete = () => {
    openModal("confirm", {
      title: t("schedule.deleteSession"),
      text: t("schedule.deleteSessionConfirm"),
      confirmText: t("common.delete"),
      onConfirm: async () => {
        await deleteSession.mutateAsync(session._id);
        closeModal();
        toast.success(t("schedule.sessionDeleted"));
      },
    });
  };

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
        loading: updateSession.isPending,
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
        {session.member && (
          <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-xl">
            {session.member.profileImageUrl ? (
              <img
                src={session.member.profileImageUrl}
                alt={session.member.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">
                  {(session.member.fullName ||
                    session.member.username)?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-text-primary">
                {session.member.fullName || session.member.username}
              </p>
              <p className="text-sm text-text-secondary capitalize">
                {session.type?.replace("_", " ")}
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t("common.status")}
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.values(SessionStatus).map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  session.status === status
                    ? "bg-primary text-white"
                    : "bg-surface-secondary text-text-secondary hover:bg-surface-hover"
                }`}
              >
                {t(`schedule.status.${status}`)}
              </button>
            ))}
          </div>
        </div>

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
