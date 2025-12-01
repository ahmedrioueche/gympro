import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";

interface FormData {
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  paymentMethod: string;
}

interface StepSubscriptionInfoProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
}

function StepSubscriptionInfo({
  formData,
  handleInputChange,
}: StepSubscriptionInfoProps) {
  const { t } = useTranslation();

  const subscriptionOptions = [
    { value: "", label: t("createMember.form.subscription.placeholder") },
    { value: "regular", label: t("createMember.form.subscription.regular") },
    { value: "coached", label: t("createMember.form.subscription.coached") },
    { value: "yoga", label: t("createMember.form.subscription.yoga") },
    { value: "crossfit", label: t("createMember.form.subscription.crossfit") },
  ];

  const paymentMethodOptions = [
    { value: "", label: t("createMember.form.payment.placeholder") },
    { value: "cash", label: t("createMember.form.payment.cash") },
    { value: "card", label: t("createMember.form.payment.card") },
    {
      value: "bank_transfer",
      label: t("createMember.form.payment.bankTransfer"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
          <span className="text-2xl">💳</span>
          {t("createMember.steps.subscription.title")}
        </h2>
        <p className="text-text-secondary text-sm">
          {t("createMember.steps.subscription.description")}
        </p>
      </div>

      <CustomSelect
        title={t("createMember.form.subscription.label")}
        options={subscriptionOptions}
        selectedOption={formData.subscriptionTypeId}
        onChange={(value) => handleInputChange("subscriptionTypeId", value)}
      />

      <InputField
        type="date"
        label={t("createMember.form.startDate.label")}
        value={formData.subscriptionStartDate}
        onChange={(e) =>
          handleInputChange("subscriptionStartDate", e.target.value)
        }
        placeholder={t("createMember.form.startDate.placeholder")}
      />

      <CustomSelect
        title={t("createMember.form.payment.label")}
        options={paymentMethodOptions}
        selectedOption={formData.paymentMethod}
        onChange={(value) => handleInputChange("paymentMethod", value)}
      />
    </div>
  );
}

export default StepSubscriptionInfo;
