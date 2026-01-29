import { useGymStore } from "../../../../../store/gym";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";
import { useCoachProfile } from "./useCoachProfile";

export function useCoachProfileModal() {
  const { currentModal, coachProfileProps, closeModal, openModal } =
    useModalStore();
  const { activeDashboard } = useUserStore();
  const { currentGym } = useGymStore();

  const { coachId } = coachProfileProps || {};
  const { data: coach, isLoading } = useCoachProfile(coachId);

  const isOpen = currentModal === "coach_profile";
  const isMemberDashboard = activeDashboard === "member";
  const isManagerDashboard = activeDashboard === "manager";

  // Check if user is already being coached by this coach
  const isAlreadyCoached = false; // TODO: Check user.coachingInfo.coachId === coachId

  // Check if coach is already affiliated with current gym
  const isAlreadyAffiliated = false; // TODO: Check gym affiliations

  // Build mock user for template
  const mockUser = coach
    ? {
        _id: coach.userId,
        profile: {
          username: coach.username || "",
          fullName: coach.fullName,
          profileImageUrl: coach.profileImageUrl,
          gender: undefined,
          age: undefined,
          city: coach.location?.city,
          state: coach.location?.state,
          country: coach.location?.country,
        },
        role: "coach" as const,
        memberships: [],
        subscriptionHistory: [],
        notifications: [],
      }
    : undefined;

  const handleRequestCoaching = () => {
    if (!coach) return;
    openModal("request_coach", { coach });
  };

  const handleInviteToGym = () => {
    if (!currentGym) return;
    openModal("invite_coach", {
      gymId: currentGym._id,
      onSuccess: closeModal,
    });
  };

  const handleClose = () => {
    closeModal();
  };

  return {
    isOpen,
    isLoading,
    coach,
    mockUser,
    isMemberDashboard,
    isManagerDashboard,
    isAlreadyCoached,
    isAlreadyAffiliated,
    hasCurrentGym: !!currentGym,
    handleRequestCoaching,
    handleInviteToGym,
    handleClose,
  };
}
