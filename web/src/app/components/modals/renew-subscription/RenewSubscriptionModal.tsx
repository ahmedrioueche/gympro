import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { useSubscriptionOptions } from "../../../../hooks/useSubscriptionOptions";
import { useModalStore } from "../../../../store/modal";
import { DateDisplay } from "./components/DateDisplay";
import { ModalFooter } from "./components/ModalFooter";
import { ModalHeader } from "./components/ModalHeader";
import { useRenewForm } from "./hooks/useRenewForm";
import { useRenewSubscription } from "./hooks/useRenewSubscription";

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

  return (
    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl shadow-2xl max-w-lg w-full border-2 border-primary/30 overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        <ModalHeader
          memberName={memberName}
          isExtending={isExtending}
          onClose={closeModal}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
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

          <ModalFooter
            isSubmitting={isSubmitting}
            isExtending={isExtending}
            onCancel={closeModal}
          />
        </form>
      </div>
    </div>
  );
}

export default RenewSubscriptionModal;
