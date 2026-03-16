import { Award, ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { CoachInfoContent } from "./CoachInfoContent";
import { useCoachProfileModal } from "./useCoachProfileModal";
import { useModalStore } from "../../../../../store/modal";

export default function CoachProfileModal() {
  const { t } = useTranslation();
  const { openModal, coachProfileProps } = useModalStore();

  const {
    isOpen,
    isLoading,
    coach,
    mockUser,
    isMemberDashboard,
    isManagerDashboard,
    isAdminDashboard,
    isAlreadyCoached,
    isAlreadyAffiliated,
    hasCurrentGym,
    handleRequestCoaching,
    handleInviteToGym,
    handleClose,
    onRemove,
  } = useCoachProfileModal();

  if (!isOpen) return null;

  // Find membershipId from affiliation if available
  // We need to find the affiliation first
  const membershipId = (coach as any)?.membershipId || (coachProfileProps as any)?.coach?.membershipId;

  const tabs = [
    {
      id: "overview",
      label: t("memberProfile.about"),
      icon: Award,
      content: coach ? <CoachInfoContent coach={coach} /> : null,
    },
  ];

  // Build actions based on dashboard context
  const actions: ProfileModalAction[] = [];

  // Member: Request Coaching or Already Coached
  if (isMemberDashboard) {
    if (isAlreadyCoached) {
      actions.push({
        label: t("coaches.alreadyCoached"),
        onClick: () => {},
        icon: UserPlus,
        variant: "success",
        disabled: true,
      });
    } else {
      actions.push({
        label: t("coaches.requestCoaching"),
        onClick: handleRequestCoaching,
        icon: UserPlus,
        variant: "primary",
      });
    }
  }

  // Manager: Invite to Gym
  if (isManagerDashboard && !isAlreadyAffiliated && hasCurrentGym) {
    actions.push({
      label: t("coaching.inviteCoach"),
      onClick: handleInviteToGym,
      icon: UserPlus,
      variant: "primary",
    });
  }

  // Manager: Access Management
  if (isManagerDashboard && isAlreadyAffiliated && membershipId) {
    actions.push({
      label: t("access.management.title"),
      onClick: () => {
        const gymId = (coachProfileProps as any)?.gymId || (coach as any)?.gymId;
        if (gymId) {
          openModal("access_management", {
            gymId,
            membershipId,
            memberName: coach?.fullName || coach?.username || "Coach",
            initialAccessData: undefined, // Will be fetched by the modal
          });
        }
      },
      icon: ShieldCheck,
      variant: "default",
    });
  }

  // Manager/Admin: Remove Coach
  const canRemove =
    (isManagerDashboard && isAlreadyAffiliated && onRemove) ||
    (isAdminDashboard && onRemove);

  if (canRemove) {
    actions.push({
      label: t("coaching.removeCoach"),
      onClick: onRemove!,
      icon: UserMinus,
      variant: "danger",
    });
  }

  return (
    <CustomizableProfileTemplateModal
      isOpen={isOpen}
      onClose={handleClose}
      user={mockUser as any}
      isLoading={isLoading}
      title={coach?.fullName || t("role.coach") + " Profile"}
      tabs={tabs}
      actions={actions}
      showContactInfo={isAdminDashboard || isManagerDashboard}
    />
  );
}
