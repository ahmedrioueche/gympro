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
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { openGmail, openWhatsApp } from "../../../../../../../utils/contact";
import { cn } from "../../../../../../../utils/helper";

interface MemberHeroProps {
  user: User;
  joinedAt: string;
  subscription?: SubscriptionInfo;
  subscriptionType?: SubscriptionType;
}

export function MemberHero({
  user,
  joinedAt,
  subscription,
  subscriptionType,
}: MemberHeroProps) {
  const { t } = useTranslation();

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
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
        accentColor: "rose",
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
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        accentColor: "amber",
      };
    }

    return {
      id: "active",
      icon: CheckCircle2,
      label: t("memberProfile.subscription.active"),
      desc: t("memberProfile.subscription.daysRemaining", {
        days: daysRemaining,
      }),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      accentColor: "emerald",
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
    <div className="relative overflow-hidden bg-surface border border-border rounded-3xl group">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-20 -mb-20 opacity-30" />

      <div className="relative p-8 flex flex-col lg:flex-row gap-10">
        {/* Left Section: Profile Info */}
        <div className="flex-1 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.profile?.profileImageUrl ? (
              <img
                src={user.profile.profileImageUrl}
                alt=""
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover ring-4 ring-border/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-surface flex items-center justify-center rounded-2xl ring-4 ring-border/50 shadow-2xl">
                <UserIcon className="w-16 h-16 text-zinc-600" />
              </div>
            )}
            {/* Status Dot */}
            {status && (
              <div
                className={cn(
                  "absolute -bottom-2 -right-2 w-8 h-8 rounded-xl border-4 border-surface flex items-center justify-center shadow-lg",
                  status.bgColor
                )}
              >
                <status.icon className={cn("w-4 h-4", status.color)} />
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-3">
              {user.profile?.fullName || t("memberProfile.unknownMember")}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
              <span className="px-3 py-1 bg-border/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border/50">
                {user.profile?.gender || t("memberProfile.genderNotSpecified")}
              </span>
              <span className="px-3 py-1 bg-border/50 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border/50">
                {user.profile?.age || "?"} {t("common.years")}
              </span>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg border border-primary/20">
                {t("memberProfile.idLabel")}: {user._id.slice(-8)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div
                onClick={() =>
                  user.profile.email && openGmail(user.profile.email)
                }
                className="flex items-center gap-3 text-zinc-400 group/link cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center group-hover/link:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 group-hover/link:text-primary transition-colors" />
                </div>
                <span className="truncate underline font-medium">
                  {user.profile.email || t("memberProfile.noEmail")}
                </span>
              </div>
              <div
                onClick={() =>
                  user.profile.phoneNumber &&
                  openWhatsApp(user.profile.phoneNumber)
                }
                className="flex items-center gap-3 text-zinc-400 group/link cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center group-hover/link:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 group-hover/link:text-primary transition-colors" />
                </div>
                <span className="font-medium">
                  {user.profile.phoneNumber || t("memberProfile.noPhone")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <div className="w-8 h-8 rounded-lg bg-border/50 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="font-medium whitespace-nowrap">
                  {t("memberProfile.joinedAt")}{" "}
                  {format(new Date(joinedAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Subscription Highlighting */}
        <div className="w-full lg:w-80 flex flex-col justify-center gap-4">
          {!subscription ? (
            <div className="bg-surface/50 border border-dashed border-border rounded-3xl p-8 text-center backdrop-blur-sm">
              <Clock className="w-10 h-10 text-zinc-600 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                {t("memberProfile.subscription.noActivePlan")}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "relative bg-zinc-800/40 border-2 rounded-[32px] p-8 backdrop-blur-md overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]",
                status?.borderColor
              )}
            >
              {/* Status Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center",
                    status?.bgColor
                  )}
                >
                  {status && (
                    <status.icon className={cn("w-5 h-5", status.color)} />
                  )}
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em]",
                      status?.color
                    )}
                  >
                    {status?.label}
                  </h4>
                  <p className="text-2xl font-black text-white leading-tight">
                    {status?.desc}
                  </p>
                </div>
              </div>

              {/* Plan Info */}
              <div className="space-y-4 pt-4 border-t border-zinc-700/50">
                <div>
                  <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1">
                    {t("memberProfile.subscription.currentPlan")}
                  </p>
                  <p className="font-black text-zinc-100 text-lg uppercase tracking-tight">
                    {subscriptionType?.baseType || "-"}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1">
                      {t("memberProfile.subscription.until")}
                    </p>
                    <p className="font-bold text-zinc-200 text-sm">
                      {format(new Date(subscription.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {subscriptionType?.price && (
                    <div className="text-right text-primary">
                      <p className="font-black text-xl italic tracking-tighter">
                        {subscriptionType.price}{" "}
                        {user?.appSettings.locale.currency}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar - Inverted to show remaining time */}
              {status?.id !== "expired" && (
                <div className="mt-8 h-2 w-full bg-zinc-700/50 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      status?.id === "expiring"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    )}
                    style={{ width: `${calculateRemainingProgress()}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
