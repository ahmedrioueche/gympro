import type { CoachClient } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Calendar, Dumbbell, MapPin, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../constants/navigation";
import { formatDate } from "../../../utils/date";

interface ClientCardProps {
  client: CoachClient;
  onAssignProgram?: () => void;
}

export function ClientCard({ client, onAssignProgram }: ClientCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = () => {
    navigate({
      to: `${APP_PAGES.public.member_profile.link}/${client.userId}`,
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-surface cursor-pointer border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group relative"
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {client.profileImageUrl ? (
            <img
              src={client.profileImageUrl}
              alt={client.fullName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(client.fullName || client.username)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {client.fullName || client.username}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            @{client.username}
          </p>
        </div>
      </div>

      {/* Info Stats */}
      <div className="space-y-2 mb-6">
        {client.location?.city && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">
              {[
                client.location.city,
                client.location.state,
                client.location.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}
        ,
        {client.currentProgram && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <User className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-text-primary truncate">
              {client.currentProgram.programName}
            </span>
          </div>
        )}
      </div>

      {/* Footer / Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary border-t border-border pt-4 mb-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{t("coach.clients.activeClients.joinedOn")}</span>
          </div>
          <span className="font-semibold text-text-primary">
            {client.joinedAt ? formatDate(client.joinedAt) : "-"}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Dumbbell className="w-3 h-3" />
            <span>{t("coach.clients.activeClients.lastWorkout")}</span>
          </div>
          <span className="font-semibold text-text-primary">
            {client.lastWorkoutDate
              ? formatDistanceToNow(new Date(client.lastWorkoutDate), {
                  addSuffix: true,
                })
              : "-"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 font-medium text-sm"
        >
          {t("coach.clients.activeClients.viewProfile")}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignProgram();
          }}
          className="px-4 py-2 bg-background border border-border text-text-secondary rounded-xl hover:border-primary hover:text-primary transition-all duration-300"
        >
          {t("coach.clients.activeClients.assignProgram")}
        </button>
      </div>
    </div>
  );
}
