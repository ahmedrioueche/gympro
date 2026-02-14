import { Award, UserMinus, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { CoachInfoContent } from "./CoachInfoContent";
import { useCoachProfileModal } from "./useCoachProfileModal";

export default function CoachProfileModal() {
  const { t } = useTranslation();

  const {
    isOpen,
    isLoading,
    coach,
    mockUser,
    isMemberDashboard,
    isManagerDashboard,
    isAlreadyCoached,
    isAlreadyAffiliated,
    hasCurrentGym,
    handleRequestCoaching,
    handleInviteToGym,
    handleClose,
    onRemove,
  } = useCoachProfileModal();

  if (!isOpen) return null;

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

  // Manager: Remove Coach
  if (isManagerDashboard && onRemove) {
    actions.push({
      label: t("coaching.removeCoach"),
      onClick: onRemove,
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
    />
  );
}
