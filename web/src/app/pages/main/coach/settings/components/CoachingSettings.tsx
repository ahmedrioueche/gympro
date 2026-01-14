import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../components/ui/Button";
import InputField from "../../../../../../components/ui/InputField";
import TextArea from "../../../../../../components/ui/TextArea";

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
    <div className="space-y-8">
      {/* Bio */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t("settings.coach.coaching.bio")}
        </h3>
        <TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("settings.coach.coaching.bioPlaceholder")}
          rows={5}
          maxLength={500}
        />
        <p className="text-sm text-text-secondary mt-2">
          {bio.length}/500 {t("common.characters")}
        </p>
      </div>

      {/* Years of Experience */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t("settings.coach.coaching.experience")}
        </h3>
        <InputField
          type="number"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          placeholder={t("settings.coach.coaching.experiencePlaceholder")}
          min="0"
          max="50"
        />
      </div>

      {/* Specializations */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t("settings.coach.coaching.specializations")}
        </h3>

        {/* Selected Specializations */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {specializations.map((spec) => (
              <div
                key={spec}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full"
              >
                <span className="text-sm font-medium">{spec}</span>
                <button
                  onClick={() => handleRemoveSpecialization(spec)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Common Specializations */}
        <p className="text-sm text-text-secondary mb-3">
          {t("settings.coach.coaching.specializationsHint")}
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_SPECIALIZATIONS.map((spec) => (
            <Button
              key={spec}
              variant={specializations.includes(spec) ? "filled" : "ghost"}
              size="sm"
              onClick={() =>
                specializations.includes(spec)
                  ? handleRemoveSpecialization(spec)
                  : handleAddSpecialization(spec)
              }
            >
              {spec}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
