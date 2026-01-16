import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import {
  Award,
  Briefcase,
  CheckCircle2,
  MapPin,
  Star,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../../../store/modal";

interface CoachHeroProps {
  coach: CoachProfile;
}

export function CoachHero({ coach }: CoachHeroProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const handleRequestCoaching = () => {
    openModal("request_coach", {
      coach,
    });
  };

  const formatLocation = () => {
    const parts = [
      coach.location?.city,
      coach.location?.state,
      coach.location?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : t("coachProfile.noLocation");
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
              {coach.profileImageUrl ? (
                <img
                  src={coach.profileImageUrl}
                  alt=""
                  className="w-28 h-28 rounded-2xl object-cover ring-2 ring-border shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 bg-surface-hover flex items-center justify-center rounded-2xl ring-2 ring-border shadow-lg">
                  <UserIcon className="w-14 h-14 text-text-secondary" />
                </div>
              )}
              {coach.isVerified && (
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg border-2 border-surface flex items-center justify-center shadow-md bg-success/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
              )}
            </div>

            {/* Coach Details */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* Name & Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-3">
                  {coach.fullName || t("coachProfile.unknownCoach")}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-surface-hover text-text-secondary text-xs font-semibold uppercase tracking-wider rounded-lg border border-border">
                    @{coach.username}
                  </span>
                  {coach.isVerified && (
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-semibold uppercase tracking-wider rounded-lg border border-success/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t("coachProfile.verified")}
                    </span>
                  )}
                  {coach.rating && coach.rating > 0 && (
                    <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-semibold uppercase tracking-wider rounded-lg border border-warning/20 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-warning" />
                      {coach.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info Grid */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-text-secondary">
                  <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {formatLocation()}
                  </span>
                </div>

                {coach.yearsOfExperience && coach.yearsOfExperience > 0 && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("coachProfile.yearsExperience", {
                        years: coach.yearsOfExperience,
                      })}
                    </span>
                  </div>
                )}

                {coach.totalClients !== undefined && coach.totalClients > 0 && (
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center border border-border">
                      <Users className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("coachProfile.totalClients", {
                        count: coach.totalClients,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section: Action Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-surface-hover border-2 border-primary/20 rounded-2xl p-6 space-y-5">
              {/* Bio Section */}
              {coach.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    {t("coachProfile.about")}
                  </h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {coach.bio}
                  </p>
                </div>
              )}

              {/* Specializations */}
              {coach.specializations && coach.specializations.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    {t("coachProfile.specializations")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {coach.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg border border-primary/20"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {coach.certifications && coach.certifications.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {t("coachProfile.certifications")}
                  </h4>
                  <div className="space-y-2">
                    {coach.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="text-sm text-text-primary bg-surface rounded-lg p-2 border border-border"
                      >
                        <p className="font-semibold">{cert.name}</p>
                        {cert.organization && (
                          <p className="text-xs text-text-secondary">
                            {cert.organization}
                            {cert.year && ` • ${cert.year}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleRequestCoaching}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              >
                {t("coachProfile.requestCoaching")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
