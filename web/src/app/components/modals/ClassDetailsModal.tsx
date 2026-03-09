import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Edit,
  Info,
  Package,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useModalStore } from "../../../store/modal";
import { useUserStore } from "../../../store/user";
import { capitalize, cn } from "../../../utils/helper";
import { MinimalCoachCard } from "../ui/MinimalCoachCard";

export default function ClassDetailsModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, classDetailsProps, openModal } =
    useModalStore();
  const { activeDashboard } = useUserStore();
  const isMemberView = activeDashboard === "member";
  const {
    gymClass,
    onBook,
    onCancel,
    isBooking,
    onCancelClass,
    onRestoreClass,
    isPassed: passedProp,
  } = (classDetailsProps as {
    gymClass: GymClass;
    onBook?: (id: string) => void;
    onCancel?: (id: string) => void;
    onCancelClass?: (id: string, deleteSeries?: boolean) => void;
    onRestoreClass?: (id: string) => void;
    isBooking?: boolean;
    isPassed?: boolean;
  }) || {};

  const isOpen = currentModal === "class_details";

  if (!gymClass) return null;

  const coachData = gymClass.coachId as any;
  const coach = coachData?.profile || coachData;
  const coachName = coach?.fullName || coach?.username;

  const isFull = (gymClass.bookings?.length || 0) >= gymClass.maxCapacity;

  const scheduledDate = new Date(gymClass.scheduledAt);
  const isPassed = passedProp ?? scheduledDate < new Date();

  const coachId =
    coachData?._id || (typeof coachData === "string" ? coachData : null);

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

  const handleRestoreClick = () => {
    if (!onRestoreClass) return;
    onRestoreClass(gymClass._id);
  };

  const isCancelled = gymClass.status === "cancelled";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={gymClass.name}
      subtitle={capitalize(gymClass.service || "")}
      icon={Info}
      maxWidth="max-w-2xl"
      primaryButton={
        isCancelled && onRestoreClass
          ? {
              label: t("common.restore", "Restore"),
              onClick: handleRestoreClick,
              variant: "primary",
              icon: RefreshCw,
            }
          : onBook || onCancel || onCancelClass
            ? {
                label: onCancelClass
                  ? isCancelled
                    ? t("common.deletePermanently", "Delete permanently")
                    : t("classes.cancelClassBtn", "Cancel Class")
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
                icon: onCancelClass
                  ? isCancelled
                    ? Trash2
                    : X
                  : onCancel
                    ? X
                    : isPassed
                      ? undefined
                      : isFull
                        ? undefined
                        : Plus,
              }
            : undefined
      }
      secondaryButton={
        onCancelClass
          ? isCancelled
            ? onRestoreClass
              ? {
                  label: t("common.deletePermanently", "Delete permanently"),
                  onClick: handleCancelClassClick,
                  variant: "danger",
                  icon: Trash2,
                }
              : undefined
            : {
                label: t("common.edit"),
                onClick: handleEditClick,
                variant: "default",
                icon: Edit,
              }
          : undefined
      }
    >
      <div className="space-y-8">
        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2">
          {onCancel && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_-3px_rgba(34,197,94,0.2)] animate-in fade-in zoom-in duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                {t("classes.booked", "Reserved")}
              </span>
            </div>
          )}
          {isFull && !onCancel && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                {t("classes.full", "Class Full")}
              </span>
            </div>
          )}
          {isCancelled ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                {t("common.cancelled", "Cancelled")}
              </span>
            </div>
          ) : isPassed ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 opacity-60">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                {t("classes.passed", "Completed")}
              </span>
            </div>
          ) : null}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                {t("common.date")}
              </p>
              <p className="text-sm font-semibold text-white">
                {format(scheduledDate, "EEEE, MMM d")}
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                {t("common.time")}
              </p>
              <p className="text-sm font-semibold text-white">
                {format(scheduledDate, "HH:mm")}
              </p>
              <p className="text-[10px] text-white/30 font-medium">
                ({gymClass.duration} min)
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center text-center gap-2 group hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                {t("common.capacity")}
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isFull ? "text-red-400" : "text-white",
                )}
              >
                {gymClass.bookings?.length || 0} / {gymClass.maxCapacity}
              </p>
            </div>
          </div>
        </div>

        {/* Coach Section */}
        <div className="space-y-4">
          <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
            {t("common.instructor", "Instructor")}
          </label>
          <div className="relative group">
            {coachId ? (
              <MinimalCoachCard
                coach={{
                  _id: coachId,
                  fullName: coachName || "",
                  username: coach?.username || "",
                  profileImageUrl: coach?.profileImageUrl || coach?.picture,
                }}
              />
            ) : (
              <div className="p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-2 text-white/40 italic">
                <User className="w-8 h-8 opacity-20" />
                <p className="text-sm">{t("common.notAssigned")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Section */}
        {gymClass.equipment && gymClass.equipment.length > 0 && (
          <div className="space-y-4">
            <label className="text-[11px] uppercase tracking-widest font-bold text-white/30 ml-1">
              {t("classes.details.equipment", "Required Equipment")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {gymClass.equipment.map((item: any, idx: number) => {
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
                      <Package className="w-5 h-5 text-primary" />
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

        {/* Note / Tip */}
        {isMemberView && (
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16" />
            <div className="relative flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {t("classes.bookingTipTitle", "Why book this class?")}
                </p>
                <p className="text-xs text-white/60 leading-relaxed">
                  {t(
                    "classes.bookingTipDesc",
                    "Secure your spot and get notified of any updates. Group sessions are a great way to stay motivated!",
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {onBook && (
          <p className="text-[10px] text-white/20 text-center uppercase tracking-[0.2em] font-medium">
            {t("classes.bookingTip", "Subject to availability and gym rules")}
          </p>
        )}
      </div>
    </BaseModal>
  );
}
