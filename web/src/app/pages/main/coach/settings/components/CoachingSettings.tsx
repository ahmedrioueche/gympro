import { Award, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import TextArea from "../../../../../../components/ui/TextArea";
import SettingsTab from "../../../../../components/settings/SettingsTab";

interface CoachingSettingsProps {
  bio: string;
  setBio: (value: string) => void;
  specializations: string[];
  setSpecializations: (value: string[]) => void;
  yearsOfExperience: string;
  setYearsOfExperience: (value: string) => void;
}

const COMMON_SPECIALIZATIONS = [
  "Strength Training",
  "Weight Loss",
  "Muscle Building",
  "CrossFit",
  "Yoga",
  "Pilates",
  "Nutrition",
  "Sports Performance",
  "Rehabilitation",
  "Senior Fitness",
];

export default function CoachingSettings({
  bio,
  setBio,
  specializations,
  setSpecializations,
  yearsOfExperience,
  setYearsOfExperience,
}: CoachingSettingsProps) {
  const { t } = useTranslation();

  const handleAddSpecialization = (spec: string) => {
    if (!specializations.includes(spec)) {
      setSpecializations([...specializations, spec]);
    }
  };

  const handleRemoveSpecialization = (spec: string) => {
    setSpecializations(specializations.filter((s) => s !== spec));
  };

  return (
    <SettingsTab
      title={t("extra.coachSettings.tabs.coaching", "Coaching")}
      description={t(
        "coach.settings.coaching.description",
        "Share your professional background and expertise.",
      )}
      icon={Award}
    >
      {/* Bio */}
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.coachSettings.coaching.bio", "Professional Bio")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.coachSettings.coaching.bioDesc",
            "Tell your potential clients about yourself",
          )}
        </p>
        <TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("extra.coachSettings.coaching.bioPlaceholder")}
          rows={5}
          maxLength={500}
        />
        <div className="flex justify-end mt-2">
          <p className="text-[10px] font-bold text-text-secondary bg-surface px-2 py-1 rounded-md border border-border/50">
            {bio.length} / 500 {t("common.characters")}
          </p>
        </div>
      </div>

      {/* Years of Experience */}
      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.coachSettings.coaching.experience", "Coaching Experience")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.coachSettings.coaching.experienceDesc",
            "How many years have you been coaching professionally?",
          )}
        </p>
        <div className="max-w-[200px]">
          <InputField
            type="number"
            value={yearsOfExperience}
            onChange={(e) => setYearsOfExperience(e.target.value)}
            placeholder={t(
              "extra.coachSettings.coaching.experiencePlaceholder",
            )}
            min="0"
            max="50"
          />
        </div>
      </div>

      {/* Specializations */}
      <div className="pt-10 border-t border-border mt-10">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t(
            "extra.coachSettings.coaching.specializations",
            "Areas of Expertise",
          )}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "extra.coachSettings.coaching.specializationsDesc",
            "Select the areas you specialize in to help clients find you",
          )}
        </p>

        {/* Selected Specializations */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            {specializations.map((spec) => (
              <div
                key={spec}
                className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-xl shadow-sm border border-primary/20"
              >
                <span className="text-sm font-bold">
                  {t(
                    `extra.coachSettings.specializationTypes.${spec.replace(/\s+/g, "")}`,
                    spec,
                  )}
                </span>
                <button
                  onClick={() => handleRemoveSpecialization(spec)}
                  className="hover:bg-primary/10 rounded-lg p-0.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Common Specializations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {COMMON_SPECIALIZATIONS.map((spec) => {
            const isSelected = specializations.includes(spec);
            return (
              <button
                key={spec}
                onClick={() =>
                  isSelected
                    ? handleRemoveSpecialization(spec)
                    : handleAddSpecialization(spec)
                }
                className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 translate-y-[-2px]"
                    : "bg-surface border-border/60 text-text-secondary hover:border-primary/40 hover:text-text-primary"
                }`}
              >
                {t(
                  `extra.coachSettings.specializationTypes.${spec.replace(/\s+/g, "")}`,
                  spec,
                )}
              </button>
            );
          })}
        </div>
      </div>
    </SettingsTab>
  );
}
