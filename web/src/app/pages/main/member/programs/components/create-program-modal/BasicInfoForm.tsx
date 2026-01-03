import {
  type CreateProgramDto,
  type DaysPerWeek,
  type ExperienceLevel,
  type ProgramPurpose,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../../components/ui/InputField";
import { ProgramDescription } from "../ProgramDescription";
import { ProgramForm } from "../ProgramForm";

interface BasicInfoFormProps {
  formData: CreateProgramDto;
  onFieldChange: (field: keyof CreateProgramDto, value: any) => void;
  onDaysPerWeekChange: (days: DaysPerWeek) => void;
}

export const BasicInfoForm = ({
  formData,
  onFieldChange,
  onDaysPerWeekChange,
}: BasicInfoFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          {t("training.programs.create.basicInfo")}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <InputField
            label={t("training.programs.create.form.name")}
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder={t("training.programs.create.form.namePlaceholder")}
          />

          <ProgramDescription
            description={formData.description}
            isEditMode={true}
            editDescription={formData.description}
            onDescriptionChange={(description) =>
              onFieldChange("description", description)
            }
          />
        </div>
      </div>

      {/* Program Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">
          {t("training.programs.create.programDetails")}
        </h3>

        <ProgramForm
          experience={formData.experience}
          purpose={formData.purpose}
          daysPerWeek={formData.daysPerWeek}
          onExperienceChange={(value) =>
            onFieldChange("experience", value as ExperienceLevel)
          }
          onPurposeChange={(value) =>
            onFieldChange("purpose", value as ProgramPurpose)
          }
          onDaysPerWeekChange={onDaysPerWeekChange}
        />
      </div>
    </>
  );
};
