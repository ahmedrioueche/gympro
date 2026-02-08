import {
  formatPrice,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";
import { useLanguageStore } from "../../../../../../../store/language";
import { capitalize, formatDuration } from "../../../../../../../utils/helper";

interface PricingCardProps {
  plan: SubscriptionType;
  onEdit: (plan: SubscriptionType) => void;
  onDelete: (plan: SubscriptionType) => void;
}

export const PricingCard = ({ plan, onEdit, onDelete }: PricingCardProps) => {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { currentGym } = useGymStore();

  const currency = currentGym?.settings?.defaultCurrency || "USD";

  return (
    <div className="bg-surface border border-border rounded-xl p-6 relative group transition-all hover:border-primary/50 overflow-hidden flex flex-col">
      {!plan.isAvailable && (
        <div className="absolute top-0 right-0 bg-stone-500/10 text-stone-500 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider">
          {t("pricing.form.hidden")}
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-1">
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

        {/* Linked Services Badges */}
        {plan.services && plan.services.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {plan.services.map((service, idx) => {
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
              const label = SERVICE_LABELS[service] || service;
              const colors = [
                "bg-blue-500/10 text-blue-400 border-blue-500/20",
                "bg-purple-500/10 text-purple-400 border-purple-500/20",
                "bg-orange-500/10 text-orange-400 border-orange-500/20",
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              ];
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border capitalize ${colors[idx % colors.length]}`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-400 mb-6 line-clamp-2">
        {plan.description || t("common.noDescription")}
      </p>

      {/* Pricing Tiers */}
      <div className="flex-1 space-y-3 mb-6">
        {plan.pricingTiers.map((tier, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
          >
            <span className="text-sm text-zinc-300 font-medium">
              {formatDuration(tier.duration, tier.durationUnit, t)}
            </span>
            <span className="text-lg font-bold text-white">
              {formatPrice(tier.price, currency, language)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/5 mt-auto">
        <button
          onClick={() => onEdit(plan)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-semibold"
        >
          <Edit2 className="w-4 h-4" />
          {t("common.edit")}
        </button>
        <button
          onClick={() => onDelete(plan)}
          className="flex items-center justify-center px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
