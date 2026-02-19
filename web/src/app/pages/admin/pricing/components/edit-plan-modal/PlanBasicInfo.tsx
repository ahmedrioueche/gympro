import type { CreateAppPlanDto } from "@ahmedrioueche/gympro-client";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Checkbox from "../../../../../../components/ui/Checkbox";
import CustomSelect from "../../../../../../components/ui/CustomSelect";
import InputField from "../../../../../../components/ui/InputField";

interface PlanBasicInfoProps {
  formData: CreateAppPlanDto;
  setFormData: (data: CreateAppPlanDto) => void;
  isEdit: boolean;
}

export function PlanBasicInfo({
  formData,
  setFormData,
  isEdit,
}: PlanBasicInfoProps) {
  const { t } = useTranslation();
  const [showPaddle, setShowPaddle] = useState(
    !!(
      formData.paddleProductId ||
      formData.paddlePriceIds?.monthly ||
      formData.paddlePriceIds?.yearly
    ),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label={t("common.name")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Plan Name Key (e.g. plan.starter.name)"
        />
        <InputField
          label={t("common.description")}
          value={t(formData.description || "")}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description Key"
        />
        <div className="flex flex-col gap-1.5">
          <CustomSelect
            title={t("admin.pricing.level")}
            selectedOption={formData.level}
            onChange={(value) => setFormData({ ...formData, level: value })}
            options={[
              { value: "free", label: t("common.free") },
              { value: "starter", label: t("common.starter") },
              { value: "pro", label: t("common.pro") },
              { value: "premium", label: t("common.premium") },
            ]}
            className="w-full"
          />
        </div>
        <InputField
          label={t("admin.pricing.planId")}
          value={formData.planId}
          onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
          placeholder="subscription-starter"
        />
        <div className="col-span-1 md:col-span-2">
          <Checkbox
            id="is-active"
            checked={formData.isActive ?? true}
            onChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
            label={t("common.active", "Active")}
            description={t(
              "admin.pricing.activeDescription",
              "Inactive plans are hidden from users and cannot be subscribed to.",
            )}
          />
        </div>
      </div>

      {/* Paddle Integration */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPaddle(!showPaddle)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
        >
          <span className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            {t("admin.pricing.paddleIntegration", "Paddle Integration")}
          </span>
          <span
            className={`transform transition-transform ${showPaddle ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
        {showPaddle && (
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-4">
            <InputField
              label={t("admin.pricing.paddleProductId", "Product ID")}
              value={formData.paddleProductId || ""}
              onChange={(e) =>
                setFormData({ ...formData, paddleProductId: e.target.value })
              }
              placeholder="pro_01kcmb7nfehz..."
            />
            <InputField
              label={t(
                "admin.pricing.paddleMonthlyPriceId",
                "Monthly Price ID",
              )}
              value={formData.paddlePriceIds?.monthly || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paddlePriceIds: {
                    ...formData.paddlePriceIds,
                    monthly: e.target.value,
                  },
                })
              }
              placeholder="pri_01kcmbm4wfpq..."
            />
            <InputField
              label={t("admin.pricing.paddleYearlyPriceId", "Yearly Price ID")}
              value={formData.paddlePriceIds?.yearly || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paddlePriceIds: {
                    ...formData.paddlePriceIds,
                    yearly: e.target.value,
                  },
                })
              }
              placeholder="pri_01kcmc2fbgxq..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
