import {
  AffiliationStatus,
  type CoachProfile,
} from "@ahmedrioueche/gympro-client";
import { UserCheck, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import InputField from "../../../components/ui/InputField";
import Loading from "../../../components/ui/Loading";
import { useNearbyCoaches } from "../../../hooks/queries/useCoaches";
import {
  useGymCoaches,
  useInviteCoach,
} from "../../../hooks/queries/useGymCoach";
import { useModalStore } from "../../../store/modal";
import { useModalLayer } from "../../../hooks/useModalLayer";
import { getMessage, showStatusToast } from "../../../utils/statusMessage";
import { MinimalCoachCard } from "../ui/MinimalCoachCard";

export default function InviteCoachModal() {
  const { t } = useTranslation();
  const { closeModal, openModal, inviteCoachProps } = useModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [invitingCoachId, setInvitingCoachId] = useState<string | null>(null);

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("invite_coach");
  const { data: coaches = [], isLoading } = useNearbyCoaches({}, isOpen);
  const { data: affiliations = [] } = useGymCoaches(inviteCoachProps?.gymId);
  const inviteCoach = useInviteCoach();

  // Map of coachId -> affiliation status
  const affiliationStatusMap = affiliations.reduce(
    (acc, aff) => {
      const coachId =
        typeof aff.coachId === "string"
          ? aff.coachId
          : (aff.coachId as any)?._id;
      if (
        coachId &&
        [
          AffiliationStatus.ACTIVE,
          AffiliationStatus.PENDING,
          AffiliationStatus.SUSPENDED,
        ].includes(aff.status as any)
      ) {
        acc[coachId] = aff.status;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const filteredCoaches = coaches.filter((coach) => {
    // Hide coaches who are already affiliated (active, pending, etc.)
    if (affiliationStatusMap[coach.userId]) return false;

    return (coach.fullName || coach.username || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleInvite = async (coachId: string) => {
    if (!inviteCoachProps?.gymId) return;
    setInvitingCoachId(coachId);
    try {
      const response = await inviteCoach.mutateAsync({
        gymId: inviteCoachProps.gymId,
        coachId,
      });
      const msg = getMessage(response, t);
      showStatusToast(msg, toast);
      if (response.success) {
        inviteCoachProps?.onSuccess?.();
        closeModal();
      }
    } finally {
      setInvitingCoachId(null);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      title={t("coaching.inviteCoach")}
      icon={UserCheck}
      secondaryButton={{
        label: t("common.close"),
        onClick: closeModal,
        icon: X,
      }}
    >
      <div className="space-y-4">
        <InputField
          type="text"
          placeholder={t("coaching.searchCoaches")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <div className="py-8">
            <Loading />
          </div>
        ) : filteredCoaches.length === 0 ? (
          <p className="text-center text-text-secondary py-8">
            {t("coaching.noCoachesFound")}
          </p>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredCoaches.map((coach: CoachProfile) => (
              <div
                key={coach.userId}
                className="flex items-center justify-between gap-4 p-1 bg-surface-secondary/30 rounded-2xl border border-border/50 hover:bg-surface-secondary/50 transition-all group"
              >
                <MinimalCoachCard
                  coach={{
                    _id: coach.userId,
                    fullName: coach.fullName,
                    username: coach.username,
                    profileImageUrl: coach.profileImageUrl,
                  }}
                  className="flex-1 bg-transparent border-none backdrop-blur-none p-3"
                />
                <div className="pr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInvite(coach.userId);
                    }}
                    disabled={invitingCoachId === coach.userId}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {invitingCoachId === coach.userId
                      ? t("common.loading")
                      : t("coaching.inviteCoach")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
