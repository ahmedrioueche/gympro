import type { CoachProfile } from "@ahmedrioueche/gympro-client";
import { UserCheck } from "lucide-react";
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
import { getMessage, showStatusToast } from "../../../utils/statusMessage";
import CoachCard from "../cards/CoachCard";

export default function InviteCoachModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, inviteCoachProps } = useModalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [invitingCoachId, setInvitingCoachId] = useState<string | null>(null);
  const { data: coaches = [], isLoading } = useNearbyCoaches({});
  const { data: affiliations = [] } = useGymCoaches(inviteCoachProps?.gymId);
  console.log({ affiliations });
  const inviteCoach = useInviteCoach();

  // Map of coachId -> affiliation status
  const affiliationStatusMap = affiliations.reduce((acc, aff) => {
    acc[aff.coachId] = aff.status;
    return acc;
  }, {} as Record<string, string>);

  const filteredCoaches = coaches.filter((coach) =>
    (coach.fullName || coach.username || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
      isOpen={currentModal === "invite_coach"}
      onClose={closeModal}
      title={t("coaching.inviteCoach")}
      icon={UserCheck}
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
              <CoachCard
                key={coach.userId}
                coach={coach}
                onViewDetails={() => {
                  window.open(
                    `/public/coach/profile/${coach.userId}`,
                    "_blank"
                  );
                }}
                onInvite={() => handleInvite(coach.userId)}
                isInviting={invitingCoachId === coach.userId}
                affiliationStatus={affiliationStatusMap[coach.userId]}
              />
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  );
}
