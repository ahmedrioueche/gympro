import {
  type SubscriptionInfo,
  type SubscriptionType,
  type User,
} from "@ahmedrioueche/gympro-client";
import { differenceInDays, format, isPast } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  RefreshCw,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import { openGmail, openWhatsApp } from "../../../../../../../utils/contact";
import { cn } from "../../../../../../../utils/helper";

interface MemberHeroProps {
  user: User;
  joinedAt: string;
  membershipId: string;
  subscription?: SubscriptionInfo;
  subscriptionType?: SubscriptionType;
}

export function MemberHero({
  user,
  joinedAt,
  membershipId,
  subscription,
  subscriptionType,
}: MemberHeroProps) {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();

  const currency = currentGym?.settings?.defaultCurrency || "USD";

  // Find the matching tier for the current subscription to show its price
  const getSubscriptionPrice = () => {
    if (!subscription || !subscriptionType?.pricingTiers?.length) return null;

    const subStart = new Date(subscription.startDate);
    const subEnd = new Date(subscription.endDate);
    const subDays = differenceInDays(subEnd, subStart);

    // Try to find a tier that matches this duration
    const matchingTier = subscriptionType.pricingTiers.find((tier) => {
      let tierDays = tier.duration;
      if (tier.durationUnit === "week") tierDays *= 7;
      else if (tier.durationUnit === "month") tierDays *= 30;
      else if (tier.durationUnit === "year") tierDays *= 365;

      // Allow small difference for month length variations
      return Math.abs(tierDays - subDays) <= 3;
    });

    return matchingTier?.price ?? subscriptionType.pricingTiers[0].price;
  };

  const currentPrice = getSubscriptionPrice();
  const planName =
    subscriptionType?.customName ||
    (subscriptionType?.baseType
      ? t(`createMember.form.subscription.${subscriptionType.baseType}`)
      : "-");

  const openRenewModal = (data: { memberId: string; memberName: string }) => {
    openModal("renew_subscription", {
      memberId: data.memberId,
      membershipId,
      memberName: data.memberName,
      currentSubscription: subscription
        ? { typeId: subscription.typeId, endDate: subscription.endDate }
        : undefined,
    });
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return null;

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const isExpired = isPast(endDate);
    const daysRemaining = differenceInDays(endDate, now);

    if (isExpired) {
      const daysSinceExpired = Math.abs(daysRemaining);
      const months = Math.floor(daysSinceExpired / 30);
      const days = daysSinceExpired % 30;

      let expiredText = "";
      if (months > 0) {
        expiredText = t("memberProfile.subscription.expiredMonths", {
          months,
          days,
        });
      } else {
        expiredText = t("memberProfile.subscription.expiredDays", {
          days: daysSinceExpired,
        });
      }

      return {
        id: "expired",
        icon: XCircle,
        label: t("memberProfile.subscription.expired"),
        desc: expiredText,
        color: "text-danger",
        bgColor: "bg-danger/10",
        borderColor: "border-danger/20",
      };
    }

    if (daysRemaining <= 7) {
      return {
        id: "expiring",
        icon: AlertCircle,
        label: t("memberProfile.subscription.expiringSoon"),
        desc: t("memberProfile.subscription.daysRemaining", {
          days: daysRemaining,
        }),
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
      };
    }

    return {
      id: "active",
      icon: CheckCircle2,
      label: t("memberProfile.subscription.active"),
      desc: t("memberProfile.subscription.daysRemaining", {
        days: daysRemaining,
      }),
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
    };
  };

  const status = getSubscriptionStatus();

  const calculateRemainingProgress = () => {
    if (!subscription) return 0;
    const start = new Date(subscription.startDate).getTime();
    const end = new Date(subscription.endDate).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const remaining = end - now;

    if (total <= 0) return 0;
    const percentage = (remaining / total) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  return (
    <div className="relative overflow-hidden bg-surface border border-border rounded-3xl">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />

      <div className="relative p-8">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left Section: Profile Info */}
          <div className="flex gap-6 items-start">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {user.profile?.profileImageUrl ? (
                <img
                  src={user.profile.profileImageUrl}
                  alt=""
                  className="w-28 h-28 rounded-2xl object-cover ring-2 ring-border shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 bg-surface-hover flex items-center justify-center rounded-2xl ring-2 ring-border shadow-lg">
                  <UserIcon className="w-14 h-14 text-text-secondary" />
                </div>
              )}
              {status && (
                <div
                  className={cn(
                    "absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg border-2 border-surface flex items-center justify-center shadow-md",
                    status.bgColor
                  )}
                >
                  <status.icon className={cn("w-3.5 h-3.5", status.color)} />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Name & Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-3">
                  {user.profile?.fullName || t("memberProfile.unknownMember")}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                    {user.profile?.gender ||
                      t("memberProfile.genderNotSpecified")}
                  </span>
                  <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                    {user.profile?.age || "?"} {t("common.years")}
                  </span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider rounded-lg border border-primary/20">
                    {t("memberProfile.idLabel")}: {user._id.slice(-8)}
                  </span>
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 gap-3">
                <div
                  onClick={() =>
                    user.profile.email && openGmail(user.profile.email)
                  }
                  className="flex items-center gap-3 text-text-secondary group/link cursor-pointer hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center group-hover/link:bg-primary/10 border border-border group-hover/link:border-primary/30 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">
                    {user.profile.email || t("memberProfile.noEmail")}
                  </span>
                </div>

                <div
                  onClick={() =>
                    user.profile.phoneNumber &&
                    openWhatsApp(user.profile.phoneNumber)
                  }
                  className="flex items-center gap-3 text-text-secondary group/link cursor-pointer hover:text-primary transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center group-hover/link:bg-primary/10 border border-border group-hover/link:border-primary/30 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {user.profile.phoneNumber || t("memberProfile.noPhone")}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {t("memberProfile.joinedAt")}{" "}
                    {format(new Date(joinedAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Subscription Card */}
          <div className="w-full lg:w-[380px]">
            {!subscription ? (
              <div className="bg-surface-hover border border-dashed border-border rounded-2xl p-8 text-center">
                <Clock className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  {t("memberProfile.subscription.noActivePlan")}
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "relative bg-surface-hover border-2 rounded-2xl p-6 space-y-5",
                  status?.borderColor
                )}
              >
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      status?.bgColor
                    )}
                  >
                    {status && (
                      <status.icon className={cn("w-5 h-5", status.color)} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        status?.color
                      )}
                    >
                      {status?.label}
                    </h4>
                    <p className="text-xl font-bold text-text-primary leading-tight">
                      {status?.desc}
                    </p>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">
                        {t("memberProfile.subscription.currentPlan")}
                      </p>
                      <p className="font-bold text-text-primary text-lg">
                        {planName}
                      </p>
                    </div>
                    {currentPrice !== null && (
                      <div className="text-right">
                        <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">
                          {t("memberProfile.subscription.price")}
                        </p>
                        <p className="font-bold text-primary text-lg">
                          {currentPrice} {currency}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wider mb-1">
                      {t("memberProfile.subscription.until")}
                    </p>
                    <p className="font-semibold text-text-primary">
                      {format(new Date(subscription.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                {status?.id !== "expired" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-text-secondary">
                      <span>
                        {t("memberProfile.subscription.timeRemaining")}
                      </span>
                      <span>{Math.round(calculateRemainingProgress())}%</span>
                    </div>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          status?.id === "expiring"
                            ? "bg-warning"
                            : "bg-success"
                        )}
                        style={{ width: `${calculateRemainingProgress()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() =>
                    openRenewModal({
                      memberId: user._id,
                      memberName: user.profile?.fullName || "",
                    })
                  }
                  className={cn(
                    "w-full py-3 px-4 rounded-xl font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200",
                    status?.id === "expired"
                      ? "bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/20"
                      : status?.id === "expiring"
                      ? "bg-warning hover:bg-warning/90 text-white shadow-lg shadow-warning/20"
                      : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  {status?.id === "expired"
                    ? t("memberProfile.subscription.renew")
                    : t("memberProfile.subscription.extend")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
