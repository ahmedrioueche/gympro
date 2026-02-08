import {
  formatPrice,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";
import { useLanguageStore } from "../../../../../../../store/language";
import { capitalize, formatDuration } from "../../../../../../../utils/helper";

interface MemberPricingCardProps {
  plan: SubscriptionType;
}

export const MemberPricingCard = ({ plan }: MemberPricingCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { currentGym } = useGymStore();

  const currency = currentGym?.settings?.defaultCurrency || "USD";

  if (!plan.isAvailable) return null;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 transition-all hover:border-primary/50 flex flex-col shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-text-primary mb-1">
          {(plan.customName && capitalize(plan.customName)) ||
            (plan.services && plan.services.length > 0
              ? plan.services
                  .map((s) => {
                    const SERVICE_LABELS: Record<string, string> = {
                      gym: t("settings.gym.services.gym", "Gym"),
                      cardio: t("settings.gym.services.cardio", "Cardio"),
                      crossfit: t("settings.gym.services.crossfit", "CrossFit"),
                      swimming: t("settings.gym.services.swimming", "Swimming"),
                      boxing: t("settings.gym.services.boxing", "Boxing"),
                      yoga: t("settings.gym.services.yoga", "Yoga"),
                      sauna: t("settings.gym.services.sauna", "Sauna"),
                      massage: t("settings.gym.services.massage", "Massage"),
                    };
                    return SERVICE_LABELS[s] || s;
                  })
                  .join(" + ")
              : t("pricing.form.regularPlan", "Regular Plan"))}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary mb-6 line-clamp-3 min-h-[3rem]">
        {plan.description || t("common.noDescription")}
      </p>

      {/* Pricing Tiers */}
      <div className="flex-1 space-y-3">
        {plan.pricingTiers.map((tier, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-muted/20 rounded-2xl px-4 py-3 border border-border/50"
          >
            <span className="text-sm text-text-secondary font-medium">
              {formatDuration(tier.duration, tier.durationUnit, t)}
            </span>
            <span className="text-lg font-bold text-text-primary">
              {formatPrice(tier.price, currency, language)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
