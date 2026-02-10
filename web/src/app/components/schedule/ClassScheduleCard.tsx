import type { GymClass } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Clock, Users } from "lucide-react";

interface ClassScheduleCardProps {
  gymClass: GymClass;
  onClick?: () => void;
}

export const ClassScheduleCard = ({
  gymClass,
  onClick,
}: ClassScheduleCardProps) => {
  const time =
    typeof gymClass.scheduledAt === "string"
      ? parseISO(gymClass.scheduledAt)
      : gymClass.scheduledAt;

  const isFull = gymClass.bookings.length >= gymClass.maxCapacity;

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md bg-purple-500/20 text-purple-400 border-purple-500/30`}
    >
      <div className="flex items-center gap-1.5 text-xs mb-2">
        <Clock className="w-3 h-3" />
        <span className="font-medium">{format(time, "HH:mm")}</span>
        <span className="mx-1 opacity-50">•</span>
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Class
        </span>
      </div>

      <div className="font-medium text-sm truncate mb-2 text-white">
        {gymClass.name}
      </div>

      <div className="flex items-center gap-1.5 text-xs opacity-80">
        <Users className="w-3 h-3" />
        <span className={isFull ? "text-red-400 font-semibold" : ""}>
          {gymClass.bookings.length} / {gymClass.maxCapacity}
        </span>
      </div>
    </div>
  );
};
