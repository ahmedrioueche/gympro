import { formatDistanceToNow } from "date-fns";
import { Bell, Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGymStore } from "../../../../../../store/gym";
import GymHeroSection from "../../../../../components/gym/GymHeroSection";
import { useSubscriptionTypes } from "../../manager/pricing/hooks/useSubscriptionTypes";
import { MemberPricingCard } from "./components/MemberPricingCard";
import { useGymAnnouncements } from "./hooks/useGymAnnouncements";
import { useGymMemberHome } from "./hooks/useGymMemberHome";

function HomePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const status = useGymMemberHome(currentGym?.settings);
  const { data: announcements = [], isLoading: announcementsLoading } =
    useGymAnnouncements(currentGym?._id);
  const { data: plans = [], isLoading: plansLoading } = useSubscriptionTypes();

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col gap-6 pb-8">
      <GymHeroSection gym={currentGym} status={status} />

      {/* Bottom Grid - Matching card styles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-4 lg:min-h-0">
        {/* Left: Operating Hours - Matching card structure */}
        <div className="bg-surface border border-border rounded-3xl shadow-sm flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
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
                      {t("settings.gym.general.workingHours", "Working Hours")}
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
                    <div className="grid gap-2 grid-cols-1 xl:grid-cols-2">
                      {currentGym.settings.femaleOnlyHours.map((slot, idx) => (
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
                      ))}
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
              <div className="h-full flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted/10 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-text-secondary/50" />
                </div>
                <p className="text-text-secondary font-medium">
                  {t("home.gymMember.noHours", "No operating hours configured")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Announcements - Matching card structure */}
        <div className="bg-surface border border-border rounded-3xl shadow-sm flex flex-col min-h-[350px] lg:min-h-0 overflow-hidden">
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
                    className="h-24 bg-muted/50 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : announcements.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted/10 rounded-full mb-4">
                  <Bell className="w-8 h-8 text-text-secondary/50" />
                </div>
                <p className="text-text-secondary font-medium text-center">
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

      {/* Plans Section - Elevated Section */}
      {plans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-xl font-bold text-text-primary">
              {t("home.gymMember.plans.title", "Subscription Plans")}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans
              .filter((p) => p.isAvailable)
              .map((plan) => (
                <MemberPricingCard key={plan._id} plan={plan} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
