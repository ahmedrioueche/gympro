import { Calendar, Plus, X } from "lucide-react";
import BaseModal from "../../../../components/ui/BaseModal";
import { SessionForm } from "./SessionForm";
import { useCreateSessionModal } from "./useCreateSessionModal";

export const CreateSessionModal = () => {
  const {
    t,
    isOpen,
    sessionData,
    updateSessionField,
    handleSubmit,
    handleClose,
    clients,
    facilities,
    gymId,
    isPending,
  } = useCreateSessionModal();

  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("schedule.createSession")}
      subtitle={t("schedule.createSessionSubtitle")}
      icon={Calendar}
      primaryButton={{
        label: t("common.create"),
        onClick: handleSubmit,
        loading: isPending,
        type: "submit",
        icon: Plus,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: handleClose,
        icon: X,
      }}
    >
      <form onSubmit={handleSubmit}>
        <SessionForm
          data={sessionData}
          updateField={updateSessionField}
          clients={clients}
          facilities={facilities}
          gymId={gymId}
        />
      </form>
    </BaseModal>
  );
};

export default CreateSessionModal;
