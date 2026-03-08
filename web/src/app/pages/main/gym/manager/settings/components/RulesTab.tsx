import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import { Card } from "../../../../../../../components/ui/Card";
import InputField from "../../../../../../../components/ui/InputField";
import SettingsTab from "../../../../../../components/settings/SettingsTab";

interface RulesTabProps {
  rules: string[];
  addRule: (rule: string) => void;
  removeRule: (index: number) => void;
}

export default function RulesTab({
  rules,
  addRule,
  removeRule,
}: RulesTabProps) {
  const { t } = useTranslation();
  const [newRule, setNewRule] = useState("");

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.trim()) return;

    addRule(newRule);
    setNewRule("");
  };

  return (
    <SettingsTab
      title={t("extra.gymSettings.tabs.rules", "Rules Settings")}
      description={t(
        "extra.gymSettings.rules.description",
        "Set the rules and policies for your gym members.",
      )}
      icon={BookOpen}
    >
      {/* Add Rule Form */}
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("extra.gymSettings.rules.addNew", "Add New Rule")}
        </h4>
        <form
          onSubmit={handleAddRule}
          className="flex items-stretch gap-3 mb-8"
        >
          <div className="flex-1">
            <InputField
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder={t(
                "extra.gymSettings.rules.placeholder",
                "Enter a new rule...",
              )}
              className="h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={!newRule.trim()}
            className="h-12 px-6"
            icon={<Plus className="w-4 h-4" />}
          >
            {t("common.add", "Add")}
          </Button>
        </form>
      </div>

      {/* Rules List */}
      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider opacity-70">
          {t("extra.gymSettings.rules.configuredRules", "Configured Rules")}
        </h4>
        <Card className="overflow-hidden bg-surface-hover/30">
          {rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 rounded-full bg-border/20 mb-4">
                <BookOpen className="w-8 h-8 text-text-secondary opacity-50" />
              </div>
              <p className="text-text-secondary font-medium">
                {t(
                  "extra.gymSettings.rules.noRules",
                  "No rules have been set yet.",
                )}
              </p>
              <p className="text-text-secondary/70 text-sm mt-1">
                {t(
                  "extra.gymSettings.rules.noRulesHint",
                  "Add your first rule above to get started.",
                )}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className="group flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white text-sm font-bold shadow-sm">
                      {index + 1}
                    </span>
                    <span className="text-text-primary font-medium">
                      {rule}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRule(index)}
                    className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Rules Count */}
      {rules.length > 0 && (
        <p className="text-xs text-text-secondary text-right pt-2">
          {t("extra.gymSettings.rules.count", "{{count}} rule(s) configured", {
            count: rules.length,
          })}
        </p>
      )}
    </SettingsTab>
  );
}
