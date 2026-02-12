import type { CoachClient } from "@ahmedrioueche/gympro-client";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { Calendar, ChevronRight, Dumbbell, Layout, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../store/modal";
import { formatDate } from "../../../utils/date";

interface ClientCardProps {
  client: CoachClient;
  onAssignProgram?: () => void;
}

export function ClientCard({ client, onAssignProgram }: ClientCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleClick = () => {
    openModal("client_profile", { clientId: client.userId });
  };

  const name = client.fullName || client.username;

  return (
    <div
      onClick={handleClick}
      className="bg-surface cursor-pointer border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors" />

      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-background">
          {client.profileImageUrl ? (
            <img
              src={client.profileImageUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-text-secondary truncate">
            @{client.username}
          </p>
        </div>
      </div>

      {/* Info Stats */}
      <div className="space-y-3 mb-6">
        {client.location?.city && (
          <div className="flex items-center gap-2.5 text-sm text-text-secondary">
            <div className="p-1.5 bg-background rounded-lg border border-border">
              <MapPin className="w-3.5 h-3.5 text-primary" />
            </div>
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
        {client.currentProgram && (
          <div className="flex items-center gap-2.5 text-sm text-text-secondary">
            <div className="p-1.5 bg-background rounded-lg border border-border">
              <Layout className="w-3.5 h-3.5 text-secondary" />
            </div>
            <span className="font-bold text-text-primary truncate">
              {client.currentProgram.programName}
            </span>
          </div>
        )}
      </div>

      {/* Footer / Metrics */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-2xl border border-border mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            <span>{t("coach.clients.activeClients.joinedOn")}</span>
          </div>
          <span className="text-xs font-bold text-text-primary">
            {client.joinedAt ? formatDate(client.joinedAt) : "-"}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
            <Dumbbell className="w-3 h-3" />
            <span>{t("coach.clients.activeClients.lastWorkout")}</span>
          </div>
          <span className="text-xs font-bold text-text-primary">
            {client.lastWorkoutDate
              ? formatDistanceToNow(new Date(client.lastWorkoutDate), {
                  addSuffix: true,
                })
              : t("common.never", "Never")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="flex-1 px-4 py-2.5 bg-background border border-border text-text-secondary rounded-xl hover:border-primary hover:text-primary transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2"
        >
          {t("coach.clients.activeClients.viewProfile")}
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAssignProgram?.();
          }}
          className="px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/5"
        >
          <Layout className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
