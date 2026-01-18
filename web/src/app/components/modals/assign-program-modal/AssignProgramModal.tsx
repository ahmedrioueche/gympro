import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { ProgramList } from "./components/ProgramList";
import { useAssignProgram } from "./hooks/useAssignProgram";

export default function AssignProgramModal() {
  const { t } = useTranslation();
  const {
    programs,
    isProgramsLoading,
    selectedProgramId,
    setSelectedProgramId,
    handleAssign,
    isAssigning,
    closeModal,
    isOpen,
    currentProgramId,
  } = useAssignProgram();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("coach.clients.assignProgram.title")}
      icon={Dumbbell}
      primaryButton={{
        label: t("coach.clients.assignProgram.confirm"),
        onClick: handleAssign,
        loading: isAssigning,
        disabled:
          !selectedProgramId ||
          (!!currentProgramId && selectedProgramId === currentProgramId),
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
      }}
    >
      <ProgramList
        programs={programs}
        isLoading={isProgramsLoading}
        selectedProgramId={selectedProgramId}
        onSelect={setSelectedProgramId}
      />
    </BaseModal>
  );
}
