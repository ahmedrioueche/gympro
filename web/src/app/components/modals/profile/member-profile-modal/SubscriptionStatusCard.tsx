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
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
    if (subscriptionType?.customName) return subscriptionType.customName;
    if (subscriptionType?.baseType) {
      return (
        subscriptionType.baseType.charAt(0).toUpperCase() +
        subscriptionType.baseType.slice(1)
      );
    }
    return t("memberProfile.subscription.regular");
  };

  // Get remaining days text
  const getRemainingDays = (): string => {
    if (!subscription) return "-";
    const endDate = new Date(subscription.endDate);
    if (!isValid(endDate)) return "-";

    const days = differenceInDays(endDate, new Date());
    if (days < 0) return t("memberProfile.subscription.expired");
    if (days === 0) return t("memberProfile.subscription.expirestoday");
    if (days === 1) return t("memberProfile.subscription.expiresTomorrow");
    return `${days} ${t("common.days")}`;
  };

  // Status config
  const statusConfig = {
    active: {
      icon: CheckCircle,
      bg: "bg-success/10",
      border: "border-success/20",
      iconColor: "text-success",
      label: t("memberProfile.subscription.active"),
    },
    expiring: {
      icon: AlertCircle,
      bg: "bg-warning/10",
      border: "border-warning/20",
      iconColor: "text-warning",
      label: t("memberProfile.subscription.expiringSoon"),
    },
    expired: {
      icon: XCircle,
      bg: "bg-error/10",
      border: "border-error/20",
      iconColor: "text-error",
      label: t("memberProfile.subscription.expired"),
    },
    none: {
      icon: CreditCard,
      bg: "bg-surface-hover",
      border: "border-border",
      iconColor: "text-text-secondary",
      label: t("memberProfile.subscription.noSubscription"),
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const progress = getProgress();

  // No subscription state
  if (status === "none") {
    return (
      <div className={`${config.bg} border ${config.border} rounded-2xl p-4`}>
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
            className="w-full px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
      className={`${config.bg} border ${config.border} rounded-2xl p-4 space-y-4`}
    >
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${config.bg}`}>
            <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">
              {t("common.status")}
            </p>
            <p className={`text-sm font-bold ${config.iconColor}`}>
              {config.label}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-surface border border-border rounded-lg text-xs font-bold text-text-primary uppercase">
          {getPlanName()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t("memberProfile.subscription.remaining")}
          </span>
          <span className="font-bold text-text-primary">
            {getRemainingDays()}
          </span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              status === "active"
                ? "bg-success"
                : status === "expiring"
                ? "bg-warning"
                : "bg-error"
            }`}
            style={{ width: `${100 - progress}%` }}
          />
        </div>
      </div>

      {/* End Date */}
      {subscription && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Calendar className="w-3 h-3" />
          <span>
            {t("memberProfile.subscription.endDate")}:{" "}
            <span className="font-medium text-text-primary">
              {format(new Date(subscription.endDate), "MMM dd, yyyy")}
            </span>
          </span>
        </div>
      )}

      {/* Renew Button */}
      {onRenew && (status === "expiring" || status === "expired") && (
        <button
          onClick={onRenew}
          className="w-full px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {status === "expired"
            ? t("memberProfile.subscription.renew")
            : t("memberProfile.subscription.extend")}
        </button>
      )}
    </div>
  );
}
