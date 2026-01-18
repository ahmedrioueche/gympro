import type { GymCoachAffiliation } from "@ahmedrioueche/gympro-client";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import { useRespondToAffiliation } from "../../../../../../hooks/queries/useGymCoach";

interface InvitationsListProps {
  invitations: GymCoachAffiliation[];
  onRespond?: () => void;
}

export function InvitationsList({
  invitations,
  onRespond,
}: InvitationsListProps) {
  const { t } = useTranslation();
  const respondToAffiliation = useRespondToAffiliation();

  const handleRespond = async (affiliationId: string, accept: boolean) => {
    try {
      await respondToAffiliation.mutateAsync({ affiliationId, accept });
      toast.success(
        accept ? t("coach.gyms.inviteAccepted") : t("coach.gyms.inviteDeclined")
      );
      onRespond?.();
    } catch (error) {
      toast.error(t("common.error"));
    }
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

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleRespond(invitation._id, true)}
              disabled={respondToAffiliation.isPending}
              className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              {t("common.accept")}
            </button>
            <button
              onClick={() => handleRespond(invitation._id, false)}
              disabled={respondToAffiliation.isPending}
              className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              {t("common.decline")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
