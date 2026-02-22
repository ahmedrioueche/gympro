import { formatPrice, type Gym } from "@ahmedrioueche/gympro-client";
import { CircleDollarSign, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useCoachAffiliations,
  useRequestGymAffiliation,
} from "../../../../hooks/queries/useGymCoach";
import { useGymSubscriptionTypes } from "../../../../hooks/queries/useGymSubscriptionTypes";
import { useLanguageStore } from "../../../../store/language";
import { useUserStore } from "../../../../store/user";
import { capitalize, formatDuration } from "../../../../utils/helper";

interface GymInfoOverviewProps {
  gym: Gym;
  displayRole?: string;
  onSelect: () => void;
  onJoin?: () => void;
  onToggleSettings: () => void;
}

export function GymInfoOverview({
  gym,
  displayRole,
  onSelect,
  onToggleSettings,
}: GymInfoOverviewProps) {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { language } = useLanguageStore();

  const { mutate: requestAffiliation, isPending: isJoining } =
    useRequestGymAffiliation();

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    requestAffiliation(
      { gymId: gym._id },
      {
        onSuccess: () => {
          toast.success(
            t("gyms.request_success", "Join request submitted successfully!"),
          );
        },
        onError: (error: any) => {
          toast.error(
            error.message ||
              t("gyms.request_error", "Failed to submit join request"),
          );
        },
      },
    );
  };

  const { data: plans = [] } = useGymSubscriptionTypes(gym._id);

  // Check if user has an existing membership for status display
  const { data: coachAffiliations = [] } = useCoachAffiliations();

  const membership: any = user?.memberships?.find((m: any) => {
    if (typeof m === "string") return false;
    const gId =
      typeof m.gym === "string" ? m.gym : m.gym?._id || m.gym?.toString();
    return gId === gym._id;
  });

  const coachAffiliation = coachAffiliations.find(
    (a) => a.gymId === gym._id || a.gym?._id === gym._id,
  );

  const isPending =
    (membership &&
      typeof membership !== "string" &&
      membership.membershipStatus === "pending") ||
    coachAffiliation?.status === "pending";

  const isJoined =
    (membership &&
      typeof membership !== "string" &&
      membership.membershipStatus === "active") ||
    coachAffiliation?.status === "active";

  const isStaff = ["Owner", "Manager", "Staff"].includes(displayRole || "");

  // Pre-compute labels to avoid recreation in loops
  const SERVICE_LABELS: Record<string, string> = {
    gym: t("settings.gym.services.gym", "General Gym Access"),
    cardio: t("settings.gym.services.cardio", "Cardio Training"),
    crossfit: t("settings.gym.services.crossfit", "CrossFit"),
    swimming: t("settings.gym.services.swimming", "Swimming Pool"),
    boxing: t("settings.gym.services.boxing", "Boxing / MMA"),
    yoga: t("settings.gym.services.yoga", "Yoga & Pilates"),
    sauna: t("settings.gym.services.sauna", "Sauna & Spa"),
    massage: t("settings.gym.services.massage", "Massage Therapy"),
    shower: t("settings.gym.services.shower", "Showers"),
    coaching: t(
      "settings.gym.services.coaching",
      "Coaching & Personal Training",
    ),
  };

  const SHORT_SERVICE_LABELS: Record<string, string> = {
    gym: t("settings.gym.services.gym", "Gym"),
    cardio: t("settings.gym.services.cardio", "Cardio"),
    crossfit: t("settings.gym.services.crossfit", "CrossFit"),
    swimming: t("settings.gym.services.swimming", "Swimming"),
    boxing: t("settings.gym.services.boxing", "Boxing"),
    yoga: t("settings.gym.services.yoga", "Yoga"),
    sauna: t("settings.gym.services.sauna", "Sauna"),
    massage: t("settings.gym.services.massage", "Massage"),
    shower: t("settings.gym.services.shower", "Showers"),
    coaching: t("settings.gym.services.coaching", "Coaching"),
  };

  return (
    <div className="p-6 md:p-8 lg:p-10">
      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Location */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${gym.address || ""} ${gym.city || ""} ${gym.state || ""} ${gym.country || ""}`.trim(),
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 group cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
              📍
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1 group-hover:text-primary transition-colors">
                {t("gymCard.location", "Location")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-words group-hover:text-primary transition-colors">
                {gym.address || t("gymCard.noAddress", "No address provided")}
              </p>

              {(gym.city || gym.state || gym.country) && (
                <p className="text-xs text-text-secondary mt-1">
                  {gym.city}
                  {gym.state && `, ${gym.state}`}
                  {gym.country && ` - ${gym.country}`}
                </p>
              )}
            </div>
          </div>
        </a>

        {/* Contact */}
        <div className="bg-surface/50 rounded-xl p-5 border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📞</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                {t("gymCard.contact", "Contact")}
              </h4>
              <p className="text-sm font-medium text-text-primary break-all">
                {gym.phone || t("gymCard.noPhone", "No phone")}
              </p>

              {gym.email && (
                <p className="text-xs text-text-secondary mt-1 break-all">
                  {gym.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services and Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Services Offered */}
        {gym.settings?.servicesOffered &&
          gym.settings.servicesOffered.length > 0 && (
            <div className="bg-surface/30 rounded-2xl p-6 border border-border/50">
              <h4 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-orange-500" />
                {t("gymCard.servicesOffered", "Services Offered")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {gym.settings.servicesOffered.map((service, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize ${COLORS[idx % COLORS.length]}`}
                  >
                    {typeof service === "string"
                      ? SERVICE_LABELS[service] || service
                      : SERVICE_LABELS[service.name] || service.name}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Pricing Summary */}
        <div className="bg-surface/30 rounded-2xl p-6 border border-border/50">
          <h4 className="flex items-center gap-2 text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
            <CircleDollarSign className="w-4 h-4 text-emerald-500" />
            {t("gymCard.availablePlans", "Available Plans")}
          </h4>
          <div className="space-y-3">
            {plans.length > 0 ? (
              plans.slice(0, 2).map((plan: any) => {
                const lowestTier = plan.pricingTiers?.sort(
                  (a: any, b: any) => a.price - b.price,
                )[0];

                const durationLabel = lowestTier
                  ? formatDuration(
                      lowestTier.duration,
                      lowestTier.durationUnit,
                      t,
                    )
                  : "";

                return (
                  <div
                    key={plan._id}
                    className="flex flex-col gap-1 bg-muted/20 rounded-xl px-4 py-2 border border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {(plan.customName && capitalize(plan.customName)) ||
                          (plan.services && plan.services.length > 0
                            ? plan.services
                                .map(
                                  (s: string) => SHORT_SERVICE_LABELS[s] || s,
                                )
                                .join(" + ")
                            : t("pricing.form.regularPlan", "Regular Plan"))}
                      </span>
                      <span className="text-sm font-black text-primary whitespace-nowrap">
                        {lowestTier
                          ? formatPrice(
                              lowestTier.price,
                              gym.settings?.defaultCurrency || "DZD",
                              language,
                            )
                          : t("common.n_a", "N/A")}
                      </span>
                    </div>
                    {durationLabel && (
                      <span className="text-[10px] font-medium text-text-secondary uppercase tracking-wider">
                        {durationLabel}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-secondary italic">
                {t("gymCard.noPlans", "No public plans available yet")}
              </p>
            )}
            {plans.length > 2 && (
              <p className="text-[10px] text-text-secondary text-right font-medium">
                + {plans.length - 2}{" "}
                {t("gymCard.morePlans", "more plans available")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Website */}
      {gym.website && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">🌐</span>
            <span className="text-text-secondary">
              {t("gymCard.website", "Website")}:
            </span>
            <a
              href={gym.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all"
              onClick={(e) => e.stopPropagation()}
            >
              {gym.website}
            </a>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {isStaff || isJoined || isPending || user?.role === "coach" ? (
          <button
            onClick={
              isStaff
                ? (e) => {
                    e.stopPropagation();
                    onSelect();
                  }
                : user?.role === "coach" && !isJoined && !isPending
                  ? handleJoin
                  : undefined
            }
            disabled={(!isStaff && (isPending || isJoined)) || isJoining}
            className={`flex-1 py-4 px-6 text-center rounded-xl font-semibold text-lg transition-all duration-300 active:scale-95 ${
              isStaff
                ? "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
                : isJoined
                  ? "bg-success/20 text-success border-2 border-success/30 cursor-default"
                  : isPending || isJoining
                    ? "bg-warning/20 text-warning border-2 border-warning/30 cursor-wait"
                    : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-105"
            }`}
          >
            {isStaff
              ? t("gymCard.manageGym", "Manage Gym")
              : isJoined
                ? t("gyms.status_joined", "Joined")
                : isPending || isJoining
                  ? t("gyms.status_pending", "Pending")
                  : t("gymCard.joinGym", "Join Gym")}
          </button>
        ) : null}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSettings();
          }}
          className="flex-1 py-4 px-6 text-center rounded-xl bg-surface border-2 border-border text-text-primary font-semibold text-lg hover:bg-surface/50 hover:border-primary hover:text-primary transition-all duration-300 active:scale-95"
        >
          {t("gymCard.viewMoreDetails")}
        </button>
      </div>
    </div>
  );
}

const COLORS = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
];
