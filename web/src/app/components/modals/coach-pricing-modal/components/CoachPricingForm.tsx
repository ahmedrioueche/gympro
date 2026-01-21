import {
  type CoachPricingTierDto,
  type CoachServiceType,
  type Currency,
  type SubscriptionPeriodUnit,
} from "@ahmedrioueche/gympro-client";
import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import InputField from "../../../../../components/ui/InputField";

interface CoachPricingFormProps {
  formData: CoachPricingTierDto;
  setFormData: Dispatch<SetStateAction<CoachPricingTierDto>>;
  options: {
    serviceTypes: { value: string; label: string }[];
    durationUnits: { value: string; label: string }[];
    currencies: { value: string; label: string }[];
  };
}

export function CoachPricingForm({
  formData,
  setFormData,
  options,
}: CoachPricingFormProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Service Type */}
      <CustomSelect
        label={t("coachPricing.form.serviceType")}
        selectedOption={formData.serviceType}
        onChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            serviceType: value as CoachServiceType,
          }))
        }
        options={options.serviceTypes}
      />

      {/* Name */}
      <InputField
        label={t("coachPricing.form.name")}
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder={t("coachPricing.form.namePlaceholder")}
      />

      {/* Description */}
      <InputField
        label={t("coachPricing.form.description")}
        value={formData.description || ""}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder={t("coachPricing.form.descriptionPlaceholder")}
      />

      {/* Duration */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={t("coachPricing.form.duration")}
          type="number"
          min={1}
          value={formData.duration}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              duration: parseInt(e.target.value) || 1,
            }))
          }
        />
        <CustomSelect
          title={t("coachPricing.form.durationUnit")}
          selectedOption={formData.durationUnit}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              durationUnit: value as SubscriptionPeriodUnit,
            }))
          }
          options={options.durationUnits}
        />
      </div>

      {/* Price & Currency */}
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label={t("coachPricing.form.price")}
          type="number"
          min={0}
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              price: parseFloat(e.target.value) || 0,
            }))
          }
        />
        <CustomSelect
          title={t("coachPricing.form.currency")}
          selectedOption={formData.currency}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, currency: value as Currency }))
          }
          options={options.currencies}
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between p-4 bg-surface-hover rounded-xl">
        <div>
          <p className="text-sm font-medium text-text-primary">
            {t("coachPricing.form.isActive")}
          </p>
          <p className="text-xs text-text-secondary">
            {t("coachPricing.form.isActiveHint")}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
          }
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            formData.isActive ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              formData.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
