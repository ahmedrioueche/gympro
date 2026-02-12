import { PAYMENT_METHODS } from "@ahmedrioueche/gympro-client";
import { Check, CreditCard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import InputField from "../../../../../../../components/ui/InputField";

interface PaymentsTabProps {
  paymentMethods: string[];
  togglePaymentMethod: (method: string) => void;
  addPaymentMethod: (method: string) => void;
  removePaymentMethod: (index: number) => void;
}

export default function PaymentsTab({
  paymentMethods,
  togglePaymentMethod,
  addPaymentMethod,
  removePaymentMethod,
}: PaymentsTabProps) {
  const { t } = useTranslation();
  const [customMethod, setCustomMethod] = useState("");

  const standardMethods = PAYMENT_METHODS;
  const customMethods = paymentMethods.filter(
    (m) => !standardMethods.includes(m as any),
  );

  const handleAddCustom = () => {
    if (customMethod.trim()) {
      addPaymentMethod(customMethod.trim());
      setCustomMethod("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <CreditCard className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("settings.gym.tabs.payments", "Payment Methods")}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {t(
              "settings.gym.payments.description",
              "Configure and manage the payment options available for your members.",
            )}
          </p>
        </div>
      </div>

      {/* Standard Methods Container */}
      <div className="pt-2">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.gym.payments.standardMethods", "Standard Methods")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.gym.payments.standardMethodsDesc",
            "Enable or disable commonly used payment methods.",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {standardMethods.map((method) => {
            const isEnabled = paymentMethods.includes(method);
            return (
              <button
                key={method}
                type="button"
                onClick={() => togglePaymentMethod(method)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                  isEnabled
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-surface-hover hover:border-primary/30"
                }`}
              >
                <span className="text-sm font-semibold capitalize text-text-primary">
                  {t(`common.paymentMethods.${method}`, method)}
                </span>
                {isEnabled && (
                  <div className="p-1 bg-primary rounded-full">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Methods Container */}
      <div className="pt-8 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-1 uppercase tracking-wider opacity-70">
          {t("settings.gym.payments.customMethods", "Custom Methods")}
        </h4>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.gym.payments.customMethodsDesc",
            "Add your own custom payment methods unique to your gym.",
          )}
        </p>

        <div className="space-y-4 max-w-lg">
          {/* Add Custom Method Input */}
          <div className="flex gap-2">
            <div className="flex-1">
              <InputField
                label=""
                placeholder={t(
                  "settings.gym.payments.customPlaceholder",
                  "e.g. Bank Transfer",
                )}
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCustom()}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddCustom}
              disabled={!customMethod.trim()}
              icon={<Plus className="w-4 h-4" />}
              size="lg"
            >
              {t("common.add", "Add")}
            </Button>
          </div>

          {/* List of Custom Methods */}
          <div className="grid gap-2 mt-4">
            {customMethods.map((method) => {
              const originalIndex = paymentMethods.indexOf(method);
              return (
                <div
                  key={method}
                  className="flex items-center justify-between p-3 bg-surface-hover rounded-xl border border-border group"
                >
                  <span className="text-sm font-medium text-text-primary underline decoration-primary/30 underline-offset-4">
                    {method}
                  </span>
                  <button
                    onClick={() => removePaymentMethod(originalIndex)}
                    className="p-2 text-text-secondary hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {customMethods.length === 0 && (
            <div className="p-4 bg-surface-hover/50 rounded-xl border border-dashed border-border text-center">
              <p className="text-xs text-text-secondary italic">
                {t("settings.gym.payments.noCustom", "No custom methods added")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
