import type { CoachClient } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns";
import { Activity, Calendar, Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../../utils/date";

interface ClientInfoContentProps {
  client: CoachClient;
}

export function ClientInfoContent({ client }: ClientInfoContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-hover border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              {t("coach.clients.activeClients.joinedOn")}
            </span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {client.joinedAt ? formatDate(client.joinedAt) : "-"}
          </p>
        </div>
        <div className="bg-surface-hover border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-success" />
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              {t("coach.clients.activeClients.lastWorkout")}
            </span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {client.lastWorkoutDate
              ? formatDistanceToNow(new Date(client.lastWorkoutDate), {
                  addSuffix: true,
                })
              : "-"}
          </p>
        </div>
      </div>

      {/* Current Program */}
      {client.currentProgram && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-xs text-text-secondary uppercase tracking-wider">
              {t("sidebar.programs")}
            </span>
          </div>
          <p className="text-lg font-bold text-text-primary">
            {client.currentProgram.programName}
          </p>
        </div>
      )}
    </div>
  );
}
