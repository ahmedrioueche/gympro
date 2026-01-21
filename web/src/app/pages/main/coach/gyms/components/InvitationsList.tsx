import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { Check, Clock } from "lucide-react";
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {invitations.map((invitation) => (
        <div
          key={invitation._id}
          className="bg-surface border border-border rounded-2xl p-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            {invitation.gym?.logo ? (
              <img
                src={invitation.gym.logo}
                alt={invitation.gym.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-xl">
                  {invitation.gym?.name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary truncate">
                {invitation.gym?.name || t("common.unknown")}
              </p>
              {invitation.gym?.location?.city && (
                <p className="text-sm text-text-secondary truncate">
                  {invitation.gym.location.city}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-600">
                  {t("coach.gyms.pendingResponse")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => handleOpenInvitation(invitation)}
              className="w-full px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              {t("common.view")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
