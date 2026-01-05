import { CreditCard, Dumbbell, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ServicesTabProps {
  paymentMethods: string[];
  setPaymentMethods: (value: string[]) => void;
  servicesOffered: string[];
  setServicesOffered: (value: string[]) => void;
  allowCustomSubscriptions: boolean;
  setAllowCustomSubscriptions: (value: boolean) => void;
}

export default function ServicesTab({
  paymentMethods,
  setPaymentMethods,
  servicesOffered,
  setServicesOffered,
  allowCustomSubscriptions,
  setAllowCustomSubscriptions,
}: ServicesTabProps) {
  const { t } = useTranslation();

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods(
      paymentMethods.includes(method)
        ? paymentMethods.filter((m) => m !== method)
        : [...paymentMethods, method]
    );
  };

  const toggleService = (service: string) => {
    setServicesOffered(
      servicesOffered.includes(service)
        ? servicesOffered.filter((s) => s !== service)
        : [...servicesOffered, service]
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t(
            "settings.gym.services.paymentMethods",
            "Accepted Payment Methods"
          )}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.services.paymentMethodsDesc",
            "Select which payment methods your gym accepts"
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
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.services.servicesOfferedDesc",
            "Select the types of subscriptions available at your gym"
          )}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              id: "gym",
              label: t("settings.gym.services.gym", "General Gym Access"),
            },
            {
              id: "cardio",
              label: t("settings.gym.services.cardio", "Cardio Training"),
            },
            {
              id: "crossfit",
              label: t("settings.gym.services.crossfit", "CrossFit"),
            },
            {
              id: "swimming",
              label: t("settings.gym.services.swimming", "Swimming"),
            },
          ].map((service) => {
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
                <span className="text-sm font-medium text-center">
                  {service.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {t(
            "settings.gym.services.customSubscriptions",
            "Custom Subscriptions"
          )}
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          {t(
            "settings.gym.services.customSubscriptionsDesc",
            "Allow creation of custom subscription types"
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
                "Allow Custom Subscriptions"
              )}
            </label>
            <p className="text-xs text-text-secondary mt-0.5">
              {t(
                "settings.gym.services.allowCustomDesc",
                "Enable gym owners to create custom subscription plans"
              )}
            </p>
          </div>
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
