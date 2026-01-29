import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { ExerciseFormContent } from "./ExerciseFormContent";
import { ExerciseModalFooter } from "./ExerciseModalFooter";
import { useCreateExerciseForm } from "./useCreateExerciseForm";

export const CreateExerciseModal = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    exerciseToEdit,
    formData,
    equipmentInput,
    isPending,
    closeModal,
    handleSubmit,
    setEquipmentInput,
    handleEquipmentAdd,
    removeEquipment,
    updateField,
    setFormData,
  } = useCreateExerciseForm();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={
        exerciseToEdit
          ? t("training.exercises.edit")
          : t("training.exercises.create")
      }
      subtitle={t("training.exercises.subtitle")}
      icon={Dumbbell}
      footer={
        <ExerciseModalFooter
          onClose={closeModal}
          onSubmit={handleSubmit}
          isPending={isPending}
          isValid={!!formData.name}
        />
      }
    >
      <ExerciseFormContent
        formData={formData}
        equipmentInput={equipmentInput}
        setEquipmentInput={setEquipmentInput}
        updateField={updateField}
        handleEquipmentAdd={handleEquipmentAdd}
        removeEquipment={removeEquipment}
        setFormData={setFormData}
      />
    </BaseModal>
  );
};
