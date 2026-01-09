import {
  formatPrice,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";
import { useLanguageStore } from "../../../../../../../store/language";

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
          {plan.customName ||
            t(`createMember.form.subscription.${plan.baseType}`, {
              defaultValue: plan.baseType,
            })}
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
              {tier.duration} {t(`pricing.form.units.${tier.durationUnit}`)}
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
