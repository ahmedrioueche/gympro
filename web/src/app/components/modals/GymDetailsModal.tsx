import { formatPrice, type AppLanguage } from "@ahmedrioueche/gympro-client";
import {
  Activity,
  CircleDollarSign,
  Clock,
  Dot,
  Dumbbell,
  Globe,
  Info,
  Mail,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../components/ui/BaseModal";
import { useGymSubscriptionTypes } from "../../../hooks/queries/useGymSubscriptionTypes";
import { useLanguageStore } from "../../../store/language";
import { useModalStore } from "../../../store/modal";
import { cn, formatDuration } from "../../../utils/helper";

export function GymDetailsModal() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const { currentModal, closeModal, gymDetailsProps } = useModalStore();

  const isOpen = currentModal === "gym_details";
  const gym = gymDetailsProps?.gym;

  const { data: plans = [], isLoading: isLoadingPlans } =
    useGymSubscriptionTypes(gym?._id || "");

  if (!gym) return null;

  const hasLocation = !!(gym.address || gym.city || gym.state || gym.country);
  const hasContact = !!(gym.phone || gym.email || gym.website);
  const hasServices = !!gym.settings?.servicesOffered?.length;
  const hasPlans = plans.length > 0;
  const hasRules = !!gym.settings?.rules?.length;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      title={gym.name}
      subtitle={
        gym.slogan || t("gymCard.exclusiveLocation", "Elite Training Facility")
      }
      icon={Dumbbell}
      maxWidth="max-w-6xl"
      noPadding
    >
      <div className="relative isolate min-h-[70vh] flex flex-col bg-background">
        {/* --- CINEMATIC BACKGROUND CANVAS --- */}
        <div className="absolute inset-x-0 top-0 h-[320px] md:h-[450px] z-0 overflow-hidden">
          {gym.bannerUrl ? (
            <img
              src={gym.bannerUrl}
              alt={gym.name}
              className="w-full h-full object-cover brightness-[0.4] contrast-125 transition-transform duration-1000 scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/40 via-surface/10 to-secondary/40 animate-gradient-xy" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        {/* --- OVERLAY CONTENT LAYER --- */}
        <div className="relative z-10 p-5 md:p-10 space-y-10 md:space-y-12">
          {/* HEADER HERO (Location & Identity) */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end justify-between pt-6 md:pt-10">
            <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-center md:items-start text-center md:text-left">
              {gym.logoUrl && (
                <div className="relative group shrink-0">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-2xl md:rounded-[2.5rem] blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                  <img
                    src={gym.logoUrl}
                    className="relative w-28 h-28 md:w-44 md:h-44 rounded-2xl md:rounded-[2.2rem] border-4 border-white/20 shadow-2xl bg-background object-cover"
                    alt="logo"
                  />
                </div>
              )}
              <div className="space-y-3 md:space-y-4 text-white">
                <div className="flex items-center gap-2.5 opacity-80 justify-center md:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em]">
                    {t("gymCard.territory", "Territory")}
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-5xl font-black tracking-tighter leading-none drop-shadow-2xl">
                    {gym.address ||
                      t("common.no_location_available", "No location available")}
                  </h2>
                  <p className="text-base md:text-lg font-bold opacity-70 italic tracking-wide">
                    {gym.city}
                    {gym.state ? `, ${gym.state}` : ""}
                    {gym.country ? ` - ${gym.country}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {hasLocation && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gym.address || ""} ${gym.city || ""} ${gym.state || ""} ${gym.country || ""}`.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-white/95 text-black hover:bg-white font-black uppercase tracking-widest text-[11px] transition-all shadow-2xl border border-white/20 hover:-translate-y-1 active:translate-y-0"
              >
                <Navigation className="text-black w-4 h-4 inline-block mr-2" />
                {t("common.launch_nav", "Navigate")}
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* --- MAIN COLUMN (Tiers, Schedule, Matrix) --- */}
            <div className="lg:col-span-12 xl:col-span-8 space-y-14">
              
              {/* 1. PACKAGES & PRICING */}
              <section className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3.5 md:gap-4">
                  <CircleDollarSign className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary">
                    {t("gymCard.investment", "Packages & Pricing")}
                  </h3>
                </div>

                {isLoadingPlans ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-48 rounded-[2.5rem] bg-surface-secondary animate-pulse border border-border/50"
                      />
                    ))}
                  </div>
                ) : hasPlans ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan: any) => (
                      <div
                        key={plan._id}
                        className="p-8 rounded-[2.5rem] bg-surface border border-border hover:border-primary/40 transition-all shadow-sm group"
                      >
                        <div className="space-y-6">
                          <h4 className="text-xl font-black text-text-primary uppercase group-hover:text-primary transition-colors">
                            {plan.customName ||
                              plan.services?.join(" + ") ||
                              "Base"}
                          </h4>
                          {plan.description && (
                            <p className="text-sm text-text-secondary line-clamp-2 opacity-80 italic">
                              "{plan.description}"
                            </p>
                          )}
                          <div className="space-y-2.5 pt-4 border-t border-border/50">
                            {plan.pricingTiers
                              ?.sort((a: any, b: any) => a.price - b.price)
                              .map((tier: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center bg-surface-secondary/40 p-3.5 md:p-4 rounded-xl"
                                >
                                  <span className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-widest">
                                    {formatDuration(
                                      tier.duration,
                                      tier.durationUnit,
                                      t,
                                    )}
                                  </span>
                                  <span className="text-xl md:text-2xl font-black text-text-primary tabular-nums">
                                    {formatPrice(
                                      tier.price,
                                      gym.settings?.defaultCurrency || "USD",
                                      language as AppLanguage,
                                    )}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyCard
                    text={t(
                      "gymCard.contact_for_plans",
                      "Contact gym for private pricing",
                    )}
                  />
                )}
              </section>

              {/* 2. TIMELINES (SCHEDULE) - Moving to main column for consistency */}
              <section className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3.5 md:gap-4">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary">
                    {t("gymCard.timelines", "Operating Timelines")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Card */}
                  <div className="p-8 rounded-[2.5rem] bg-surface border border-border hover:border-primary/40 transition-all shadow-sm group">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-6 bg-primary rounded-full group-hover:h-8 transition-all" />
                         <h4 className="text-xl font-black text-text-primary uppercase">{t("common.regular_hours", "Regular Hours")}</h4>
                      </div>
                      <div className="p-5 md:p-6 bg-surface-secondary/40 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center gap-1.5 md:gap-2">
                        <span className="text-[9px] md:text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Open Daily</span>
                        <span className="text-2xl md:text-3xl font-black text-text-primary tracking-tighter">
                          {gym.settings?.workingHours
                            ? `${gym.settings.workingHours.start} - ${gym.settings.workingHours.end}`
                            : "N/A"}
                        </span>
                      </div>
                      
                      {/* Mixed / Separate Status */}
                      <div className={cn(
                        "p-4 rounded-xl border flex items-center gap-3",
                        gym.settings?.isMixed
                          ? "bg-success/5 border-success/20 text-success"
                          : "bg-warning/5 border-warning/20 text-warning",
                      )}>
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                          {gym.settings?.isMixed
                            ? t("gymCard.mixed_entry", "Mixed Environment")
                            : t("gymCard.segregated_entry", "Segregated Sessions")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Female Card (Only if exists) */}
                  {gym.settings?.femaleOnlyHours?.length ? (
                    <div className="p-8 rounded-[2.5rem] bg-surface border border-border hover:border-pink-500/40 transition-all shadow-sm group">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-pink-500 rounded-full group-hover:h-8 transition-all" />
                           <h4 className="text-xl font-black text-text-primary uppercase text-pink-500">{t("gymCard.female_exclusive", "Female Only")}</h4>
                        </div>
                        <div className="space-y-3">
                          {gym.settings.femaleOnlyHours.map((slot, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center p-3.5 md:p-4 bg-pink-500/5 rounded-xl border border-pink-500/10 group-hover:border-pink-500/20 transition-all"
                            >
                              <span className="text-[9px] md:text-[10px] font-black text-pink-600/70 uppercase">
                                {slot.days.map((d) => d.substring(0, 3)).join(" / ")}
                              </span>
                              <span className="text-base md:text-lg font-black text-text-primary tabular-nums">
                                {slot.range.start} - {slot.range.end}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-border/60 bg-surface/30 flex flex-col items-center justify-center text-center opacity-60">
                       <ShieldCheck className="w-10 h-10 text-text-secondary mb-3" />
                       <h5 className="text-[11px] font-black uppercase text-text-secondary tracking-widest">Unified Access</h5>
                       <p className="text-xs font-bold text-text-secondary mt-1">Universal training schedule applied</p>
                    </div>
                  )}
                </div>
              </section>

              {/* 3. SERVICES MATRIX (FACILITY) */}
              {hasServices && (
                <section className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3.5 md:gap-4">
                    <Activity className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-text-primary">
                      {t("gymCard.facility_matrix", "Facility Matrix")}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {gym.settings?.servicesOffered?.map((s, i) => (
                      <div
                        key={i}
                        className="px-6 py-4 md:px-8 md:py-5 rounded-2xl md:rounded-[2rem] bg-surface border border-border shadow-sm hover:border-primary/30 transition-all group cursor-default"
                      >
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-text-primary group-hover:text-primary transition-colors">
                          {typeof s === "string" ? s : s.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* --- SIDEBAR COLUMN (Contact, Protocol) --- */}
            <div className="lg:col-span-12 xl:col-span-4 space-y-10 lg:sticky lg:top-8">
              
              {/* CONTACT PANEL */}
              {hasContact && (
                <div className="p-7 md:p-10 rounded-3xl md:rounded-[3rem] bg-text-primary text-background shadow-2xl space-y-7 md:space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -translate-x-4 -translate-y-4" />
                  <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-40">
                    {t("gymCard.comms", "Core Communication")}
                  </h4>
                  <div className="space-y-4 md:space-y-5 relative">
                    {gym.phone && (
                      <SidebarItem
                        value={gym.phone}
                        icon={<Phone className="w-4 h-4" />}
                      />
                    )}
                    {gym.email && (
                      <SidebarItem
                        value={gym.email}
                        icon={<Mail className="w-4 h-4" />}
                      />
                    )}
                    {gym.website && (
                      <SidebarItem
                        value={gym.website.replace(/^https?:\/\//, "")}
                        icon={<Globe className="w-4 h-4" />}
                        href={gym.website}
                      />
                    )}
                  </div>
                </div>
              )}

               {/* PROTOCOL RULES */}
              {hasRules && (
                <div className="p-7 md:p-10 rounded-3xl md:rounded-[3rem] bg-surface/50 backdrop-blur-xl border border-border shadow-xl space-y-7 md:space-y-8">
                  <div className="flex items-center gap-3.5 md:gap-4 text-text-secondary/60">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                    <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.3em]">Protocol</h4>
                  </div>
                  <div className="space-y-4 md:space-y-5">
                    {gym.settings?.rules?.map((rule, idx) => (
                      <div key={idx} className="flex gap-4 items-start group">
                        <Dot className="w-5 h-5 text-primary shrink-0 transition-transform group-hover:scale-150" />
                        <p className="text-sm font-bold text-text-secondary leading-snug group-hover:text-text-primary transition-colors">
                          {rule}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="p-16 rounded-[3rem] border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-center bg-surface/30 opacity-60">
      <Info className="w-10 h-10 text-text-secondary mb-3" />
      <p className="text-sm font-bold text-text-secondary">{text}</p>
    </div>
  );
}

function SidebarItem({
  value,
  icon,
  href,
}: {
  value: string;
  icon: React.ReactNode;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 md:gap-5 group cursor-pointer overflow-hidden">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white transition-all shadow-inner shrink-0 group-hover:scale-110">
        {icon}
      </div>
      <p className="text-xs md:text-sm font-bold truncate tracking-tight flex-1">
        {value}
      </p>
    </div>
  );
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block outline-none"
    >
      {content}
    </a>
  ) : (
    content
  );
}
