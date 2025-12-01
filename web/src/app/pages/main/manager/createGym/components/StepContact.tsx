import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import StepHeader from "./StepHeader";

function StepContact({ formData, handleChange, steps }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 animate-fadeIn">
      <StepHeader
        icon="📞"
        title={steps[2].title}
        desc={steps[2].description}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t("create_gym.form.phone_label")}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={t("create_gym.form.phone_placeholder")}
        />

        <InputField
          label={t("create_gym.form.email_label")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t("create_gym.form.email_placeholder")}
        />
      </div>

      <InputField
        label={t("create_gym.form.website_label")}
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder={t("create_gym.form.website_placeholder")}
      />
    </div>
  );
}

export default StepContact;
