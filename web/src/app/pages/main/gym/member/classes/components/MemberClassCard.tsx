import { type GymClass } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../../utils/helper";

interface MemberClassCardProps {
  gymClass: GymClass;
  userId?: string;
  isBooked: boolean;
  isFull: boolean;
  onBook: (classId: string) => void;
  onCancel: (classId: string) => void;
  isLoading: boolean;
}

export const MemberClassCard = ({
  gymClass,
  userId,
  isBooked,
  isFull,
  onBook,
  onCancel,
  isLoading,
}: MemberClassCardProps) => {
  const { t } = useTranslation();
  const scheduledDate =
    typeof gymClass.scheduledAt === "string"
      ? parseISO(gymClass.scheduledAt)
      : gymClass.scheduledAt;

  return (
    <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
            {gymClass.name}
          </h3>
          <p className="text-white/50 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {format(scheduledDate, "HH:mm")}
          </p>
        </div>
        {isBooked && (
          <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">
            {t("classes.booked")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex-1 text-center">
          <p className="text-white/40 text-[10px] uppercase mb-1">
            {t("classes.spots")}
          </p>
          <p
            className={cn(
              "text-lg font-bold",
              isFull && !isBooked ? "text-red-400" : "text-white",
            )}
          >
            {gymClass.bookings.length} / {gymClass.maxCapacity}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white/50 text-xs mb-6">
        <Calendar className="w-3 h-3" />
        <span>{format(scheduledDate, "EEEE, MMM d")}</span>
      </div>

      {isBooked ? (
        <button
          onClick={() => onCancel(gymClass._id)}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? t("common.processing") : t("classes.cancelBtn")}
        </button>
      ) : (
        <button
          onClick={() => onBook(gymClass._id)}
          disabled={isFull || isLoading}
          className={cn(
            "w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
            isFull
              ? "bg-white/5 text-white/30 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]",
          )}
        >
          {isLoading
            ? t("common.processing")
            : isFull
              ? t("classes.full")
              : t("classes.bookBtn")}
        </button>
      )}
    </div>
  );
};
