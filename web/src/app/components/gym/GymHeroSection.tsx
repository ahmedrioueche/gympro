import type { Gym } from "@ahmedrioueche/gympro-client";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getGymStatusStyles, getGymStatusText } from "../../../utils/gym";
import { cn } from "../../../utils/helper";
import {
  getGoogleMapsUrl,
  type GymStatus,
} from "../../pages/main/gym/member/home/hooks/useGymMemberHome";

interface GymHeroSectionProps {
  gym: Gym;
  status: GymStatus;
  action?: {
    label: string;
    onClick: () => void;
    icon: LucideIcon;
  };
}

export default function GymHeroSection({
  gym,
  status,
  action,
}: GymHeroSectionProps) {
  const { t } = useTranslation();

  const hasAddress = !![gym.address, gym.city, gym.country].filter(Boolean)
    .length;

  const styles = getGymStatusStyles(status);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-gradient-to-br border border-border shadow-2xl flex-shrink-0",
        styles.gradient,
        styles.glow
      )}
      style={{ minHeight: "35vh" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent animate-pulse duration-[10000ms]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] rounded-full -ml-32 -mb-32" />

      <div className="relative h-full p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
        {/* Top: Gym Name & Status */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 text-center sm:text-left">
          <div className="flex-1 min-w-0">
            <h1
              className={cn(
                "text-4xl md:text-6xl lg:text-7xl font-[1000] mb-2 truncate leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-r",
                styles.textGradient
              )}
            >
              {gym.name}
            </h1>
            {gym.slogan && (
              <p className="text-lg md:text-xl text-text-secondary/60 line-clamp-1 font-semibold tracking-wide uppercase">
                {gym.slogan}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 self-center sm:self-start flex-wrap justify-center sm:justify-end">
            {action && (
              <button
                onClick={action.onClick}
                className="flex items-center gap-2 px-4 py-3 bg-surface/70 backdrop-blur-md border border-border/50 rounded-2xl text-sm font-black text-text-primary hover:bg-surface hover:scale-105 transition-all shadow-lg group"
              >
                <action.icon className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
                <span className="whitespace-nowrap">{action.label}</span>
              </button>
            )}

            <div
              className={cn(
                "px-6 py-2 md:px-8 bg-surface/70 backdrop-blur-md rounded-2xl font-black text-lg md:text-xl shadow-xl flex-shrink-0 min-w-[120px] text-center",
                styles.badge
              )}
            >
              {getGymStatusText(status, t)}
            </div>
          </div>
        </div>

        {/* Bottom: Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 sm:mt-0">
          {/* Hours Info */}
          {gym.settings?.workingHours ? (
            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 text-center md:text-left">
              <div className="text-sm font-bold text-text-secondary mb-2">
                {status.isOpen ? "Closes at" : "Opens at"}
              </div>
              <div className="text-2xl md:text-3xl font-black text-text-primary">
                {status.isOpen
                  ? gym.settings.workingHours.end
                  : gym.settings.workingHours.start}
              </div>
            </div>
          ) : (
            <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
              <div className="text-center py-6 md:py-12">
                <p className="text-text-secondary font-medium">
                  {t(
                    "home.gym.noOperatingHours",
                    "No operating hours configured"
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Location Quick Access */}
          {hasAddress && (
            <a
              href={getGoogleMapsUrl(gym)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-surface hover:scale-[1.02] transition-all duration-200 group flex flex-col items-center md:items-start"
            >
              <div className="flex items-center justify-between w-full gap-3 text-center md:text-left">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-text-secondary mb-1">
                    {t("common.location", "Location")}
                  </div>
                  <div className="text-lg font-bold text-text-primary truncate">
                    {gym.city || gym.address}
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-primary group-hover:scale-110 transition-transform flex-shrink-0 hidden md:block" />
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
