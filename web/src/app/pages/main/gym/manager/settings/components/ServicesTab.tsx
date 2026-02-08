import { CreditCard, Dumbbell, Globe, Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import InputField from "../../../../../../../components/ui/InputField";

interface ServicesTabProps {
  paymentMethods: string[];
  setPaymentMethods: (value: string[]) => void;
  servicesOffered: string[];
  addService: (service: string) => void;
  removeService: (index: number) => void;
  toggleService: (service: string) => void;
  allowCustomSubscriptions: boolean;
  setAllowCustomSubscriptions: (value: boolean) => void;
}

const PREDEFINED_SERVICES = [
  { id: "gym", label: "General Gym Access" },
  { id: "cardio", label: "Cardio Training" },
  { id: "crossfit", label: "CrossFit" },
  { id: "swimming", label: "Swimming Pool" },
  { id: "boxing", label: "Boxing / MMA" },
  { id: "yoga", label: "Yoga & Pilates" },
  { id: "sauna", label: "Sauna & Spa" },
  { id: "massage", label: "Massage Therapy" },
];

export default function ServicesTab({
  paymentMethods,
  setPaymentMethods,
  servicesOffered,
  addService,
  removeService,
  toggleService,
  allowCustomSubscriptions,
  setAllowCustomSubscriptions,
}: ServicesTabProps) {
  const { t } = useTranslation();
  const [newService, setNewService] = useState("");

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(
      paymentMethods.includes(method)
        ? paymentMethods.filter((m) => m !== method)
        : [...paymentMethods, method],
    );
  };

  const handleAddService = () => {
    if (newService.trim()) {
      addService(newService.trim());
      setNewService("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddService();
    }
  };

  // Predefined service IDs for checking
  const predefinedIds = PREDEFINED_SERVICES.map((s) => s.id);

  // Custom services are those that aren't in the predefined list
  const customServices = servicesOffered.filter(
    (s) => !predefinedIds.includes(s),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t(
            "settings.gym.services.paymentMethods",
            "Accepted Payment Methods",
          )}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.services.paymentMethodsDesc",
            "Select which payment methods your gym accepts",
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              id: "cash",
              label: t("settings.gym.services.cash", "Cash"),
              icon: CreditCard,
            },
            {
              id: "card",
              label: t("settings.gym.services.card", "Card"),
              icon: CreditCard,
            },
            {
              id: "online",
              label: t("settings.gym.services.online", "Online Payment"),
              icon: Globe,
            },
          ].map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethods.includes(method.id);
            return (
              <button
                key={method.id}
                onClick={() => togglePaymentMethod(method.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 gap-2 ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50 text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t("settings.gym.services.servicesOffered", "Services Offered")}
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          {t(
            "settings.gym.services.servicesOfferedDesc",
            "Select common services or add your own custom ones",
          )}
        </p>

        {/* Quick Select Section */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-tight mb-4">
            {t(
              "settings.gym.services.quickSelect",
              "Quick Select Common Services",
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PREDEFINED_SERVICES.map((service) => {
              const isSelected = servicesOffered.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  <span className="text-xs font-bold text-center">
                    {service.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Service Input */}
        <div className="mb-8 p-6 bg-surface-hover/30 rounded-2xl border border-border/50">
          <h4 className="text-xs font-bold text-text-secondary uppercase tracking-tight mb-4">
            {t(
              "settings.gym.services.customServices",
              "Add Other Custom Services",
            )}
          </h4>
          <div className="flex gap-2 max-w-md">
            <div className="flex-1">
              <InputField
                placeholder={t(
                  "settings.gym.services.addPlaceholder",
                  "Enter service name...",
                )}
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <Button
              onClick={handleAddService}
              icon={<Plus className="w-4 h-4" />}
              className="h-[46px]"
            >
              {t("common.add", "Add")}
            </Button>
          </div>

          {/* List of Custom Services */}
          {customServices.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {customServices.map((service) => (
                <div
                  key={service}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg"
                >
                  <span className="text-xs font-bold capitalize">
                    {service}
                  </span>
                  <button
                    onClick={() => {
                      const idx = servicesOffered.indexOf(service);
                      if (idx !== -1) removeService(idx);
                    }}
                    className="p-0.5 hover:bg-primary/20 rounded transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary of all selected services */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
            {t("settings.gym.services.summary", "Current Selection Overview")}
          </p>
          <div className="flex flex-wrap gap-2">
            {servicesOffered.length > 0 ? (
              servicesOffered.map((service) => {
                const label =
                  PREDEFINED_SERVICES.find((s) => s.id === service)?.label ||
                  service;
                return (
                  <span
                    key={service}
                    className="px-2 py-0.5 bg-background text-text-secondary text-[10px] font-medium rounded border border-border capitalize"
                  >
                    {label}
                  </span>
                );
              })
            ) : (
              <span className="text-xs italic text-text-secondary">
                {t(
                  "settings.gym.services.noneSelected",
                  "No services selected",
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t(
            "settings.gym.services.customSubscriptions",
            "Custom Subscriptions",
          )}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.services.customSubscriptionsDesc",
            "Allow creation of custom subscription types",
          )}
        </p>

        <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl border border-border">
          <input
            type="checkbox"
            id="allowCustom"
            checked={allowCustomSubscriptions}
            onChange={(e) => setAllowCustomSubscriptions(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <div className="flex-1">
            <label
              htmlFor="allowCustom"
              className="text-sm font-medium text-text-primary cursor-pointer"
            >
              {t(
                "settings.gym.services.allowCustom",
                "Allow Custom Subscriptions",
              )}
            </label>
            <p className="text-xs text-text-secondary mt-0.5">
              {t(
                "settings.gym.services.allowCustomDesc",
                "Enable gym owners to create custom subscription plans",
              )}
            </p>
          </div>
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
