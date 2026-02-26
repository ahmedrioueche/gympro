import {
  formatPrice,
  type SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { Edit2, LayoutGrid, Trash2 } from "lucide-react";
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

  const getPlanName = () => {
    if (plan.customName) return capitalize(plan.customName);
    if (plan.services && plan.services.length > 0) {
      return plan.services
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
            coaching: t("settings.gym.services.coaching", "Coaching"),
          };
          return SERVICE_LABELS[s] || s;
        })
        .join(" + ");
    }
    return t("pricing.form.regularPlan", "Regular Plan");
  };

  return (
    <div className="group relative overflow-hidden flex flex-col rounded-3xl border border-border/50 bg-surface p-4 md:p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 h-full">
      {/* Background Gradient Glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-primary to-indigo-600 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />

      {!plan.isAvailable && (
        <div className="absolute top-0 right-0 bg-stone-500/10 text-stone-500 px-3 md:px-4 py-1.5 md:py-2 rounded-bl-2xl text-[10px] md:text-xs font-black uppercase tracking-widest z-10">
          {t("pricing.form.hidden")}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/10 shrink-0">
            <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-text-primary tracking-tight line-clamp-2">
              {getPlanName()}
            </h3>
            {plan.allowedDaysPerWeek && (
              <span className="text-[10px] md:text-xs text-primary font-bold mt-0.5 block uppercase tracking-wider">
                {plan.allowedDaysPerWeek}{" "}
                {t("pricing.card.daysPerWeek", "Days / Week")}
              </span>
            )}
          </div>
        </div>

        {/* Linked Services Badges */}
        {plan.services && plan.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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
                coaching: t("settings.gym.services.coaching", "Coaching"),
              };
              const label = SERVICE_LABELS[service] || service;
              const colors = [
                "bg-blue-500/10 text-blue-500 border border-blue-500/20",
                "bg-purple-500/10 text-purple-500 border border-purple-500/20",
                "bg-orange-500/10 text-orange-500 border border-orange-500/20",
                "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
              ];
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 md:py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-colors ${colors[idx % colors.length]}`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-text-secondary font-medium mb-6 line-clamp-2 relative z-10">
        {plan.description || t("common.noDescription")}
      </p>

      {/* Pricing Tiers */}
      <div className="flex-1 space-y-2.5 mb-6 relative z-10 flex flex-col justify-center">
        {plan.pricingTiers.map((tier, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-surface-secondary/50 rounded-2xl px-4 py-3 md:py-4 border border-border/30 hover:bg-surface-secondary transition-colors"
          >
            <span className="text-[11px] md:text-xs text-text-secondary font-bold uppercase tracking-widest">
              {formatDuration(tier.duration, tier.durationUnit, t)}
            </span>
            <span className="text-xl md:text-2xl font-black text-text-primary tracking-tight">
              {formatPrice(tier.price, currency, language)}
            </span>
          </div>
        ))}
      </div>

      {/* Allowed Intervals */}
      <div className="mt-auto relative z-10">
        {plan.allowedIntervals &&
          plan.allowedIntervals.filter((i) => i > 1).length > 0 && (
            <div className="mb-5">
              <span className="text-[9px] md:text-[10px] uppercase font-black text-text-secondary/60 tracking-widest mb-2 block">
                {t("pricing.card.intervals", "Available Multiples")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {plan.allowedIntervals
                  .filter((i) => i > 1)
                  .map((i) => (
                    <span
                      key={i}
                      className="px-2 md:px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] md:text-xs font-black"
                    >
                      {i}x
                    </span>
                  ))}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <button
            onClick={() => onEdit(plan)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary border border-border/50 rounded-2xl transition-all text-[11px] md:text-xs font-black uppercase tracking-widest"
          >
            <Edit2 className="w-4 h-4" />
            {t("common.edit")}
          </button>
          <button
            onClick={() => onDelete(plan)}
            className="flex items-center justify-center px-4 py-2.5 md:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-2xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
