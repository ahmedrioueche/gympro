import { Activity, UserCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  CustomizableProfileTemplateModal,
  type ProfileModalAction,
} from "../CustomizableProfileTemplateModal";
import { ClientInfoContent } from "./components/ClientInfoContent";
import { useClientProfileModal } from "./hooks/useClientProfileModal";

export default function ClientProfileModal() {
  const { t } = useTranslation();

  const {
    isOpen,
    isLoading,
    client,
    mockUser,
    handleAssignProgram,
    handleClose,
  } = useClientProfileModal();

  if (!isOpen) return null;

  const tabs = [
    {
      id: "overview",
      label: t("memberProfile.about"),
      icon: Activity,
      content: client ? <ClientInfoContent client={client} /> : null,
    },
  ];

  const actions: ProfileModalAction[] = [
    {
      label: t("coach.clients.activeClients.assignProgram"),
      onClick: handleAssignProgram,
      icon: UserCog,
      variant: "filled",
      color: "primary",
    },
  ];

  return (
    <CustomizableProfileTemplateModal
      isOpen={isOpen}
      onClose={handleClose}
      user={mockUser as any}
      isLoading={isLoading}
      title={client?.fullName || t("role.member") + " Details"}
      tabs={tabs}
      actions={actions}
    />
  );
}
