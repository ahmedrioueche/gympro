import {
  CURRENCY_SYMBOLS,
  type CreateSubscriptionTypeDto,
  type PricingTier,
} from "@ahmedrioueche/gympro-client";
import { Info, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../../components/ui/InputField";
import TextArea from "../../../../../../../components/ui/TextArea";
import Tooltip from "../../../../../../../components/ui/Tooltip";
import { useGymStore } from "../../../../../../../store/gym";
import { DURATION_PRESETS } from "../utils";

export interface PricingFormData {
  customName?: string;
  description?: string;
  isAvailable: boolean;
  services: string[];
}

interface PricingFormProps {
  formId: string;
  defaultValues?: Partial<PricingFormData>;
  initialTiers?: PricingTier[];
  onSubmit: (data: CreateSubscriptionTypeDto) => void;
}

export const PricingForm = ({
  formId,
  defaultValues,
  initialTiers,
  onSubmit,
}: PricingFormProps) => {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const currency = currentGym?.settings?.defaultCurrency || "USD";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PricingFormData>({
    defaultValues: {
      isAvailable: true,
      services: [],
      ...defaultValues,
    },
  });

  const [tiers, setTiers] = useState<PricingTier[]>(
    initialTiers && initialTiers.length > 0
      ? initialTiers
      : [{ duration: 1, durationUnit: "month", price: 0 }],
  );

  const selectedServices = watch("services") || [];

  const gymServices = currentGym?.settings?.servicesOffered || [];

  const toggleService = (serviceId: string) => {
    const current = watch("services") || [];
    if (current.includes(serviceId)) {
      setValue(
        "services",
        current.filter((s) => s !== serviceId),
      );
    } else {
      setValue("services", [...current, serviceId]);
    }
  };

  const SERVICE_LABELS: Record<string, string> = {
    gym: t("settings.gym.services.gym", "General Gym Access"),
    cardio: t("settings.gym.services.cardio", "Cardio Training"),
    crossfit: t("settings.gym.services.crossfit", "CrossFit"),
    swimming: t("settings.gym.services.swimming", "Swimming Pool"),
    boxing: t("settings.gym.services.boxing", "Boxing / MMA"),
    yoga: t("settings.gym.services.yoga", "Yoga & Pilates"),
    sauna: t("settings.gym.services.sauna", "Sauna & Spa"),
    massage: t("settings.gym.services.massage", "Massage Therapy"),
  };

  useEffect(() => {
    if (defaultValues) {
      reset({
        customName: defaultValues.customName,
        description: defaultValues.description,
        isAvailable:
          defaultValues.isAvailable !== undefined
            ? defaultValues.isAvailable
            : true,
        services: defaultValues.services || [],
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (initialTiers && initialTiers.length > 0) {
      setTiers(initialTiers);
    } else {
      setTiers([{ duration: 1, durationUnit: "month", price: 0 }]);
    }
  }, [initialTiers]);

  const addTier = () => {
    setTiers([...tiers, { duration: 1, durationUnit: "month", price: 0 }]);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    setTiers(
      tiers.map((tier, i) => (i === index ? { ...tier, ...updates } : tier)),
    );
  };

  const onFormSubmit = (data: PricingFormData) => {
    const submitData: CreateSubscriptionTypeDto = {
      ...data,
      pricingTiers: tiers,
    };
    onSubmit(submitData);
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6"
    >
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4">
        <InputField
          label={t("pricing.form.customName", "Plan Name")}
          {...register("customName")}
          placeholder={t(
            "pricing.form.customNamePlaceholder",
            "e.g. Gold Membership, Pro Pack...",
          )}
          error={errors.customName?.message}
        />
      </div>

      <CustomSelect
        title={t("pricing.form.visibility")}
        selectedOption={watch("isAvailable") ? "active" : "hidden"}
        onChange={(val) => setValue("isAvailable", val === "active")}
        options={[
          { value: "active", label: t("pricing.form.available") },
          { value: "hidden", label: t("pricing.form.hidden") },
        ]}
      />

      {/* Linked Services */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-secondary">
          {t("pricing.form.linkedServices", "Included Services")}
        </label>
        {gymServices.length === 0 ? (
          <p className="text-xs text-text-secondary italic">
            {t(
              "pricing.form.noServicesConfigured",
              "No services configured in gym settings. Go to Settings > Services to add them.",
            )}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {gymServices.map((service) => {
              const isSelected = selectedServices.includes(service);
              const label = SERVICE_LABELS[service] || service;
              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border-2 transition-all duration-200 capitalize ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pricing Tiers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-secondary">
            {t("pricing.form.pricingTiers")}
          </label>
          <button
            type="button"
            onClick={addTier}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("pricing.form.addTier")}
          </button>
        </div>

        <div className="space-y-2">
          {tiers.map((tier, index) => {
            const presetValue =
              DURATION_PRESETS.find(
                (p) =>
                  p.duration === tier.duration && p.unit === tier.durationUnit,
              )?.value || "1_month";

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-surface-secondary rounded-lg border border-border"
              >
                <div className="w-[60%]">
                  <CustomSelect
                    title={t("pricing.form.duration")}
                    selectedOption={presetValue}
                    onChange={(val) => {
                      const preset = DURATION_PRESETS.find(
                        (p) => p.value === val,
                      );
                      if (preset) {
                        updateTier(index, {
                          duration: preset.duration,
                          durationUnit: preset.unit,
                        });
                      }
                    }}
                    options={DURATION_PRESETS.map((preset) => ({
                      value: preset.value,
                      label: t(`renewSubscription.duration.${preset.value}`),
                    }))}
                  />
                </div>
                <div className="w-32">
                  <InputField
                    label={t("pricing.form.price")}
                    type="number"
                    value={tier.price}
                    onChange={(e) =>
                      updateTier(index, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <span className="font-bold text-text-primary whitespace-nowrap">
                    {CURRENCY_SYMBOLS[
                      currency as keyof typeof CURRENCY_SYMBOLS
                    ] || currency}
                  </span>
                  <Tooltip content={t("pricing.form.currencyTip")}>
                    <Info className="w-4 h-4 text-text-secondary cursor-help hover:text-primary transition-colors" />
                  </Tooltip>
                </div>
                {tiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTier(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <TextArea
        label={t("pricing.form.description")}
        {...register("description")}
        className="h-24 py-3"
        placeholder={t("createMember.form.notes.placeholder")}
        error={errors.description?.message}
      />
    </form>
  );
};
