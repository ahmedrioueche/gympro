import type { Session, SessionStatus } from "@ahmedrioueche/gympro-client";
import { parseISO } from "date-fns";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "../../../hooks/useDateFormat";

interface SessionCardProps {
  session: Session;
  onClick: () => void;
  compact?: boolean;
}

const statusConfig: Record<
  SessionStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  scheduled: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    label: "Scheduled",
  },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    label: "Cancelled",
  },
  no_show: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    label: "No Show",
  },
  pending: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    label: "Pending",
  },
};

const typeLabels: Record<string, string> = {
  one_on_one: "1-on-1",
  consultation: "Consultation",
  check_in: "Check-in",
  assessment: "Assessment",
};

export const SessionCard = ({
  session,
  onClick,
  compact = false,
}: SessionCardProps) => {
  const { t } = useTranslation();
  const { format } = useDateFormat();
  const startTime =
    typeof session?.startTime === "string"
      ? parseISO(session.startTime)
      : session?.startTime;
  const endTime =
    typeof session?.endTime === "string"
      ? parseISO(session.endTime)
      : session?.endTime;

  const status = statusConfig[session?.status] || statusConfig.scheduled;

  // Compact variant for calendar weekly grid
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-2 md:p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${status.bg} ${status.text} ${status.border}`}
      >
        <div className="flex items-center gap-1.5 text-xs mb-2">
          <Clock className="w-3 h-3" />
          <span className="font-medium">
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </span>
        </div>

        {session?.member && (
          <div className="flex items-center gap-2 mb-1">
            {session.member.profileImageUrl ? (
              <img
                src={session.member.profileImageUrl}
                alt={session.member.fullName}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/20"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-3 h-3 text-white/50" />
              </div>
            )}
            <span className="text-xs font-medium truncate text-white/90">
              {session.member.fullName || session.member.username}
            </span>
          </div>
        )}

        <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70">
          {t(
            `schedule.types.${session?.type}`,
            typeLabels[session?.type] || session?.type?.replace("_", " "),
          )}
        </span>
      </div>
    );
  }

  // Full card variant for list view — matches ClassCard style
  return (
    <div
      onClick={onClick}
      className="bg-surface backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-all group cursor-pointer"
    >
      {/* Header: Member info + Status badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {session?.member?.profileImageUrl ? (
            <img
              src={session.member.profileImageUrl}
              alt={session.member.fullName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-primary/30 transition-all"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/30 transition-all">
              <User className="w-5 h-5 text-white/40" />
            </div>
          )}
          <div className="text-start">
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors truncate max-w-[160px]">
              {session?.member?.fullName ||
                session?.member?.username ||
                t("common.unknown")}
            </h3>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <span className="capitalize">
                {t(
                  `schedule.types.${session?.type}`,
                  typeLabels[session?.type] ||
                    session?.type?.replace("_", " ") ||
                    "Session",
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}
        >
          {t(`schedule.status.${session?.status}`, status.label)}
        </div>
      </div>

      {/* Stats grid — matching ClassCard's 2-column layout */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>{t("schedule.form.time", "Time")}</span>
          </div>
          <div className="text-sm font-semibold text-white">
            {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
            <Clock className="w-3 h-3" />
            <span>{t("schedule.form.duration", "Duration")}</span>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-lg font-bold text-white">
              {session?.duration}
            </span>
            <span className="text-white/40 text-xs pb-1">min</span>
          </div>
        </div>
      </div>

      {/* Date + Location tags */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-white/50 text-xs py-1 px-2 bg-white/5 rounded-lg border border-white/5">
          <Calendar className="w-3 h-3 text-primary" />
          <span>{format(startTime, "EEEE, MMM d")}</span>
        </div>

        {session?.location && (
          <div className="flex items-center gap-2 text-white/50 text-xs py-1 px-2 bg-white/5 rounded-lg border border-white/5">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="truncate max-w-[120px]">{session.location}</span>
          </div>
        )}

        {session?.seriesId && (
          <div className="flex items-center gap-2 text-primary/80 text-[10px] font-bold uppercase tracking-wider py-1 px-2 bg-primary/10 rounded-lg border border-primary/20">
            {t("schedule.recurring", "Recurring")}
          </div>
        )}
      </div>

      {/* Notes preview */}
      {session?.notes && (
        <div className="mt-4 py-2 px-3 bg-white/5 border border-white/5 rounded-lg">
          <p className="text-white/40 text-xs truncate">{session.notes}</p>
        </div>
      )}
    </div>
  );
};
