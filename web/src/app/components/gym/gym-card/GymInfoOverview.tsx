import {
  formatPrice,
  type AppLanguage,
  type Gym,
} from "@ahmedrioueche/gympro-client";
import {
  CircleDollarSign,
  ExternalLink,
  Flame,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import React, { useMemo } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useCoachAffiliations,
  useRequestGymAffiliation,
} from "../../../../hooks/queries/useGymCoach";
import { useGymSubscriptionTypes } from "../../../../hooks/queries/useGymSubscriptionTypes";
import { useLanguageStore } from "../../../../store/language";
import { useModalStore } from "../../../../store/modal";
import { useUserStore } from "../../../../store/user";
import { capitalize, cn, formatDuration } from "../../../../utils/helper";
import { getMessage } from "../../../../utils/statusMessage";

interface GymInfoOverviewProps {
  gym: Gym;
  displayRole?: string;
  onSelect: () => void;
  onJoin?: () => void;
  onToggleSettings: () => void;
  hideActions?: boolean;
}

const COLORS = [
  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
];

export function GymInfoOverview({
  gym,
  displayRole,
  onSelect,
  onJoin,
  onToggleSettings,
  hideActions = false,
}: GymInfoOverviewProps) {
  const { t } = useTranslation();
  const { user, activeDashboard } = useUserStore();
  const { language } = useLanguageStore();
  const { openModal } = useModalStore();

  const { mutate: requestAffiliation, isPending: isJoining } =
    useRequestGymAffiliation();

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();

    openModal("confirm", {
      title: t("coach.gyms.requestJoinTitle", "Join Gym"),
      text: t("coach.gyms.requestJoinConfirm", {
        gymName: gym.name,
        defaultValue: `Are you sure you want to join ${gym.name}?`,
      }),
      confirmText: t("coach.gyms.requestJoin", "Join"),
      onConfirm: () => {
        requestAffiliation(
          { gymId: gym._id },
          {
            onSuccess: (data) => {
              if (data.success) {
                toast.success(
                  t(
                    "gyms.request_success",
                    "Join request submitted successfully!",
                  ),
                );
              } else {
                const statusMessage = getMessage(data, t);
                toast.error(statusMessage.message);
              }
            },
            onError: (error: any) => {
              const statusMessage = getMessage(
                error.response?.data || error,
                t,
              );
              toast.error(statusMessage.message);
            },
          },
        );
      },
      confirmVariant: "primary",
    });
  };

  const { data: plans = [] } = useGymSubscriptionTypes(gym._id);
  const { data: coachAffiliations = [] } = useCoachAffiliations();

  const membership = useMemo(
    () =>
      user?.memberships?.find((m: any) => {
        if (typeof m === "string") return false;
        const gId =
          typeof m.gym === "string" ? m.gym : m.gym?._id || m.gym?.toString();
        return gId === gym._id;
      }),
    [user?.memberships, gym._id],
  );

  const coachAffiliation = useMemo(
    () =>
      coachAffiliations.find(
        (a) => a.gymId === gym._id || a.gym?._id === gym._id,
      ),
    [coachAffiliations, gym._id],
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

  const SERVICE_LABELS: Record<string, string> = useMemo(
    () => ({
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
    }),
    [t],
  );

  const SHORT_SERVICE_LABELS: Record<string, string> = useMemo(
    () => ({
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
    }),
    [t],
  );

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Essential Info Grid */}
      {(gym.address ||
        gym.city ||
        gym.state ||
        gym.country ||
        gym.phone ||
        gym.email ||
        gym.website) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location Section */}
          {(gym.address || gym.city || gym.state || gym.country) && (
            <div className="space-y-4">
              <SectionHeader
                icon={<MapPin className="w-5 h-5 text-primary" />}
                title={t("gymCard.location", "Location")}
              />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${gym.address || ""} ${gym.city || ""} ${gym.state || ""} ${gym.country || ""}`.trim(),
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block group p-4 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {gym.address && (
                  <p className="text-text-primary font-bold group-hover:text-primary transition-colors">
                    {gym.address}
                  </p>
                )}
                {(gym.city || gym.state || gym.country) && (
                  <p className="text-sm text-text-secondary mt-1">
                    {gym.city}
                    {gym.state ? `, ${gym.state}` : ""}
                    {gym.country ? ` - ${gym.country}` : ""}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                  <span>{t("common.viewOnMap", "View on map")}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            </div>
          )}

          {/* Contact Information */}
          {(gym.phone || gym.email || gym.website) && (
            <div className="space-y-4">
              <SectionHeader
                icon={<Phone className="w-5 h-5 text-primary" />}
                title={t("gymCard.contact", "Contact")}
              />
              <div className="grid grid-cols-1 gap-3">
                {gym.phone && (
                  <ContactRow
                    icon={<Phone className="w-4 h-4" />}
                    label={t("common.phone", "Phone")}
                    value={gym.phone}
                  />
                )}
                {gym.email && (
                  <ContactRow
                    icon={<Mail className="w-4 h-4" />}
                    label={t("common.email", "Email")}
                    value={gym.email}
                  />
                )}
                {gym.website && (
                  <ContactRow
                    icon={<Globe className="w-4 h-4" />}
                    label={t("common.website", "Website")}
                    value={gym.website.replace(/^https?:\/\//, "")}
                    isLink
                    href={gym.website}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {(gym.address ||
        gym.city ||
        gym.state ||
        gym.country ||
        gym.phone ||
        gym.email ||
        gym.website) && <div className="h-px bg-border/50" />}

      {/* Services and Plans Section */}
      {(gym.settings?.servicesOffered?.length || plans.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Services */}
          {gym.settings?.servicesOffered &&
            gym.settings.servicesOffered.length > 0 && (
              <div className="space-y-6">
                <SectionHeader
                  icon={<Flame className="w-5 h-5 text-orange-500" />}
                  title={t("gymCard.servicesOffered", "Services")}
                />
                <div className="flex flex-wrap gap-2">
                  {gym.settings.servicesOffered.map((service, idx) => (
                    <ServiceTag
                      key={idx}
                      label={
                        typeof service === "string"
                          ? SERVICE_LABELS[service] || service
                          : SERVICE_LABELS[service.name] || service.name
                      }
                      colorClass={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Pricing/Plans */}
          {plans.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <SectionHeader
                  icon={
                    <CircleDollarSign className="w-5 h-5 text-emerald-500" />
                  }
                  title={t("gymCard.availablePlans", "Plans")}
                />
                {plans.length > 2 && (
                  <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase">
                    +{plans.length - 2} {t("common.more", "More")}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {plans.slice(0, 3).map((plan: any) => (
                  <PricingRow
                    key={plan._id}
                    plan={plan}
                    gym={gym}
                    language={language as AppLanguage}
                    t={t}
                    shortServiceLabels={SHORT_SERVICE_LABELS}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Section */}
      {!hideActions && (
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/30">
          {activeDashboard === "coach" && !isStaff && !isJoined && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isPending && !isJoining) {
                  if (onJoin) {
                    onJoin();
                  } else {
                    handleJoin(e as any);
                  }
                }
              }}
              disabled={isPending || isJoining}
              className={cn(
                "flex-[2] py-4 rounded-xl font-black text-lg transition-all active:scale-[0.98] shadow-sm",
                isPending || isJoining
                  ? "bg-warning/10 text-warning border border-warning/20 cursor-wait"
                  : "bg-primary text-white hover:bg-primary-hover shadow-primary/20",
              )}
            >
              {isPending || isJoining
                ? t("gyms.status_pending", "Request Pending")
                : t("gymCard.joinGym", "Join Gym")}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSettings();
            }}
            className="flex-1 py-4 rounded-xl bg-surface border border-border text-text-primary font-bold text-lg hover:border-primary hover:text-primary transition-all active:scale-[0.98]"
          >
            {t("gymCard.viewMoreDetails", "Details")}
          </button>
        </div>
      )}
    </div>
  );
}

/* --- Redesigned Internal Helper Components --- */

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 ">
      <div className="p-2 bg-muted/20 rounded-lg border border-border/50">
        {icon}
      </div>
      <h4 className="text-xs font-black text-text-primary uppercase tracking-wider">
        {title}
      </h4>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
  isLink,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/30 hover:bg-muted/10 hover:border-border/50 transition-all duration-300">
      <div className="text-text-secondary">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-tighter mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-text-primary truncate">{value}</p>
      </div>
      {isLink && <ExternalLink className="w-3 h-3 text-text-secondary" />}
    </div>
  );

  if (isLink && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </a>
    );
  }

  return content;
}

function ServiceTag({
  label,
  colorClass,
}: {
  label: string;
  colorClass: string;
}) {
  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-full text-[11px] bg-surface/50 font-bold border uppercase tracking-wide",
        colorClass,
      )}
    >
      {label}
    </span>
  );
}

function PricingRow({
  plan,
  gym,
  language,
  t,
  shortServiceLabels,
}: {
  plan: any;
  gym: Gym;
  language: AppLanguage;
  t: any;
  shortServiceLabels: Record<string, string>;
}) {
  const lowestTier = useMemo(
    () => plan.pricingTiers?.sort((a: any, b: any) => a.price - b.price)[0],
    [plan.pricingTiers],
  );

  const durationLabel = useMemo(
    () =>
      lowestTier
        ? formatDuration(lowestTier.duration, lowestTier.durationUnit, t)
        : "",
    [lowestTier, t],
  );

  const planName =
    (plan.customName && capitalize(plan.customName)) ||
    (plan.services && plan.services.length > 0
      ? plan.services.map((s: string) => shortServiceLabels[s] || s).join(" + ")
      : t("pricing.form.regularPlan", "Regular Plan"));

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-border/50 hover:border-primary/30 transition-all group">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-xs font-black text-text-primary uppercase tracking-tight truncate group-hover:text-primary transition-colors">
          {planName}
        </p>
        {durationLabel && (
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">
            {durationLabel}
          </p>
        )}
      </div>
      <p className="text-base font-black text-primary leading-none">
        {lowestTier
          ? formatPrice(
              lowestTier.price,
              gym.settings?.defaultCurrency || "DZD",
              language,
            )
          : t("common.n_a", "N/A")}
      </p>
    </div>
  );
}
