import { useTranslation } from "react-i18next";
import { useGymStore } from "../store/gym";
import { capitalize } from "../utils/helper";
import { useGymSubscriptionTypes } from "./useGymSubscriptionTypes";

export function useGymSubscriptionOptions(selectedPlanId?: string) {
  const { t } = useTranslation();
  const { data: plans } = useGymSubscriptionTypes();

  const subscriptionTypeOptions =
    plans?.map((plan) => ({
      value: plan._id,
      label:
        plan.customName ||
        (plan.services && plan.services.length > 0
          ? plan.services
              .map((s) => t(`settings.gym.services.${s}`, s))
              .join(", ")
          : t("pricing.form.regularPlan", "Regular Plan")),
    })) || [];

  const selectedPlan = plans?.find((p) => p._id === selectedPlanId);

  const durationOptions =
    selectedPlan?.pricingTiers
      .flatMap((tier) => {
        const options = [];
        const presetValue = `${tier.duration}_${tier.durationUnit}`;

        options.push({
          value: presetValue,
          label: t(
            `renewSubscription.duration.${presetValue}`,
            presetValue.replace("_", " "),
          ),
        });

        // Add multiples if it's a base tier (duration 1)
        if (tier.duration === 1 && (selectedPlan as any).allowedIntervals) {
          (selectedPlan as any).allowedIntervals
            .filter((i: number) => i > 1)
            .forEach((multiple: number) => {
              const multipleValue = `${multiple * tier.duration}_${tier.durationUnit}`;
              // Avoid duplicates if a tier already exists for this duration
              if (
                !selectedPlan.pricingTiers.some(
                  (t) =>
                    t.duration === multiple * tier.duration &&
                    t.durationUnit === tier.durationUnit,
                )
              ) {
                options.push({
                  value: multipleValue,
                  label: t(
                    `renewSubscription.duration.${multipleValue}`,
                    multipleValue.replace("_", " "),
                  ),
                });
              }
            });
        }

        return options;
      })
      .sort((a, b) => {
        // Simple sort by duration if possible
        const aVal = parseInt(a.value.split("_")[0]);
        const bVal = parseInt(b.value.split("_")[0]);
        return aVal - bVal;
      }) || [];

  const { currentGym } = useGymStore();

  const paymentMethods = currentGym?.settings?.paymentMethods || ["cash"];

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method,
    label: capitalize(t(`common.paymentMethods.${method}`, method)),
  }));

  return {
    subscriptionTypeOptions,
    durationOptions,
    paymentMethodOptions,
    selectedPlan, // Expose selectedPlan
  };
}
