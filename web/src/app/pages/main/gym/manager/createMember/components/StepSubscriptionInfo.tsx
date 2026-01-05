import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";

interface FormData {
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  paymentMethod: string;
}

interface StepSubscriptionInfoProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  subscriptionOptions: { value: string; label: string }[];
  paymentMethodOptions: { value: string; label: string }[];
  errors: {
    subscriptionTypeId?: string;
    paymentMethod?: string;
    subscriptionStartDate?: string;
  };
}

function StepSubscriptionInfo({
  formData,
  handleInputChange,
  subscriptionOptions,
  paymentMethodOptions,
  errors,
}: StepSubscriptionInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">💳</span>
          {t("createMember.steps.subscription.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("createMember.steps.subscription.description")}
        </p>
      </div>

      <div className="space-y-1">
        <CustomSelect
          title={t("createMember.form.subscription.label")}
          options={subscriptionOptions}
          selectedOption={formData.subscriptionTypeId}
          onChange={(value) => handleInputChange("subscriptionTypeId", value)}
        />
        {errors.subscriptionTypeId && (
          <p className="text-danger text-sm">{errors.subscriptionTypeId}</p>
        )}
      </div>

      <InputField
        type="date"
        label={t("createMember.form.startDate.label")}
        value={formData.subscriptionStartDate}
        onChange={(e) =>
          handleInputChange("subscriptionStartDate", e.target.value)
        }
        placeholder={t("createMember.form.startDate.placeholder")}
        error={errors.subscriptionStartDate}
        required
      />

      <div className="space-y-1">
        <CustomSelect
          title={t("createMember.form.payment.label")}
          options={paymentMethodOptions}
          selectedOption={formData.paymentMethod}
          onChange={(value) => handleInputChange("paymentMethod", value)}
        />
        {errors.paymentMethod && (
          <p className="text-danger text-sm">{errors.paymentMethod}</p>
        )}
      </div>
    </div>
  );
}

export default StepSubscriptionInfo;
