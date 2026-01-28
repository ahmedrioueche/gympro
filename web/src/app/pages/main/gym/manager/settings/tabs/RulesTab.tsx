import { GymSettings } from "@ahmedrioueche/gympro-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../../components/ui/Button";
import { Card } from "../../../../../../components/ui/Card";
import ErrorSection from "../../../../../../components/ui/ErrorSection";
import { InputField } from "../../../../../../components/ui/InputField";
import Loading from "../../../../../../components/ui/Loading";
import { useGym } from "../../../../../../hooks/useGym";
import { usePermissions } from "../../../../../../hooks/usePermissions";
import { gymApi } from "../../../../../../services/gym";
import { ShowStatusToast } from "../../../../../../utils/statusMessage";

export default function RulesTab() {
  const { t } = useTranslation();
  const { currentGymId, gym, isLoading: isGymLoading } = useGym();
  const { hasPermission } = usePermissions();
  const queryClient = useQueryClient();
  const [newRule, setNewRule] = useState("");

  const canManage = hasPermission("settings:manage");
  const rules = gym?.settings?.rules || [];

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<GymSettings>) => {
      if (!currentGymId) throw new Error("No gym ID");
      return gymApi.updateSettings(currentGymId, newSettings);
    },
    onSuccess: (res) => {
      if (res.success) {
        ShowStatusToast(t("gym.settings.updateSuccess"), "success");
        queryClient.invalidateQueries({ queryKey: ["gym", currentGymId] });
      } else {
        ShowStatusToast(res.message || t("common.error"), "error");
      }
    },
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;

    const updatedRules = [...rules, newRule.trim()];
    updateSettingsMutation.mutate({ rules: updatedRules });
    setNewRule("");
  };

  const handleRemoveRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    updateSettingsMutation.mutate({ rules: updatedRules });
  };

  if (isGymLoading) return <Loading />;
  if (!gym) return <ErrorSection />;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-1">
        <h3 className="text-lg font-medium text-text-primary">
          {t("gym.settings.rules.title", "Gym Rules")}
        </h3>
        <p className="text-sm text-text-secondary">
          {t(
            "gym.settings.rules.description",
            "Set the rules and policies for your gym members.",
          )}
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {canManage && (
          <form onSubmit={handleAddRule} className="flex gap-2">
            <InputField
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder={t(
                "gym.settings.rules.placeholder",
                "Enter a new rule...",
              )}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!newRule.trim() || updateSettingsMutation.isPending}
              isLoading={updateSettingsMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("common.add")}
            </Button>
          </form>
        )}

        <div className="space-y-4">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-text-secondary border-2 border-dashed border-border rounded-xl">
              {t("gym.settings.rules.noRules", "No rules have been set yet.")}
            </div>
          ) : (
            <ul className="space-y-3">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className="group flex items-center justify-between p-3 bg-surface-hover rounded-lg border border-border transition-all hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-text-primary">{rule}</span>
                  </div>
                  {canManage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRule(index)}
                      className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
