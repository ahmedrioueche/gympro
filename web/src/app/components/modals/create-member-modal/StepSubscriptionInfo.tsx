import {
  type SubscriptionType,
  formatPrice,
} from "@ahmedrioueche/gympro-client";
import { CheckCircle2, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../components/ui/CustomSelect";
import InputField from "../../../../components/ui/InputField";
import { useGymStore } from "../../../../store/gym";
import { useLanguageStore } from "../../../../store/language";

interface FormData {
  subscriptionTypeId: string;
  subscriptionStartDate: string;
  subscriptionDuration: string;
  paymentMethod: string;
}

interface StepSubscriptionInfoProps {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  subscriptionOptions: { value: string; label: string }[];
  durationOptions: { value: string; label: string }[];
  paymentMethodOptions: { value: string; label: string }[];
  selectedPlan?: SubscriptionType;
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
  durationOptions,
  paymentMethodOptions,
  selectedPlan,
  errors,
}: StepSubscriptionInfoProps) {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { language } = useLanguageStore();
  const currency = currentGym?.settings?.defaultCurrency || "USD";

  const calculateTotalPrice = () => {
    if (!selectedPlan || !formData.subscriptionDuration) return 0;
    const [duration, unit] = formData.subscriptionDuration.split("_");
    const count = parseInt(duration);

    const tier = selectedPlan.pricingTiers.find(
      (t) => t.duration === count && t.durationUnit === unit,
    );
    if (tier) return tier.price;

    const baseTier = selectedPlan.pricingTiers.find(
      (t) => t.duration === 1 && t.durationUnit === unit,
    );
    if (baseTier) return baseTier.price * count;

    return 0;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <CustomSelect
              title={t("createMember.form.subscription.label")}
              options={subscriptionOptions}
              selectedOption={formData.subscriptionTypeId}
              onChange={(value) =>
                handleInputChange("subscriptionTypeId", value)
              }
            />
            {errors.subscriptionTypeId && (
              <p className="text-danger text-sm">{errors.subscriptionTypeId}</p>
            )}
          </div>

          {/* Plan Details Card - Now under selector */}
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
                  {selectedPlan.pricingTiers
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
              title={t("renewSubscription.duration.label")}
              options={durationOptions}
              selectedOption={formData.subscriptionDuration}
              onChange={(value) =>
                handleInputChange("subscriptionDuration", value)
              }
            />
            {/* Price Display under Duration */}
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
    </div>
  );
}

export default StepSubscriptionInfo;
