import type { CreateAppPlanDto } from "@ahmedrioueche/gympro-client";
import { Infinity } from "lucide-react";
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
          rightIcon={
            formData.limits.maxGyms === 0 ? (
              <Infinity className="w-5 h-5 text-primary" />
            ) : null
          }
        />
        <InputField
          label={t("common.members")}
          type="number"
          value={formData.limits.maxMembers || 0}
          onChange={(e) => handleLimitChange("maxMembers", e.target.value)}
          rightIcon={
            formData.limits.maxMembers === 0 ? (
              <Infinity className="w-5 h-5 text-primary" />
            ) : null
          }
        />
        <InputField
          label={t("common.gems")}
          type="number"
          value={formData.limits.maxGems || 0}
          onChange={(e) => handleLimitChange("maxGems", e.target.value)}
          rightIcon={
            formData.limits.maxGems === 0 ? (
              <Infinity className="w-5 h-5 text-primary" />
            ) : null
          }
        />
      </div>
      {(formData.limits.maxGyms === 0 ||
        formData.limits.maxMembers === 0 ||
        formData.limits.maxGems === 0) && (
        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
          <Infinity className="w-3 h-3" />
          {t(
            "admin.pricing.zeroIsInfinity",
            "Setting 0 means unlimited (infinity)",
          )}
        </p>
      )}
    </div>
  );
}
