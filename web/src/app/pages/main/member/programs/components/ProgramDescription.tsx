import { useTranslation } from "react-i18next";

interface ProgramDescriptionProps {
  description?: string;
  isEditMode: boolean;
  editDescription?: string;
  onDescriptionChange: (description: string) => void;
}

export const ProgramDescription = ({
  description,
  isEditMode,
  editDescription,
  onDescriptionChange,
}: ProgramDescriptionProps) => {
  const { t } = useTranslation();

  if (isEditMode) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-secondary">
          {t("training.programs.create.form.description")}
        </label>
        <textarea
          value={editDescription || ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={t(
            "training.programs.create.form.descriptionPlaceholder"
          )}
          rows={3}
          className="w-full p-3 bg-background-secondary rounded-xl border border-border text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
        />
      </div>
    );
  }

  return (
    <p className="text-text-secondary leading-relaxed">
      {description || t("training.programs.card.noDescription")}
    </p>
  );
};
