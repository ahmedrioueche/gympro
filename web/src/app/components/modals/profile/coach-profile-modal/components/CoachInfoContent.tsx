import type { CoachProfile } from "@ahmedrioueche/gympro-client";
import { Award, Briefcase, Dumbbell, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CoachInfoContentProps {
  coach: CoachProfile;
}

export function CoachInfoContent({ coach }: CoachInfoContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-surface-hover border border-border rounded-xl p-4 text-center">
          <Star className="w-5 h-5 mx-auto text-warning mb-2" />
          <p className="text-xl font-bold text-text-primary">
            {coach.rating?.toFixed(1) || "N/A"}
          </p>
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            {t("coaches.card.rating")}
          </p>
        </div>
        <div className="bg-surface-hover border border-border rounded-xl p-4 text-center">
          <Briefcase className="w-5 h-5 mx-auto text-primary mb-2" />
          <p className="text-xl font-bold text-text-primary">
            {coach.yearsOfExperience || 0}
          </p>
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            {t("common.years")}
          </p>
        </div>
        <div className="bg-surface-hover border border-border rounded-xl p-4 text-center">
          <Dumbbell className="w-5 h-5 mx-auto text-success mb-2" />
          <p className="text-xl font-bold text-text-primary">
            {coach.totalClients || 0}
          </p>
          <p className="text-xs text-text-secondary uppercase tracking-wider">
            {t("sidebar.clients")}
          </p>
        </div>
      </div>

      {/* Bio */}
      {coach.bio && (
        <div className="bg-surface-hover border border-border rounded-xl p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            {t("memberProfile.about")}
          </h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            {coach.bio}
          </p>
        </div>
      )}

      {/* Specializations */}
      {coach.specializations && coach.specializations.length > 0 && (
        <div className="bg-surface-hover border border-border rounded-xl p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {t("coaches.specializations")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {coach.specializations.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {coach.certifications && coach.certifications.length > 0 && (
        <div className="bg-surface-hover border border-border rounded-xl p-4">
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {t("coaches.certifications")}
          </h4>
          <div className="space-y-2">
            {coach.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">{cert.name}</span>
                {cert.year && (
                  <span className="text-xs text-text-secondary">
                    {cert.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
