import type { CoachClient } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Calendar, Dumbbell, MapPin, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientCardProps {
  client: CoachClient;
}

export function ClientCard({ client }: ClientCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:border-border-hover transition-colors">
      {/* Client Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-xl">
          {client.fullName?.[0] || client.username[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary text-lg">
            {client.fullName || client.username}
          </h3>
          <p className="text-sm text-text-secondary">@{client.username}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="space-y-3">
        {client.location?.city && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4" />
            <span>
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

        {client.joinedAt && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>
              {t("coach.clients.activeClients.joinedOn")}:{" "}
              {formatDistanceToNow(new Date(client.joinedAt))} ago
            </span>
          </div>
        )}

        {client.lastWorkoutDate && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Dumbbell className="w-4 h-4" />
            <span>
              {t("coach.clients.activeClients.lastWorkout")}:{" "}
              {formatDistanceToNow(new Date(client.lastWorkoutDate))} ago
            </span>
          </div>
        )}

        {client.currentProgram && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <User className="w-4 h-4" />
            <span>
              {t("coach.clients.activeClients.currentProgram")}:{" "}
              {client.currentProgram.programName}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
        <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium">
          {t("coach.clients.activeClients.viewProfile")}
        </button>
        <button className="px-4 py-2 bg-surface-dark text-text-primary rounded-lg hover:bg-surface-darker transition-colors text-sm font-medium">
          {t("coach.clients.activeClients.assignProgram")}
        </button>
      </div>
    </div>
  );
}
