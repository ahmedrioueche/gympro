import { SessionStatus } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Calendar, Clock, MapPin, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import TextArea from "../../../../components/ui/TextArea";
import { MinimalCoachCard } from "../../ui/MinimalCoachCard";
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
    isMemberView,
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

  const isCancelled = currentStatus === SessionStatus.CANCELLED;
  const isFuture = startTime > new Date();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("schedule.sessionDetails")}
      subtitle={currentStatus ? t(`schedule.status.${currentStatus}`) : ""}
      icon={Calendar}
      primaryButton={
        !isMemberView
          ? {
              label: t("common.save"),
              onClick: handleSaveNotes,
              loading: isUpdating,
            }
          : undefined
      }
      tertiaryButton={{
        label: isMemberView
          ? isCancelled && isFuture
            ? t("schedule.willAttend", "I will attend")
            : t("schedule.notAttending", "I won't attend")
          : t("schedule.deleteSession"),
        onClick: isMemberView
          ? () =>
              handleStatusChange(
                isCancelled ? SessionStatus.SCHEDULED : SessionStatus.CANCELLED,
              )
          : handleDelete,
        variant: isMemberView && isCancelled ? "primary" : "danger",
        disabled: isMemberView && !isFuture, // Disable all actions for members if session is in the past
      }}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Date and Time Header */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                {t("common.date", "Date")}
              </p>
              <p className="text-sm font-semibold text-white">
                {format(startTime, "EEEE, MMM d")}
              </p>
            </div>
          </div>

          <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                {t("schedule.form.time")}
              </p>
              <p className="text-sm font-semibold text-white">
                {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
              </p>
            </div>
          </div>
        </div>

        {/* Participant Info Section */}
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
            {isMemberView ? t("common.coach") : t("common.member")}
          </label>
          {isMemberView ? (
            session.coach ? (
              <MinimalCoachCard coach={session.coach} />
            ) : (
              <div className="p-4 bg-white/5 rounded-2xl text-white/40 text-sm">
                {t("common.notAssigned")}
              </div>
            )
          ) : (
            <SessionClientInfo member={session.member} type={session.type} />
          )}
        </div>

        {/* Status Selector Section (Coach Only) */}
        {!isMemberView && (
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
              {t("common.status", "Session Status")}
            </label>
            <SessionStatusSelector
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}

        {/* Location Section */}
        {session.location && (
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
              {t("schedule.form.location")}
            </label>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <MapPin className="w-4 h-4 text-white/40" />
              <p className="text-sm text-white/80">{session.location}</p>
            </div>
          </div>
        )}

        {/* Equipment Section */}
        {session.equipment && session.equipment.length > 0 && (
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
              {t("classes.details.equipment", "Required Equipment")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {session.equipment.map((item: any, idx: number) => {
                const equipment = item.itemId;
                const name =
                  typeof equipment === "object"
                    ? equipment.name
                    : t("inventory.item", "Equipment Item");
                const category =
                  typeof equipment === "object" ? equipment.category : null;

                return (
                  <div
                    key={
                      typeof equipment === "object"
                        ? equipment._id
                        : equipment + idx
                    }
                    className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {item.quantity}x {name}
                      </p>
                      {category && (
                        <p className="text-[10px] text-white/40 uppercase tracking-wider">
                          {t(`inventory.categories.${category}`)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes Section (Coach Can Edit, Member Can View if provided) */}
        <div className="space-y-3">
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
            {t("schedule.form.notes")}
          </label>
          {isMemberView ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white/60 text-sm min-h-[100px] whitespace-pre-wrap">
              {session.notes ||
                t("common.noNotes", "No notes provided for this session.")}
            </div>
          ) : (
            <div className="relative group">
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("schedule.form.notesPlaceholder")}
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default SessionDetailsModal;
