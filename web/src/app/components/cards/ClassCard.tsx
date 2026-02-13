import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Clock,
  Edit2,
  RotateCcw,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../store/modal";
import { capitalize, cn } from "../../../utils/helper";

interface ClassCardProps {
  gymClass: GymClass;
  onEdit?: (gymClass: GymClass) => void;
  onDelete?: (gymClass: GymClass) => void;
  onRestore?: (gymClass: GymClass) => void;
  onBook?: (id: string) => void;
  onCancel?: (id: string) => void;
  onClick?: (gymClass: GymClass) => void;
  isBooked?: boolean;
  isLoading?: boolean;
  isCoachView?: boolean;
}

export default function ClassCard({
  gymClass,
  onEdit,
  onDelete,
  onRestore,
  onBook,
  onCancel,
  onClick,
  isBooked,
  isLoading,
  isCoachView = false,
}: ClassCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const isCancelled = gymClass.status === "cancelled";

  const scheduledDate =
    typeof gymClass.scheduledAt === "string"
      ? parseISO(gymClass.scheduledAt)
      : gymClass.scheduledAt;

  const isFull = (gymClass.bookings?.length || 0) >= gymClass.maxCapacity;
  const isPassed = scheduledDate < new Date();
  const bookingCount = gymClass.bookings?.length || 0;

  const handleCardClick = () => {
    if (onClick) {
      onClick(gymClass);
    } else {
      openModal("class_details", {
        gymClass,
        onBook: !isBooked ? onBook : undefined,
        onCancel: isBooked ? onCancel : undefined,
        onCancelClass: onDelete ? () => onDelete(gymClass) : undefined,
        onRestoreClass: onRestore ? () => onRestore(gymClass) : undefined,
        isBooking: isLoading,
        isPassed,
      });
    }
  };

  const coachName =
    (gymClass as any).coachId?.fullName ||
    (gymClass as any).coachId?.profile?.fullName ||
    t("common.unassigned");

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative bg-surface backdrop-blur-xl border border-white/5 hover:border-primary/30 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full",
        isCancelled &&
          "opacity-80 grayscale-[0.3] bg-red-500/5 border-red-500/20",
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

      <div className="relative flex flex-col gap-5 h-full">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h3
              className={cn(
                "text-lg font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2",
                isCancelled && "line-through opacity-70",
              )}
            >
              <span className="truncate">{gymClass.name}</span>
              {gymClass.isSeries && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] text-white/40 uppercase tracking-widest border border-white/5 shrink-0">
                  {t("common.series")}
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-white/5 border border-white/5 uppercase tracking-wider">
                {capitalize(gymClass.service || "")}
              </span>
              <div className="flex items-center gap-1.5 text-white/30 text-xs truncate">
                <UserIcon className="w-3.5 h-3.5" />
                <span className="truncate">{coachName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCancelled && (
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                {t("common.cancelled")}
              </span>
            )}
            {isBooked && !isCancelled && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                {t("classes.booked")}
              </span>
            )}

            {!isCoachView && (
              <div className="flex gap-2">
                {isCancelled ? (
                  <>
                    {onRestore && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestore(gymClass);
                        }}
                        className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-all outline-none border border-green-500/20"
                        title={t("common.restore")}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(gymClass);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all outline-none border border-red-500/20"
                        title={t("common.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(gymClass);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all outline-none border border-white/5"
                        title={t("common.edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(gymClass);
                        }}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all outline-none"
                        title={t("common.delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>{t("classes.spots", "Spots")}</span>
            </div>
            <div className="flex items-end gap-1.5 mt-1">
              <span
                className={cn(
                  "text-lg font-bold",
                  isFull ? "text-red-400" : "text-white",
                )}
              >
                {bookingCount}
              </span>
              <span className="text-white/30 text-xs font-medium mb-1">
                / {gymClass.maxCapacity}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{t("common.time", "Time")}</span>
            </div>
            <div className="mt-1">
              <span className="text-lg font-bold text-white">
                {format(scheduledDate, "HH:mm")}
              </span>
              <span className="text-white/30 text-[10px] font-medium ml-2 uppercase tracking-tight">
                {gymClass.duration} min
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40 group-hover:text-primary transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {format(scheduledDate, "EEEE, MMM d")}
            </span>
          </div>
          {gymClass.recurrence && gymClass.recurrence.type !== "none" && (
            <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
              {t(
                `classes.form.recurrence.${gymClass.recurrence.type}`,
                capitalize(gymClass.recurrence.type),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
