import {
  type SubscriptionType,
  formatPrice,
} from "@ahmedrioueche/gympro-client";
import { CheckCircle2, RefreshCw, Tag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { useGymSubscriptionOptions } from "../../../../hooks/useGymSubscriptionOptions";
import { useGymStore } from "../../../../store/gym";
import { useLanguageStore } from "../../../../store/language";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { DateDisplay } from "./DateDisplay";
import { useRenewForm } from "./useRenewForm";
import { useRenewSubscription } from "./useRenewSubscription";

export function RenewSubscriptionModal() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { language } = useLanguageStore();
  const { renewSubscriptionProps, closeModal } = useModalStore();
  const { isOpen, zIndex } = useModalLayer("renew_subscription");

  const { formData, handleChange, isExtending, calculatedEndDate } =
    useRenewForm();

  const {
    subscriptionTypeOptions,
    durationOptions,
    paymentMethodOptions,
    selectedPlan,
  } = useGymSubscriptionOptions(formData.subscriptionTypeId);
  const { renewSubscription, isSubmitting } = useRenewSubscription();

  const currency = currentGym?.settings?.defaultCurrency || "USD";

  const calculateTotalPrice = () => {
    if (!selectedPlan || !formData.duration) return 0;
    const [durationStr, unit] = formData.duration.split("_");
    const count = parseInt(durationStr);

    const tier = (selectedPlan as SubscriptionType).pricingTiers.find(
      (t) => t.duration === count && t.durationUnit === unit,
    );
    if (tier) return tier.price;

    const baseTier = (selectedPlan as SubscriptionType).pricingTiers.find(
      (t) => t.duration === 1 && t.durationUnit === unit,
    );
    if (baseTier) return baseTier.price * count;

    return 0;
  };

  const totalPrice = calculateTotalPrice();

  // Guard clause
  if (!isOpen || !renewSubscriptionProps) {
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
      zIndex={zIndex}
      onClose={closeModal}
      title={
        isExtending
          ? t("renewSubscription.extendTitle", "Extend Subscription")
          : t("renewSubscription.title")
      }
      subtitle={memberName}
      icon={RefreshCw}
      maxWidth="max-w-2xl"
      primaryButton={{
        label: primaryButtonLabel,
        type: "submit",
        form: "renew-subscription-form",
        loading: isSubmitting,
        icon: RefreshCw,
      }}
      secondaryButton={{
        label: t("common.cancel"),
        onClick: closeModal,
        icon: X,
      }}
    >
      <form
        id="renew-subscription-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-3">
          <CustomSelect
            title={t("createMember.form.subscription.label")}
            options={subscriptionTypeOptions}
            selectedOption={formData.subscriptionTypeId}
            onChange={(value) => handleChange("subscriptionTypeId", value)}
          />

          {selectedPlan && (
            <div className="bg-gradient-to-br from-surface-secondary/80 to-surface-secondary/40 border border-primary/20 rounded-xl p-5 space-y-5 shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">
                      {selectedPlan.customName || t("pricing.form.regularPlan")}
                    </h4>
                    {selectedPlan.description && (
                      <p className="text-xs text-text-secondary leading-relaxed max-w-md">
                        {selectedPlan.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Base Prices Display */}
                <div className="flex flex-col items-end gap-1.5 min-w-fit">
                  {(selectedPlan as SubscriptionType).pricingTiers
                    .filter((tier) => tier.duration === 1)
                    .map((tier) => (
                      <div
                        key={`${tier.duration}_${tier.durationUnit}`}
                        className="bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg flex flex-col items-end group hover:bg-primary/10 transition-colors"
                      >
                        <span className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">
                          {t(
                            `pricing.units.${tier.durationUnit}`,
                            tier.durationUnit,
                          )}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {formatPrice(tier.price, currency, language)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {selectedPlan.services && selectedPlan.services.length > 0 && (
                <div className="pt-4 border-t border-border/30">
                  <p className="text-[10px] uppercase font-black text-text-secondary tracking-[0.2em] mb-3 px-1">
                    {t("pricing.form.linkedServices", "Included Services")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 px-1">
                    {selectedPlan.services.map((service) => (
                      <div
                        key={service}
                        className="flex items-center gap-2 group"
                      >
                        <div className="p-1 bg-success/10 rounded-md group-hover:bg-success/20 transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                        </div>
                        <span className="text-xs text-text-primary capitalize group-hover:text-white transition-colors">
                          {t(`settings.gym.services.${service}`, service)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            type="date"
            label={t("createMember.form.startDate.label")}
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            required
          />

          <div className="space-y-1">
            <CustomSelect
              title={t("renewSubscription.duration.label")}
              options={durationOptions}
              selectedOption={formData.duration}
              onChange={(value) => handleChange("duration", value)}
            />
            {totalPrice > 0 && (
              <div className="flex items-center gap-1.5 px-1 pt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">
                  {t("createMember.form.totalPrice", "Total Price")}:{" "}
                  {formatPrice(totalPrice, currency, language)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
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
        </div>
      </form>
    </BaseModal>
  );
}

export default RenewSubscriptionModal;
