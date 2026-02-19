import type { CreateAppPlanDto } from "@ahmedrioueche/gympro-client";
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

  return (
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
        disabled={isEdit}
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
  );
}
