import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import { Card } from "../../../../../../../components/ui/Card";
import InputField from "../../../../../../../components/ui/InputField";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("gym.settings.rules.title", "Gym Rules")}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {t(
              "gym.settings.rules.description",
              "Set the rules and policies for your gym members.",
            )}
          </p>
        </div>
      </div>

      {/* Add Rule Form */}
      <form onSubmit={handleAddRule} className="flex items-stretch gap-3">
        <div className="flex-1">
          <InputField
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder={t(
              "gym.settings.rules.placeholder",
              "Enter a new rule...",
            )}
            className="h-12"
          />
        </div>
        <Button type="submit" disabled={!newRule.trim()} className="h-12 px-6">
          <Plus className="w-4 h-4 mr-2" />
          {t("common.add")}
        </Button>
      </form>

      {/* Rules List */}
      <Card className="overflow-hidden">
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="p-4 rounded-full bg-border/50 mb-4">
              <BookOpen className="w-8 h-8 text-text-secondary" />
            </div>
            <p className="text-text-secondary font-medium">
              {t("gym.settings.rules.noRules", "No rules have been set yet.")}
            </p>
            <p className="text-text-secondary/70 text-sm mt-1">
              {t(
                "gym.settings.rules.noRulesHint",
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
                  <span className="text-text-primary">{rule}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(index)}
                  className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Rules Count */}
      {rules.length > 0 && (
        <p className="text-xs text-text-secondary text-right">
          {t("gym.settings.rules.count", "{{count}} rule(s) configured", {
            count: rules.length,
          })}
        </p>
      )}
    </div>
  );
}
