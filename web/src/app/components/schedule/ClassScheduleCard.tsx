import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Clock, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClassScheduleCardProps {
  gymClass: GymClass;
  onClick?: () => void;
}

export const ClassScheduleCard = ({
  gymClass,
  onClick,
}: ClassScheduleCardProps) => {
  const { t } = useTranslation();
  const time =
    typeof gymClass.scheduledAt === "string"
      ? parseISO(gymClass.scheduledAt)
      : gymClass.scheduledAt;

  const isFull = gymClass.bookings.length >= gymClass.maxCapacity;

  let statusStyles = "";
  if (gymClass.status === "cancelled") {
    statusStyles =
      "bg-red-500/10 text-red-400 border-red-500/20 line-through opacity-75";
  } else if (time < new Date()) {
    statusStyles =
      "bg-white/5 text-white/50 border-white/10 opacity-75 grayscale";
  } else {
    // Default active style
    statusStyles =
      "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:shadow-md";
  }

  return (
    <div
      onClick={onClick}
      className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all ${statusStyles}`}
    >
      <div className="flex items-center gap-1.5 text-xs mb-2">
        <Clock className="w-3 h-3" />
        <span className="font-medium">{format(time, "HH:mm")}</span>
        {gymClass.status === "cancelled" && (
          <>
            <span className="mx-1 opacity-50">•</span>
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {t("common.cancelled")}
            </span>
          </>
        )}
      </div>

      <div className="font-medium text-sm truncate mb-2 text-white/90">
        {gymClass.name}
      </div>

      <div
        className={`flex items-center gap-1.5 text-xs ${
          gymClass.status === "cancelled" ? "opacity-50" : "opacity-80"
        }`}
      >
        <Users className="w-3 h-3" />
        <span
          className={
            isFull && gymClass.status !== "cancelled"
              ? "text-red-400 font-semibold"
              : ""
          }
        >
          {gymClass.bookings.length} / {gymClass.maxCapacity}
        </span>
      </div>
    </div>
  );
};
