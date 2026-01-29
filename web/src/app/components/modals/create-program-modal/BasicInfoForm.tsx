import {
  type CreateProgramDto,
  type DaysPerWeek,
  type ExperienceLevel,
  type ProgramPurpose,
} from "@ahmedrioueche/gympro-client";
import { Dumbbell } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../components/ui/InputField";
import { ProgramDescription } from "../../gym/ProgramDescription";
import { ProgramForm } from "../../gym/ProgramForm";

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

          {/* Visibility Toggle */}
          <div className="bg-background-secondary p-4 rounded-xl border border-border">
            <label className="text-sm font-medium text-text-primary mb-3 block">
              {t("training.programs.create.form.visibility")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onFieldChange("isPublic", false)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  !formData.isPublic
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border text-text-secondary hover:border-primary/50"
                }`}
              >
                <div className="w-4 h-4">🔒</div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    {t("training.programs.create.form.private")}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {t("training.programs.create.form.privateDesc")}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onFieldChange("isPublic", true)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  formData.isPublic
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border text-text-secondary hover:border-primary/50"
                }`}
              >
                <div className="w-4 h-4">🌍</div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    {t("training.programs.create.form.public")}
                  </div>
                  <div className="text-[10px] opacity-80">
                    {t("training.programs.create.form.publicDesc")}
                  </div>
                </div>
              </button>
            </div>
          </div>
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

        {/* Duration in Weeks */}
        <div className="bg-background-secondary p-4 rounded-xl border border-border">
          <label className="text-sm font-medium text-text-primary mb-2 block">
            {t(
              "training.programs.create.form.durationWeeks",
              "Duration (weeks)",
            )}
          </label>
          <div className="flex items-center gap-3">
            {[4, 6, 8, 12].map((weeks) => (
              <button
                key={weeks}
                type="button"
                onClick={() => onFieldChange("durationWeeks", weeks)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  (formData.durationWeeks ?? 12) === weeks
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-background border-border text-text-secondary hover:border-primary/50"
                }`}
              >
                {weeks} {t("common.weeks", "weeks")}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {t(
              "training.programs.create.form.durationWeeksHint",
              "Total workouts: {{count}}",
            ).replace(
              "{{count}}",
              String(formData.daysPerWeek * (formData.durationWeeks ?? 12)),
            )}
          </p>
        </div>
      </div>
    </>
  );
};
