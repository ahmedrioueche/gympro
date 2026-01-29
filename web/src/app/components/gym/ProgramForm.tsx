import {
  type DaysPerWeek,
  EXPERIENCE_LEVELS,
  type ExperienceLevel,
  PROGRAM_PURPOSES,
  type ProgramPurpose,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../components/ui/CustomSelect";

interface ProgramFormProps {
  experience: ExperienceLevel;
  purpose: ProgramPurpose;
  daysPerWeek?: DaysPerWeek;
  durationWeeks?: number;
  onExperienceChange: (value: ExperienceLevel) => void;
  onPurposeChange: (value: ProgramPurpose) => void;
  onDaysPerWeekChange?: (value: DaysPerWeek) => void;
  onDurationWeeksChange?: (value: number) => void;
}

export const ProgramForm = ({
  experience,
  purpose,
  daysPerWeek,
  durationWeeks,
  onExperienceChange,
  onPurposeChange,
  onDaysPerWeekChange,
  onDurationWeeksChange,
}: ProgramFormProps) => {
  const { t } = useTranslation();

  const experienceOptions = EXPERIENCE_LEVELS.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1).replace("_", " "),
  }));

  const purposeOptions = PROGRAM_PURPOSES.map((purpose) => ({
    value: purpose,
    label:
      purpose.charAt(0).toUpperCase() + purpose.slice(1).replace(/_/g, " "),
  }));

  const daysOptions = [1, 2, 3, 4, 5, 6, 7].map((num) => ({
    value: num.toString(),
    label: `${num} ${t("training.programs.create.form.daysPerWeek")}`,
  }));

  const weeksOptions = [4, 6, 8, 12, 16].map((num) => ({
    value: num.toString(),
    label: `${num} ${t("common.weeks", "weeks")}`,
  }));

  // Calculate grid columns based on what's shown
  const extraCols =
    (daysPerWeek !== undefined ? 1 : 0) + (durationWeeks !== undefined ? 1 : 0);
  const gridCols =
    extraCols === 2
      ? "md:grid-cols-4"
      : extraCols === 1
        ? "md:grid-cols-3"
        : "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      <CustomSelect
        title={t("training.programs.create.form.experience")}
        options={experienceOptions}
        selectedOption={experience}
        onChange={(value) => onExperienceChange(value as ExperienceLevel)}
      />
      <CustomSelect
        title={t("training.programs.create.form.purpose")}
        options={purposeOptions}
        selectedOption={purpose}
        onChange={(value) => onPurposeChange(value as ProgramPurpose)}
      />
      {daysPerWeek !== undefined && onDaysPerWeekChange && (
        <CustomSelect
          title={t("training.programs.create.form.daysPerWeekLabel")}
          options={daysOptions}
          selectedOption={daysPerWeek.toString()}
          onChange={(value) =>
            onDaysPerWeekChange(parseInt(value) as DaysPerWeek)
          }
        />
      )}
      {durationWeeks !== undefined && onDurationWeeksChange && (
        <CustomSelect
          title={t(
            "training.programs.create.form.durationWeeks",
            "Duration (weeks)",
          )}
          options={weeksOptions}
          selectedOption={durationWeeks.toString()}
          onChange={(value) => onDurationWeeksChange(parseInt(value))}
        />
      )}
    </div>
  );
};
