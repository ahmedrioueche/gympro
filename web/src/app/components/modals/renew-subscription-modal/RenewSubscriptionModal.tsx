import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { useSubscriptionOptions } from "../../../../hooks/useSubscriptionOptions";
import { useModalStore } from "../../../../store/modal";
import { DateDisplay } from "./DateDisplay";
import { useRenewForm } from "./useRenewForm";
import { useRenewSubscription } from "./useRenewSubscription";

export function RenewSubscriptionModal() {
  const { t } = useTranslation();
  const { currentModal, renewSubscriptionProps, closeModal } = useModalStore();
  const { subscriptionTypeOptions, durationOptions, paymentMethodOptions } =
    useSubscriptionOptions();

  const { formData, handleChange, isExtending, calculatedEndDate } =
    useRenewForm();
  const { renewSubscription, isSubmitting } = useRenewSubscription();

  // Guard clause
  if (currentModal !== "renew_subscription" || !renewSubscriptionProps) {
    return null;
  }

  const { memberName } = renewSubscriptionProps;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    renewSubscription(formData);
  };

  const primaryButtonLabel = isSubmitting
    ? t("common.saving")
    : isExtending
      ? t("renewSubscription.extendSubmit", "Extend Subscription")
      : t("renewSubscription.submit");

  return (
    <BaseModal
      isOpen={true}
      onClose={closeModal}
      title={
        isExtending
          ? t("renewSubscription.extendTitle", "Extend Subscription")
          : t("renewSubscription.title")
      }
      subtitle={memberName}
      icon={RefreshCw}
      primaryButton={{
        label: primaryButtonLabel,
        type: "submit",
        form: "renew-subscription-form",
        loading: isSubmitting,
      }}
    >
      <form
        id="renew-subscription-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <CustomSelect
          title={t("createMember.form.subscription.label")}
          options={subscriptionTypeOptions}
          selectedOption={formData.subscriptionTypeId}
          onChange={(value) => handleChange("subscriptionTypeId", value)}
        />

        <InputField
          type="date"
          label={t("createMember.form.startDate.label")}
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          required
        />

        <CustomSelect
          title={t("renewSubscription.duration.label")}
          options={durationOptions}
          selectedOption={formData.duration}
          onChange={(value) => handleChange("duration", value)}
        />

        <DateDisplay
          startDate={formData.startDate}
          endDate={calculatedEndDate}
          isExtending={isExtending}
        />

        <CustomSelect
          title={t("createMember.form.payment.label")}
          options={paymentMethodOptions}
          selectedOption={formData.paymentMethod}
          onChange={(value) => handleChange("paymentMethod", value)}
        />
      </form>
    </BaseModal>
  );
}

export default RenewSubscriptionModal;
