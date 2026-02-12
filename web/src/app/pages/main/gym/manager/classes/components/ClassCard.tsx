import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../../store/modal";
import { cn } from "../../../../../../../utils/helper";

interface ClassCardProps {
  gymClass: GymClass;
  onEdit: (gymClass: GymClass) => void;
  onDelete: (gymClass: GymClass) => void;
}

export default function ClassCard({
  gymClass,
  onEdit,
  onDelete,
}: ClassCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const isFull = gymClass.bookings.length >= gymClass.maxCapacity;
  const bookingCount = gymClass.bookings.length;

  return (
    <div
      onClick={() => openModal("class_details", { gymClass })}
      className="bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-all group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1 text-left">
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
            {gymClass.name}
          </h3>
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <UserIcon className="w-4 h-4" />
            <span>
              {(gymClass as any).coachId?.fullName ||
                (gymClass as any).coachId?.profile?.fullName ||
                t("common.unassigned", "Unassigned")}
            </span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(gymClass);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
            title={t("common.edit")}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(gymClass);
            }}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
            title={t("common.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
            <Users className="w-3 h-3" />
            <span>{t("classes.capacity", "Capacity")}</span>
          </div>
          <div className="flex items-end gap-2">
            <span
              className={cn(
                "text-lg font-bold",
                isFull ? "text-red-400" : "text-white",
              )}
            >
              {bookingCount}
            </span>
            <span className="text-white/40 text-xs pb-1">
              / {gymClass.maxCapacity}
            </span>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>{t("classes.time", "Time")}</span>
          </div>
          <div className="text-sm font-semibold text-white">
            {format(new Date(gymClass.scheduledAt), "HH:mm")}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-2 text-white/50 text-xs py-1 px-2 bg-white/5 rounded-lg border border-white/5">
          <Calendar className="w-3 h-3 text-primary" />
          <span>{format(new Date(gymClass.scheduledAt), "EEEE, MMM d")}</span>
        </div>
        {gymClass.recurrence && gymClass.recurrence.type !== "none" && (
          <div className="flex items-center gap-2 text-primary/80 text-[10px] font-bold uppercase tracking-wider py-1 px-2 bg-primary/10 rounded-lg border border-primary/20">
            {t(
              `classes.form.recurrence.${gymClass.recurrence.type}`,
              gymClass.recurrence.type,
            )}
          </div>
        )}
      </div>

      {isFull && (
        <div className="mt-4 py-1.5 px-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <span className="text-red-400 text-xs font-medium uppercase tracking-wider">
            {t("classes.fullyBooked", "Fully Booked")}
          </span>
        </div>
      )}
    </div>
  );
}
