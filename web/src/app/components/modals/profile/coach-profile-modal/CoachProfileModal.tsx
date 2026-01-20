import { Award, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { CoachInfoContent } from "./components/CoachInfoContent";
import { useCoachProfileModal } from "./hooks/useCoachProfileModal";

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

  // Member: Request Coaching
  if (isMemberDashboard && !isAlreadyCoached) {
    actions.push({
      label: t("coaches.requestCoaching"),
      onClick: handleRequestCoaching,
      icon: UserPlus,
      variant: "filled",
      color: "primary",
    });
  }

  // Manager: Invite to Gym
  if (isManagerDashboard && !isAlreadyAffiliated && hasCurrentGym) {
    actions.push({
      label: t("coaching.inviteCoach"),
      onClick: handleInviteToGym,
      icon: UserPlus,
      variant: "filled",
      color: "primary",
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
