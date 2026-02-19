import type { CreateAppPlanDto } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";

interface PlanPricingProps {
  formData: CreateAppPlanDto;
  handlePricingChange: (
    currency: "EUR" | "USD" | "DZD",
    cycle: "monthly" | "yearly",
    value: string,
  ) => void;
}

export function PlanPricing({
  formData,
  handlePricingChange,
}: PlanPricingProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
        {t("admin.pricing.pricing")}
      </h3>
      <div className="space-y-4">
        {(["EUR", "USD", "DZD"] as const).map((currency) => (
          <div key={currency} className="grid grid-cols-3 gap-4 items-end">
            <div className="text-sm font-medium text-text-secondary pt-2">
              {currency}
            </div>
            <InputField
              label={currency === "EUR" ? t("admin.pricing.monthly") : ""}
              type="number"
              value={formData.pricing[currency]?.monthly || 0}
              onChange={(e) =>
                handlePricingChange(currency, "monthly", e.target.value)
              }
              prefix={currency}
            />
            <InputField
              label={currency === "EUR" ? t("admin.pricing.yearly") : ""}
              type="number"
              value={formData.pricing[currency]?.yearly || 0}
              onChange={(e) =>
                handlePricingChange(currency, "yearly", e.target.value)
              }
              prefix={currency}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
