import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../store/gym";
import { useModalStore } from "../../../../../store/modal";
import { useMemberProfile } from "./useProfileMember";

export function useMemberProfileModal() {
  const { currentModal, memberProfileProps, closeModal, openModal } =
    useModalStore();
  const { currentGym } = useGymStore();
  const { t } = useTranslation();

  const { memberId, membershipId } = memberProfileProps || {};
  const gymId = currentGym?._id;

  const { data: memberProfile, isLoading } = useMemberProfile(
    gymId,
    membershipId,
    memberId,
  );

  const isOpen = currentModal === "member_profile";

  // Extract data from MemberProfileView
  const user = memberProfile?.user;
  const currentSubscription = memberProfile?.membership?.subscription;
  const subscriptionType = memberProfile?.subscriptionType;
  const subscriptionHistory = user?.subscriptionHistory || [];
  const payments = memberProfile?.payments || [];

  const handleRenewSubscription = () => {
    if (!memberId || !membershipId || !user) return;

    openModal("renew_subscription", {
      memberId: memberId,
      membershipId: membershipId,
      memberName: user.profile?.fullName || t("memberProfile.unknownMember"),
      currentSubscription: currentSubscription
        ? {
            typeId: currentSubscription.typeId,
            endDate: currentSubscription.endDate,
          }
        : undefined,
    });
  };

  const handleClose = () => {
    closeModal();
  };

  return {
    isOpen,
    isLoading,
    user,
    currentSubscription,
    subscriptionType,
    subscriptionHistory,
    payments,
    handleRenewSubscription,
    handleClose,
    hasMembership: !!membershipId && !!memberProfile?.membership,
  };
}
