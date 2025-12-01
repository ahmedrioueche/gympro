import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import TextArea from "../../../../../../components/ui/TextArea";
import StepHeader from "./StepHeader";

function StepBasicInfo({ formData, handleChange, steps, duplicateGymName }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 animate-fadeIn">
      <StepHeader
        icon="🏢"
        title={steps[0].title}
        desc={steps[0].description}
      />

      <div>
        <InputField
          label={t("create_gym.form.name_label")}
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder={t("create_gym.form.name_placeholder")}
        />
        {duplicateGymName && (
          <div className="mt-2 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-red-500 text-lg flex-shrink-0">⚠️</span>
            <p className="text-sm text-red-400">
              {t("create_gym.form.duplicate_name_error")}
            </p>
          </div>
        )}
      </div>

      <TextArea
        label={t("create_gym.form.slogan_label")}
        name="slogan"
        value={formData.slogan}
        onChange={handleChange}
        placeholder={t("create_gym.form.slogan_placeholder")}
        rows={3}
      />
    </div>
  );
}

export default StepBasicInfo;
