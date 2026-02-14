import type {
  SubscriptionInfo,
  SubscriptionType,
} from "@ahmedrioueche/gympro-client";
import { differenceInDays, format, isPast, isValid } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Info,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { capitalize } from "../../../../../utils/helper";

interface SubscriptionStatusCardProps {
  subscription?: SubscriptionInfo;
  subscriptionType?: SubscriptionType;
  onRenew?: () => void;
}

type StatusType = "active" | "expiring" | "expired" | "none";

export function SubscriptionStatusCard({
  subscription,
  subscriptionType,
  onRenew,
}: SubscriptionStatusCardProps) {
  const { t } = useTranslation();

  // Determine subscription status
  const getStatus = (): StatusType => {
    if (!subscription) return "none";
    if (subscription.status === "expired") return "expired";
    if (subscription.status === "cancelled") return "expired";

    const endDate = new Date(subscription.endDate);
    if (!isValid(endDate)) return "none";
    if (isPast(endDate)) return "expired";

    const daysRemaining = differenceInDays(endDate, new Date());
    if (daysRemaining <= 7) return "expiring";
    return "active";
  };

  const status = getStatus();

  // Calculate progress percentage
  const getProgress = (): number => {
    if (!subscription) return 0;
    const start = new Date(subscription.startDate);
    const end = new Date(subscription.endDate);
    const now = new Date();

    if (!isValid(start) || !isValid(end)) return 0;

    const total = differenceInDays(end, start);
    const elapsed = differenceInDays(now, start);

    if (total <= 0) return 100;
    const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(progress);
  };

  // Get plan name
  const getPlanName = (): string => {
    if (subscriptionType?.customName != null)
      return capitalize(subscriptionType.customName);

    if (subscriptionType?.services && subscriptionType.services.length > 0) {
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
      return subscriptionType.services
        .map((s) => SERVICE_LABELS[s] || s)
        .join(" + ");
    }

    return t("pricing.form.regularPlan", "Regular Plan");
  };

  // Get remaining days text
  const getRemainingDays = (): string => {
    if (!subscription) return "-";
    const endDate = new Date(subscription.endDate);
    if (!isValid(endDate)) return "-";

    const days = differenceInDays(endDate, new Date());

    if (days === 0) return t("memberProfile.subscription.expirestoday");
    if (days === 1) return t("memberProfile.subscription.expiresTomorrow");
    if (days > 1)
      return t("memberProfile.subscription.expiresInDays", { days });

    if (days === -1) return t("memberProfile.subscription.expiredYesterday");
    return t("memberProfile.subscription.expiredDays", {
      days: Math.abs(days),
    });
  };

  // Status config
  const statusConfig = {
    active: {
      icon: CheckCircle,
      bg: "bg-success/10",
      border: "border-success/20",
      iconColor: "text-success",
      label: t("memberProfile.subscription.active"),
      pulse: false,
    },
    expiring: {
      icon: AlertCircle,
      bg: "bg-warning/10",
      border: "border-warning/20",
      iconColor: "text-warning",
      label: t("memberProfile.subscription.expiringSoon"),
      pulse: true,
    },
    expired: {
      icon: XCircle,
      bg: "bg-error/10",
      border: "border-error/20",
      iconColor: "text-error",
      label: t("memberProfile.subscription.expired"),
      pulse: false,
    },
    none: {
      icon: CreditCard,
      bg: "bg-surface-hover",
      border: "border-border",
      iconColor: "text-text-secondary",
      label: t("memberProfile.subscription.noSubscription"),
      pulse: false,
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const progress = getProgress();
  const daysRemaining = subscription
    ? differenceInDays(new Date(subscription.endDate), new Date())
    : 999;
  const isUrgent = status === "expiring" && daysRemaining <= 3;

  // No subscription state
  if (status === "none") {
    return (
      <div
        className={`${config.bg} border ${config.border} rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-xl ${config.bg}`}>
            <CreditCard className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <span className="text-sm font-medium text-text-secondary">
            {config.label}
          </span>
        </div>
        {onRenew && (
          <button
            onClick={onRenew}
            className="w-full px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            {t("memberProfile.subscription.addSubscription")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${config.bg} border ${config.border} rounded-2xl p-4 space-y-4 transition-all duration-300 hover:shadow-lg ${
        isUrgent ? "animate-pulse ring-2 ring-warning/20 shadow-warning/10" : ""
      }`}
    >
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${config.bg} ${isUrgent ? "relative" : ""}`}
          >
            <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
            {isUrgent && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full border-2 border-surface animate-ping" />
            )}
          </div>
          <div>
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.1em]">
              {t("common.status")}
            </p>
            <p className={`text-sm font-black ${config.iconColor}`}>
              {config.label}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-2 py-0.5 bg-surface border border-border rounded-md text-[10px] font-black text-text-primary uppercase mb-1">
            {getPlanName()}
          </span>
          {subscription?.paymentMethod && (
            <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider">
              {subscription.paymentMethod}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {t("memberProfile.subscription.remaining")}
          </span>
          <span
            className={`font-black ${isUrgent ? "text-warning" : "text-text-primary"}`}
          >
            {getRemainingDays()}
          </span>
        </div>
        <div className="h-2.5 bg-surface/50 rounded-full overflow-hidden border border-border/10">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              status === "active"
                ? "bg-success shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                : status === "expiring"
                  ? "bg-warning shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                  : "bg-error shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            }`}
            style={{ width: `${100 - progress}%` }}
          />
        </div>
      </div>

      {/* End Date */}
      {subscription && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px] text-text-secondary">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {t("memberProfile.subscription.endDate")}:{" "}
              <span className="font-bold text-text-primary">
                {format(new Date(subscription.endDate), "MMM dd, yyyy")}
              </span>
            </span>
          </div>

          {/* Handled By if available */}
          {subscription.typeId && (
            <div className="flex items-center gap-1 group">
              <Info className="w-3 h-3 text-text-tertiary group-hover:text-primary transition-colors cursor-help" />
            </div>
          )}
        </div>
      )}

      {/* Renew Button */}
      {onRenew && (status === "expiring" || status === "expired") && (
        <button
          onClick={onRenew}
          className={`w-full px-4 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg ${
            status === "expired"
              ? "bg-error text-white hover:bg-error/90 shadow-error/20"
              : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${isUrgent ? "animate-spin-slow" : ""}`}
          />
          {status === "expired"
            ? t("memberProfile.subscription.renew")
            : t("memberProfile.subscription.extend")}
        </button>
      )}
    </div>
  );
}
