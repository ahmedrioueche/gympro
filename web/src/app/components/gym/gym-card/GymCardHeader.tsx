import type { Gym } from "@ahmedrioueche/gympro-client";
import { useTranslation } from "react-i18next";
import { GymCardMedia } from "./GymCardMedia";

interface GymCardHeaderProps {
  gym: Gym;
  displayRole?: string;
}

export function GymCardHeader({ gym, displayRole }: GymCardHeaderProps) {
  const { t } = useTranslation();

  const hasMedia = !!(gym.bannerUrl || (gym.media && gym.media.length > 0));
  const textColorClass = hasMedia ? "text-white" : "text-text-primary";
  const secondaryTextColorClass = hasMedia
    ? "text-white/80"
    : "text-text-secondary";

  return (
    <div
      className={`relative overflow-hidden border-b border-border/50 transition-all duration-300 ${
        hasMedia ? "h-48 md:h-56 lg:h-64" : "h-auto md:h-38"
      }`}
    >
      {/* Media Carousel or Banner */}
      <GymCardMedia gym={gym} canViewMedia={!displayRole} />

      <div className="relative z-10 h-full p-4 md:p-8 flex flex-col justify-end">
        <div className="flex items-center justify-between md:flex-row md:gap-4">
          {/* Icon or Gym Image + Name */}
          <div className="flex items-center gap-3 md:gap-6 min-w-0">
            {gym.logoUrl ? (
              <img
                src={gym.logoUrl}
                alt={gym.name}
                className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-xl md:text-5xl shadow-lg group-hover:scale-110 transition-transform duration-500 shrink-0">
                🏢
              </div>
            )}

            <div className="min-w-0">
              <h2
                className={`text-base md:text-3xl lg:text-4xl font-bold mb-0.5 md:mb-1 group-hover:text-primary transition-colors duration-300 truncate ${textColorClass}`}
              >
                {gym.name}
              </h2>

              {gym.slogan && (
                <p
                  className={`text-[10px] md:text-base italic truncate ${secondaryTextColorClass}`}
                >
                  "{gym.slogan}"
                </p>
              )}
            </div>
          </div>

          {/* Status Badges Container */}
          <div className="flex flex-row items-center gap-1 md:gap-2 shrink-0">
            {/* Role Badge */}
            {displayRole && (
              <div className="px-2 py-0.5 md:px-5 md:py-2.5 rounded-full text-[8px] md:text-sm font-black uppercase tracking-wider shadow-md bg-blue-500/20 text-blue-500 border border-blue-500/30 whitespace-nowrap">
                {t(`roles.${displayRole.toLowerCase()}`, displayRole)}
              </div>
            )}

            {/* Status Badge */}
            <div
              className={`px-2 py-0.5 md:px-5 md:py-2.5 rounded-full text-[8px] md:text-sm font-black uppercase tracking-wider shadow-md whitespace-nowrap border ${
                gym.isActive
                  ? "bg-success/20 text-success border-success/30"
                  : "bg-danger/20 text-danger border-danger/30"
              }`}
            >
              {gym.isActive
                ? t("gyms.status_open", "Open")
                : t("gyms.status_closed", "Closed")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
