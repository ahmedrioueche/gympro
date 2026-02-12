import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { Clock, Coins, Eye, MapPin, MessageSquare, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import { useModalStore } from "../../../../../../store/modal";

interface InvitationsListProps {
  invitations: GymCoachAffiliation[];
  onRespond?: () => void;
}

export function InvitationsList({
  invitations,
  onRespond,
}: InvitationsListProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const handleOpenInvitation = (invitation: GymCoachAffiliation) => {
    openModal("gym_invitation", {
      invitationId: invitation._id,
      gymName: invitation.gym?.name || t("common.unknown"),
      gymId: invitation.gymId,
      onSuccess: onRespond,
    });
  };

  if (invitations.length === 0) {
    return (
      <NoData
        emoji="📬"
        title={t("coach.gyms.noInvitations")}
        description={t("coach.gyms.noInvitationsDesc")}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {invitations.map((invitation) => (
        <div
          key={invitation._id}
          className="group relative bg-surface border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Status Badge */}
          <div className="absolute top-2 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 shadow-sm backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t("coach.gyms.pendingResponse")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6 h-full">
            <div className="flex items-start gap-5">
              {/* Gym Logo Container */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors duration-500" />
                {invitation.gym?.logo ? (
                  <img
                    src={invitation.gym.logo}
                    alt={invitation.gym.name}
                    className="relative w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-xl group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-xl group-hover:scale-105 transition-transform duration-500">
                    <span className="text-primary font-black text-3xl">
                      {invitation.gym?.name?.[0]?.toUpperCase() || "?"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pt-2">
                <h4 className="font-black text-text-primary text-xl leading-tight truncate group-hover:text-primary transition-colors duration-300">
                  {invitation.gym?.name || t("common.unknown")}
                </h4>
                {(invitation.gym?.location?.city ||
                  invitation.commissionRate ||
                  invitation.isExclusive) && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-text-secondary transition-all duration-300 group-hover:text-text-primary">
                    {invitation.gym?.location?.city ? (
                      <>
                        <MapPin className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-medium truncate">
                          {invitation.gym.location.city}
                        </span>
                      </>
                    ) : invitation.commissionRate ? (
                      <>
                        <Coins className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-medium truncate">
                          {invitation.commissionRate}%{" "}
                          {t("coach.gyms.commission", "Commission")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-primary/60" />
                        <span className="text-sm font-medium truncate">
                          {t("coach.gyms.exclusive", "Exclusive Partnership")}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Message Preview */}
            {(invitation as any).message && (
              <div className="relative p-4 bg-muted/30 rounded-[1.5rem] border border-border/50 group-hover:bg-muted/50 transition-colors duration-300">
                <MessageSquare className="absolute -top-2 -right-2 w-5 h-5 text-primary/40 bg-surface rounded-full p-1 border border-border" />
                <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed italic">
                  "{(invitation as any).message}"
                </p>
              </div>
            )}

            <div className="mt-auto pt-2">
              <button
                onClick={() => handleOpenInvitation(invitation)}
                className="w-full px-6 py-3.5 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary-hover transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <Eye className="w-4 h-4" />
                {t("common.viewInvitation", "View Invitation")}
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-[2rem]" />
        </div>
      ))}
    </div>
  );
}
