import {
  COACH_SERVICE_TYPES,
  CURRENCIES,
  SUBSCRIPTION_PERIOD_UNITS,
  type CoachPricingTierDto,
  type Currency,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../store/modal";
import {
  useCoachPricing,
  useCreatePricing,
  useUpdatePricing,
} from "../../../pages/main/coach/pricing/hooks/useCoachPricing";

export function useCoachPricingModal() {
  const { t } = useTranslation();
  const { currentModal, coachPricingProps, closeModal } = useModalStore();
  const isOpen = currentModal === "coach_pricing";
  const pricingId = coachPricingProps?.pricingId;
  const isEditMode = !!pricingId;

  const { data: pricingList } = useCoachPricing({ enabled: isOpen });
  const createMutation = useCreatePricing();
  const updateMutation = useUpdatePricing();

  const [formData, setFormData] = useState<CoachPricingTierDto>({
    serviceType: "training",
    name: "",
    description: "",
    duration: 1,
    durationUnit: "month",
    price: 0,
    currency: "USD" as Currency,
    isActive: true,
  });

  // Load existing data for edit mode
  useEffect(() => {
    if (isEditMode && pricingList) {
      const existing = pricingList.find((p) => p._id === pricingId);
      if (existing) {
        setFormData({
          serviceType: existing.serviceType,
          name: existing.name,
          description: existing.description || "",
          duration: existing.duration,
          durationUnit: existing.durationUnit,
          price: existing.price,
          currency: existing.currency,
          isActive: existing.isActive,
        });
      }
    } else {
      // Reset form for create mode
      setFormData({
        serviceType: "training",
        name: "",
        description: "",
        duration: 1,
        durationUnit: "month",
        price: 0,
        currency: "USD" as Currency,
        isActive: true,
      });
    }
  }, [isEditMode, pricingId, pricingList]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error(t("validation.required"));
      return;
    }

    try {
      if (isEditMode && pricingId) {
        await updateMutation.mutateAsync({ id: pricingId, data: formData });
        toast.success(t("coachPricing.pricingUpdated"));
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(t("coachPricing.pricingCreated"));
      }
      coachPricingProps?.onSuccess?.();
      closeModal();
    } catch {
      toast.error(
        isEditMode
          ? t("status.error.coach.pricing_update_error")
          : t("status.error.coach.pricing_create_error"),
      );
    }
  };

  // Safe access to constants with fallbacks to prevent crashes
  const safeServiceTypes = COACH_SERVICE_TYPES || [];
  const safeDurationUnits = SUBSCRIPTION_PERIOD_UNITS || [];
  const safeCurrencies = CURRENCIES || [];

  const serviceTypeOptions = safeServiceTypes.map((type) => ({
    value: type,
    label: t(`coachPricing.serviceTypes.${type}`),
  }));

  const durationUnitOptions = safeDurationUnits
    .filter((u) => u !== "year")
    .map((unit) => ({
      value: unit,
      label: t(`coachPricing.durationUnits.${unit}`),
    }));

  const currencyOptions = safeCurrencies.map((currency) => ({
    value: currency,
    label: currency,
  }));

  return {
    isOpen,
    isEditMode,
    formData,
    setFormData,
    handleSubmit,
    closeModal,
    isLoading: createMutation.isPending || updateMutation.isPending,
    options: {
      serviceTypes: serviceTypeOptions,
      durationUnits: durationUnitOptions,
      currencies: currencyOptions,
    },
  };
}
