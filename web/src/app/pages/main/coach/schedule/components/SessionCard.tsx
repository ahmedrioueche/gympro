import type { Session, SessionStatus } from "@ahmedrioueche/gympro-client";
import { format, parseISO } from "date-fns";
import { Clock, User } from "lucide-react";

interface SessionCardProps {
  session: Session;
  onClick: () => void;
}

const statusColors: Record<SessionStatus, string> = {
  scheduled: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  completed: "bg-green-500/20 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
  no_show: "bg-orange-500/20 text-orange-500 border-orange-500/30",
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
};

export const SessionCard = ({ session, onClick }: SessionCardProps) => {
  const startTime =
    typeof session?.startTime === "string"
      ? parseISO(session?.startTime)
      : session?.startTime;
  const endTime =
    typeof session?.endTime === "string"
      ? parseISO(session?.endTime)
      : session?.endTime;

  const statusColor = statusColors[session?.status] || statusColors.scheduled;

  console.log({ session });

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${statusColor}`}
    >
      <div className="flex items-center gap-1.5 text-xs mb-2">
        <Clock className="w-3 h-3" />
        <span className="font-medium">
          {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
        </span>
      </div>

      {session?.member && (
        <div className="flex items-center gap-2">
          {session?.member?.profileImageUrl ? (
            <img
              src={session?.member?.profileImageUrl}
              alt={session?.member?.fullName}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-surface flex items-center justify-center">
              <User className="w-3 h-3 text-text-secondary" />
            </div>
          )}
          <span className="text-sm font-medium truncate">
            {session?.member.fullName || session?.member.username}
          </span>
        </div>
      )}

      {session?.type && (
        <span className="text-xs opacity-80 mt-1 block capitalize">
          {session?.type.replace("_", " ")}
        </span>
      )}
    </div>
  );
};
