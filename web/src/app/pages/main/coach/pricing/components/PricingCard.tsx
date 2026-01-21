import type { CoachPricingTier } from "@ahmedrioueche/gympro-client";
import {
  Calendar,
  Dumbbell,
  Edit,
  MessageCircle,
  Trash2,
  Users,
  Utensils,
  Video,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../../../../../utils/helper";

interface PricingCardProps {
  pricing: CoachPricingTier;
  onEdit: (pricing: CoachPricingTier) => void;
  onDelete: (pricing: CoachPricingTier) => void;
}

export function PricingCard({ pricing, onEdit, onDelete }: PricingCardProps) {
  const { t } = useTranslation();

  const getServiceConfig = (type: string) => {
    switch (type) {
      case "training":
      case "training_nutrition":
        return {
          icon: Dumbbell,
          colors: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          gradient: "from-blue-500 to-cyan-500",
        };
      case "nutrition":
        return {
          icon: Utensils,
          colors: "bg-green-500/10 text-green-500 border-green-500/20",
          gradient: "from-emerald-500 to-green-500",
        };
      case "online_coaching":
        return {
          icon: Video,
          colors: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
          gradient: "from-indigo-500 to-violet-500",
        };
      case "consultation":
        return {
          icon: MessageCircle,
          colors: "bg-purple-500/10 text-purple-500 border-purple-500/20",
          gradient: "from-purple-500 to-pink-500",
        };
      case "group_training":
        return {
          icon: Users,
          colors: "bg-orange-500/10 text-orange-500 border-orange-500/20",
          gradient: "from-orange-500 to-yellow-500",
        };
      default:
        return {
          icon: Zap,
          colors: "bg-primary/10 text-primary border-primary/20",
          gradient: "from-primary to-secondary",
        };
    }
  };

  const getServiceTypeLabel = (type: string) => {
    return t(`coachPricing.serviceTypes.${type}`) || type;
  };

  const getDurationUnitLabel = (unit: string) => {
    return t(`coachPricing.durationUnits.${unit}`) || unit;
  };

  const config = getServiceConfig(pricing.serviceType);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group relative bg-surface border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl",
        pricing.isActive
          ? "border-border hover:border-primary/40"
          : "border-border opacity-75 hover:opacity-100"
      )}
    >
      {/* Gradient Accent Line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            {/* Icon Box */}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-1">
                {pricing.name}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-lg border ${config.colors}`}
              >
                {getServiceTypeLabel(pricing.serviceType)}
              </span>
            </div>
          </div>

          {/* Active Badge */}
          {pricing.isActive && (
            <span className="px-2.5 py-1 text-xs font-bold bg-green-500/15 text-green-500 rounded-full border border-green-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {t("common.active")}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-6 min-h-[40px]">
          {pricing.description || t("common.noDescription")}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Price */}
          <div className="bg-background-secondary/40 rounded-xl p-3 text-center border border-border/50 hover:border-primary/20 transition-colors">
            <span className="block text-lg font-bold text-text-primary">
              {pricing.price}
              <span className="text-xs font-normal text-text-secondary ml-1">
                {pricing.currency}
              </span>
            </span>
            <span className="text-xs text-text-secondary">
              {t("coachPricing.form.price")}
            </span>
          </div>

          {/* Duration */}
          <div className="bg-background-secondary/40 rounded-xl p-3 text-center border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Calendar className="w-3 h-3 text-primary" />
              <span className="text-lg font-bold text-text-primary">
                {pricing.duration}
              </span>
            </div>
            <span className="text-xs text-text-secondary capitalize">
              {getDurationUnitLabel(pricing.durationUnit)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(pricing)}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-background-secondary text-text-primary hover:bg-surface-hover transition-all border border-border hover:border-primary/30 flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            {t("common.edit")}
          </button>
          <button
            onClick={() => onDelete(pricing)}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-danger bg-danger/5 hover:bg-danger/10 transition-all border border-danger/10 hover:border-danger/30 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t("common.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
