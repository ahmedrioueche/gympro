import type { CreateAppPlanDto } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";

interface PlanLimitsProps {
  formData: CreateAppPlanDto;
  handleLimitChange: (
    field: keyof CreateAppPlanDto["limits"],
    value: string,
  ) => void;
}

export function PlanLimits({ formData, handleLimitChange }: PlanLimitsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
        {t("admin.pricing.limits")}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label={t("common.gyms")}
          type="number"
          value={formData.limits.maxGyms || 0}
          onChange={(e) => handleLimitChange("maxGyms", e.target.value)}
        />
        <InputField
          label={t("common.members")}
          type="number"
          value={formData.limits.maxMembers || 0}
          onChange={(e) => handleLimitChange("maxMembers", e.target.value)}
        />
        <InputField
          label={t("common.gems")}
          type="number"
          value={formData.limits.maxGems || 0}
          onChange={(e) => handleLimitChange("maxGems", e.target.value)}
        />
      </div>
    </div>
  );
}
