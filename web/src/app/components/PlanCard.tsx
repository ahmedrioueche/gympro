import {
  formatPrice,
  type SupportedCurrency,
  type AppPlan,
  type AppSubscriptionBillingCycle,
  type GetSubscriptionDto,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useSubscriptionStatus } from "../../hooks/useSubscriptionStatus";
import { useLanguageStore } from "../../store/language";
import { getPlanChangeType } from "../../utils/subscription.util";

interface PlanCardProps {
  plan: AppPlan;
  currency: SupportedCurrency;
  isCurrentPlan: boolean;
  billingCycle: AppSubscriptionBillingCycle;
  onSelect: (planId: string) => void;
  currentSubscription?: GetSubscriptionDto | null;
  disabled?: boolean;
}

export default function PlanCard({
  plan,
  currency,
  isCurrentPlan,
  billingCycle,
  onSelect,
  currentSubscription,
  disabled,
}: PlanCardProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { language } = useLanguageStore();

  // ✅ Use the availability checker
  const { isPlanAvailable } = useSubscriptionStatus(
    currentSubscription || undefined
  );
  const availability = isPlanAvailable(plan, billingCycle);

  // Get price for the default currency
  const priceMap = plan.pricing?.[currency] || {};
  const price =
    plan.type === "oneTime"
      ? priceMap.oneTime || 0
      : billingCycle === "yearly"
      ? priceMap.yearly || 0
      : priceMap.monthly || 0;

  // Calculate savings if yearly subscription
  const savings =
    plan.type === "subscription" &&
    billingCycle === "yearly" &&
    priceMap.monthly &&
    priceMap.yearly
      ? priceMap.monthly * 12 - priceMap.yearly
      : 0;

  // 🔥 Dark-mode adjusted gradients + borders
  const planStyles: Record<
    string,
    { gradient: string; iconBg: string; border: string }
  > = {
    free: {
      gradient: isDark
        ? "from-slate-400/10 via-slate-300/5 to-transparent"
        : "from-slate-500/10 via-slate-500/5 to-transparent",
      iconBg: isDark ? "bg-slate-400/10" : "bg-slate-500/10",
      border: isDark ? "border-slate-700" : "border-slate-200",
    },
    starter: {
      gradient: isDark
        ? "from-emerald-400/10 via-emerald-300/5 to-transparent"
        : "from-emerald-500/10 via-emerald-500/5 to-transparent",
      iconBg: isDark ? "bg-emerald-400/10" : "bg-emerald-500/10",
      border: isDark ? "border-emerald-700" : "border-emerald-200",
    },
    standard: {
      gradient: isDark
        ? "from-blue-400/10 via-blue-300/5 to-transparent"
        : "from-blue-500/10 via-blue-500/5 to-transparent",
      iconBg: isDark ? "bg-blue-400/10" : "bg-blue-500/10",
      border: isDark ? "border-blue-700" : "border-blue-200",
    },
    premium: {
      gradient: isDark
        ? "from-purple-400/10 via-purple-300/5 to-transparent"
        : "from-purple-500/10 via-purple-500/5 to-transparent",
      iconBg: isDark ? "bg-purple-400/10" : "bg-purple-500/10",
      border: isDark ? "border-purple-700" : "border-purple-200",
    },
  };
  const style = planStyles[plan.level] || planStyles.starter;

  const handleClick = () => {
    if (disabled || isCurrentPlan || loading || !availability.available) return;
    setLoading(true);
    onSelect(plan._id);
    setTimeout(() => setLoading(false), 2000);
  };

  const formatGymLimit = (maxGyms?: number) => {
    if (!maxGyms) return t("plans.unlimited_gyms");
    return maxGyms === 1
      ? `1 ${t("plans.gym")}`
      : `${maxGyms} ${t("plans.gyms")}`;
  };

  const formatMemberLimit = (maxMembers?: number) => {
    if (!maxMembers) return t("plans.unlimited_members");
    return t("plans.up_to_members_each", { number: maxMembers });
  };

  // ✅ Determine button state with availability check
  let buttonLabel = t("plans.upgrade_now");
  let isDowngradeOrSwitch = false;
  let isUpgrade = false;
  let isUnavailable = false;

  // Check availability first
  if (!availability.available) {
    isUnavailable = true;
    switch (availability.reason) {
      case "lifetime_to_subscription_blocked":
        buttonLabel = t("plans.unavailable");
        break;
      case "already_subscribed":
        buttonLabel = t("plans.current");
        break;
      case "lifetime_downgrade_blocked":
        buttonLabel = t("plans.unavailable");
        break;
      default:
        buttonLabel = t("plans.unavailable");
    }
  } else if (currentSubscription && !isCurrentPlan) {
    // Need full plan object for current subscription level
    const currentPlan = currentSubscription.plan;
    if (currentPlan) {
      const changeType = getPlanChangeType(
        currentPlan.level,
        currentSubscription.billingCycle || "monthly",
        plan.level,
        billingCycle
      );

      switch (changeType) {
        case "downgrade":
          buttonLabel = t("plans.downgrade");
          isDowngradeOrSwitch = true;
          break;
        case "switch_down":
          buttonLabel = t("plans.switch_plan");
          isDowngradeOrSwitch = true;
          break;
        case "switch_up":
          buttonLabel = t("plans.switch_plan");
          isUpgrade = true;
          isDowngradeOrSwitch = true;
          break;
        case "upgrade":
        default:
          buttonLabel = t("plans.upgrade_now");
          isUpgrade = true;
      }
    }
  }

  if (isCurrentPlan) {
    buttonLabel = t("plans.current");
  }

  const hasPendingChange =
    currentSubscription && (currentSubscription as any).pendingPlanId;

  if (hasPendingChange && !isCurrentPlan && !isUpgrade) {
    buttonLabel = t("plans.change_pending");
  }

  const isButtonDisabled =
    disabled ||
    loading ||
    isCurrentPlan ||
    isUnavailable ||
    (hasPendingChange && !isCurrentPlan && !isUpgrade);

  return (
    <div className="relative pt-4">
      {/* Badges */}
      {plan.level === "pro" && !isCurrentPlan && (
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-purple-500/50 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("plans.recommended")}
          </div>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
          <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/50 flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("plans.current_plan")}
          </div>
        </div>
      )}

      {/* Card */}
      <div
        className={`group relative flex flex-col rounded-3xl border-2 overflow-hidden transition-all duration-500 ease-out
        ${isDark ? "bg-[#0d0d0f]" : "bg-white"}
         ${
           disabled
             ? "opacity-50 pointer-events-none border-gray-300 dark:border-gray-700"
             : isCurrentPlan
             ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-105"
             : `${style.border} hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-105`
         }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-60 pointer-events-none`}
        />

        <div className="relative p-8 flex flex-col flex-1">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
            >
              <svg
                className={`w-6 h-6 ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {plan.description
                  ? t(plan.description)
                  : "Perfect for getting started"}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className={`text-3xl md:text-4xl font-black bg-gradient-to-br ${
                  isDark
                    ? "from-white to-gray-400"
                    : "from-gray-900 to-gray-600"
                } bg-clip-text text-transparent`}
              >
                {formatPrice(price, currency, language)}
              </span>
              <span
                className={`${
                  isDark ? "text-gray-400" : "text-gray-500"
                } text-base`}
              >
                {plan.type === "oneTime"
                  ? `/${t("plans.one_time")}`
                  : `/${
                      billingCycle === "yearly"
                        ? t("plans.year")
                        : t("plans.month")
                    }`}
              </span>
            </div>

            {savings > 0 && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isDark
                    ? "bg-green-900 text-green-300"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {t("plans.save")} {formatPrice(savings, currency, language)}{" "}
                {t("plans.per_year")}
              </div>
            )}

            {/* Limits */}
            <div className="mt-3 space-y-1">
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formatGymLimit(plan.limits?.maxGyms)}
              </p>
              {plan.limits?.maxMembers && (
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {formatMemberLimit(plan.limits.maxMembers)}
                </p>
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((feature, i) => (
              <li
                key={i}
                className={`flex items-start gap-3 text-sm ${
                  isDark ? "text-gray-300" : "text-gray-700"
                } group/item`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isDark
                      ? "bg-blue-900 group-hover/item:bg-blue-600"
                      : "bg-blue-100 group-hover/item:bg-blue-500"
                  }`}
                >
                  <svg
                    className={`w-4 h-4 ${
                      isDark
                        ? "text-blue-300 group-hover/item:text-white"
                        : "text-blue-600 group-hover/item:text-white"
                    } transition-colors duration-300`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="leading-relaxed">{t(feature)}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            onClick={handleClick}
            disabled={isButtonDisabled}
            className={`relative mt-auto w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 overflow-hidden ${
              isButtonDisabled
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : loading
                ? "bg-blue-500 text-white cursor-wait"
                : isDowngradeOrSwitch
                ? "bg-transparent border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? t("plans.processing") : buttonLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
