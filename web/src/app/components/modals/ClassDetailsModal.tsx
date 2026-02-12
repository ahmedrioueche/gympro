import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import { Calendar, Clock, Info, User, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal";
import { capitalize, cn } from "../../../utils/helper";

export default function ClassDetailsModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, classDetailsProps, openModal } =
    useModalStore();
  const {
    gymClass,
    onBook,
    onCancel,
    isBooking,
    onCancelClass,
    isPassed: passedProp,
  } = (classDetailsProps as {
    gymClass: GymClass;
    onBook?: (id: string) => void;
    onCancel?: (id: string) => void;
    onCancelClass?: (id: string, deleteSeries?: boolean) => void;
    isBooking?: boolean;
    isPassed?: boolean;
  }) || {};

  const isOpen = currentModal === "class_details";

  if (!gymClass) return null;

  const coachData = gymClass.coachId as any;
  const coach = coachData?.profile || coachData;
  const coachName = coach?.fullName || coach?.username;
  const coachImage = coach?.profileImageUrl || coach?.picture;

  const isFull = (gymClass.bookings?.length || 0) >= gymClass.maxCapacity;

  const scheduledDate = new Date(gymClass.scheduledAt);
  const isPassed = passedProp ?? scheduledDate < new Date();

  const coachId =
    coachData?._id || (typeof coachData === "string" ? coachData : null);
  const canViewCoachProfile = !!coachId;

  const handleCoachClick = () => {
    if (canViewCoachProfile) {
      openModal("coach_profile", { coachId });
    }
  };

  const handleCancelClick = () => {
    if (!onCancel) return;
    openModal("confirm", {
      title: t("classes.cancelTitle", "Cancel Booking"),
      text: t(
        "classes.confirmCancelText",
        "Are you sure you want to cancel your booking for this class?",
      ),
      onConfirm: () => {
        onCancel(gymClass._id);
        closeModal();
      },
      confirmVariant: "danger",
      confirmText: t("classes.cancelBtn", "Cancel Booking"),
    });
  };

  const handleEditClick = () => {
    if (!gymClass) return;
    openModal("gym_class", { gymId: gymClass.gymId, gymClass });
  };

  const handleCancelClassClick = () => {
    if (!onCancelClass) return;
    onCancelClass(gymClass._id);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={gymClass.name}
      subtitle={capitalize(gymClass.service || "")}
      icon={Info}
      maxWidth="max-w-lg"
      primaryButton={
        onBook || onCancel || onCancelClass
          ? {
              label: onCancelClass
                ? t("classes.cancelClassBtn", "Cancel Class")
                : onCancel
                  ? t("classes.cancelBtn")
                  : isPassed
                    ? t("classes.passed", "Passed")
                    : isFull
                      ? t("classes.full")
                      : t("classes.bookBtn"),
              onClick: () => {
                if (onCancelClass) handleCancelClassClick();
                else if (onCancel) handleCancelClick();
                else if (onBook) {
                  onBook(gymClass._id);
                  closeModal();
                }
              },
              disabled:
                (!onCancel && !onCancelClass && (isFull || isPassed)) ||
                isBooking,
              loading: isBooking,
              variant: onCancel || onCancelClass ? "danger" : "primary",
            }
          : undefined
      }
      secondaryButton={
        onCancelClass
          ? {
              label: t("common.edit"),
              onClick: handleEditClick,
              variant: "default",
            }
          : {
              label: t("common.close"),
              onClick: closeModal,
            }
      }
    >
      <div className="space-y-6">
        {/* Class Status Badges */}
        {(onCancel || isFull || isPassed) && (
          <div className="flex flex-wrap gap-2 -mb-2">
            {onCancel && (
              <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/30">
                {t("classes.booked", "Booked")}
              </span>
            )}
            {isFull && !onCancel && (
              <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/30">
                {t("classes.full", "Full Capacity")}
              </span>
            )}
            {isPassed && (
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider border border-white/10">
                {t("classes.passed", "Passed")}
              </span>
            )}
          </div>
        )}

        {/* Class Primary Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {t("common.date")}
              </span>
            </div>
            <p className="text-white font-medium">
              {format(new Date(gymClass.scheduledAt), "EEEE, MMM d")}
            </p>
          </div>

          <div className="bg-surface-secondary/30 p-4 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {t("common.time")}
              </span>
            </div>
            <p className="text-white font-medium">
              {format(new Date(gymClass.scheduledAt), "HH:mm")} (
              {gymClass.duration} min)
            </p>
          </div>
        </div>

        {/* Coach & Capacity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary/30 rounded-2xl border border-white/5">
            <div
              onClick={handleCoachClick}
              className={cn(
                "flex items-center gap-3",
                canViewCoachProfile &&
                  "cursor-pointer hover:opacity-80 transition-opacity",
              )}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                {coachImage ? (
                  <img
                    src={coachImage}
                    alt={coachName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <span className="text-xs text-text-secondary block">
                  {t("common.coach")}
                </span>
                <span className="text-white font-medium">
                  {coachName || t("common.notAssigned")}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 text-text-secondary justify-end">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs uppercase font-bold tracking-tighter">
                  {t("common.capacity")}
                </span>
              </div>
              <p
                className={cn(
                  "font-medium",
                  isFull ? "text-red-400" : "text-white",
                )}
              >
                {gymClass.bookings?.length || 0} / {gymClass.maxCapacity}
              </p>
            </div>
          </div>
        </div>

        {onBook && (
          <p className="text-[10px] text-text-secondary text-center uppercase tracking-widest opacity-60">
            {t("classes.bookingTip", "Subject to availability and gym rules")}
          </p>
        )}
      </div>
    </BaseModal>
  );
}
