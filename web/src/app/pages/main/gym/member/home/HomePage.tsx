import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, Clock, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../store/gym";
import { useGymAnnouncements } from "./hooks/useGymAnnouncements";
import { getGoogleMapsUrl, useGymMemberHome } from "./hooks/useGymMemberHome";

function HomePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const status = useGymMemberHome(currentGym?.settings);
  const { data: announcements = [], isLoading: announcementsLoading } =
    useGymAnnouncements(currentGym?._id);

  if (!currentGym) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {t("home.gymMember.noGym", "No gym selected")}
          </h2>
          <p className="text-text-secondary">
            {t(
              "home.gymMember.selectGym",
              "Please select a gym to view details"
            )}
          </p>
        </div>
      </div>
    );
  }

  const hasAddress = !![
    currentGym.address,
    currentGym.city,
    currentGym.country,
  ].filter(Boolean).length;

  // Status styling
  const getStatusStyles = () => {
    if (!status.isOpen) {
      return {
        gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20",
        badge: "bg-error text-white",
        glow: "shadow-red-500/20",
      };
    }
    if (status.isWomenOnly) {
      return {
        gradient: "from-pink-500/20 via-fuchsia-500/20 to-purple-500/20",
        badge: "bg-pink-500 text-white",
        glow: "shadow-pink-500/20",
      };
    }
    return {
      gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
      badge: "bg-success text-white",
      glow: "shadow-emerald-500/20",
    };
  };

  const styles = getStatusStyles();

  const getStatusText = () => {
    if (!status.isOpen) return t("home.gymMember.status.closed", "Closed");
    if (status.isWomenOnly)
      return t("home.gymMember.status.womenOnlyNow", "Women Only Now");
    if (status.currentSession === "menOnly")
      return t("home.gymMember.status.menOnlyNow", "Men Only Now");
    return t("home.gymMember.status.open", "Open Now");
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto h-[calc(100vh-4rem)] flex flex-col gap-6">
        {/* Hero Status Section - Takes 35% height */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${styles.gradient} border border-border shadow-2xl ${styles.glow} flex-shrink-0`}
          style={{ minHeight: "35vh" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />

          <div className="relative h-full p-8 flex flex-col justify-between">
            {/* Top: Gym Name & Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-2 truncate">
                  {currentGym.name}
                </h1>
                {currentGym.slogan && (
                  <p className="text-lg text-text-secondary/80 line-clamp-1">
                    {currentGym.slogan}
                  </p>
                )}
              </div>

              <div
                className={`${styles.badge} px-6 py-3 rounded-2xl font-black text-xl shadow-xl flex-shrink-0`}
              >
                {getStatusText()}
              </div>
            </div>

            {/* Bottom: Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hours Info */}
              {currentGym.settings?.workingHours && (
                <div className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
                  <div className="text-sm font-bold text-text-secondary mb-2">
                    {status.isOpen ? "Closes at" : "Opens at"}
                  </div>
                  <div className="text-3xl font-black text-text-primary">
                    {status.isOpen
                      ? currentGym.settings.workingHours.end
                      : currentGym.settings.workingHours.start}
                  </div>
                </div>
              )}

              {/* Location Quick Access */}
              {hasAddress && (
                <a
                  href={getGoogleMapsUrl(currentGym)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-surface/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:bg-surface hover:scale-[1.02] transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-text-secondary mb-1">
                        Location
                      </div>
                      <div className="text-lg font-bold text-text-primary truncate">
                        {currentGym.city || currentGym.address}
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid - Takes remaining 65% height with matching card styles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Left: Operating Hours - Matching card structure */}
          <div className="bg-surface border border-border rounded-3xl shadow-sm flex flex-col min-h-0">
            <div className="p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  {t("home.gym.hours.title", "Operating Hours")}
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {currentGym.settings?.workingHours ? (
                <div className="space-y-4">
                  {/* Total Working Hours */}
                  <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-text-primary">
                        {t(
                          "settings.gym.general.workingHours",
                          "Working Hours"
                        )}
                      </span>
                    </div>
                    <span className="text-text-secondary font-mono font-bold">
                      {currentGym.settings.workingHours.start} -{" "}
                      {currentGym.settings.workingHours.end}
                    </span>
                  </div>

                  {/* Gender Session Info */}
                  {currentGym.settings.isMixed ? (
                    <div className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                      <span className="font-semibold text-indigo-600">
                        {t("home.gym.hours.mixed", "Mixed Session")}
                      </span>
                      <span className="text-indigo-700 font-mono text-sm font-bold">
                        {currentGym.settings.workingHours.start} -{" "}
                        {currentGym.settings.workingHours.end}
                      </span>
                    </div>
                  ) : currentGym.settings.femaleOnlyHours?.length ? (
                    <div className="border border-pink-500/20 bg-pink-500/5 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-pink-600">
                          {t("home.gym.hours.womenOnly", "Women Only")}
                        </span>
                      </div>
                      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                        {currentGym.settings.femaleOnlyHours.map(
                          (slot, idx) => (
                            <div
                              key={idx}
                              className="bg-surface/50 border border-border rounded-xl p-3 flex flex-col gap-1.5 shadow-sm"
                            >
                              <span className="text-pink-700 font-mono text-sm font-bold block">
                                {slot.range.start} - {slot.range.end}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {slot.days.map((day) => (
                                  <span
                                    key={day}
                                    className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-pink-100 text-pink-600 border border-pink-200"
                                  >
                                    {t(
                                      `settings.gym.general.days.${day.toLowerCase()}`,
                                      day.slice(0, 3)
                                    )}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
                      <span className="font-semibold text-blue-600">
                        {t("home.gym.hours.menOnly", "Men Only")}
                      </span>
                      <span className="text-blue-700 font-mono text-sm font-bold">
                        {currentGym.settings.workingHours.start} -{" "}
                        {currentGym.settings.workingHours.end}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-text-secondary">
                    No operating hours configured
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Announcements - Matching card structure */}
          <div className="bg-surface border border-border rounded-3xl shadow-sm flex flex-col min-h-0">
            <div className="p-6 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-xl text-warning">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  {t("home.gymMember.announcements.title", "Announcements")}
                </h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 min-h-0">
              {announcementsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-muted/50 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📢</div>
                  <p className="text-text-secondary">
                    {t(
                      "home.gymMember.announcements.empty",
                      "No announcements at the moment"
                    )}
                  </p>
                </div>
              ) : (
                announcements.slice(0, 10).map((announcement) => (
                  <div
                    key={announcement._id}
                    className="p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 transition-all cursor-pointer hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-bold text-text-primary flex-1 line-clamp-1">
                        {announcement.title}
                      </h4>
                      {announcement.priority === "high" && (
                        <span className="px-2 py-1 rounded-lg bg-error/20 text-error text-xs font-bold flex-shrink-0 border border-error/30">
                          {t("home.gymMember.announcements.urgent", "Urgent")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                      {announcement.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary/70">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(announcement.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
