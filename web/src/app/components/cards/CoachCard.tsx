import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import {
  Award,
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Star,
  User,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface CoachCardProps {
  coach: CoachProfile;
  onViewDetails?: (coach: CoachProfile) => void;
  onInvite?: () => void;
  isInviting?: boolean;
  affiliationStatus?: string;
  // Action props for coaching page
  onAccept?: () => void;
  onDecline?: () => void;
  onRemove?: () => void;
  isActive?: boolean;
  isPending?: boolean;
}

export default function CoachCard({
  coach,
  onViewDetails,
  onInvite,
  isInviting,
  affiliationStatus,
  onAccept,
  onDecline,
  onRemove,
  isActive,
  isPending,
}: CoachCardProps) {
  const { t } = useTranslation();
  const displayName = coach.fullName || coach.username;
  const location = [
    coach.location?.city,
    coach.location?.state,
    coach.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(coach);
    }
  };

  // Determine footer content based on props
  const renderFooter = () => {
    // Accept/Decline actions for pending
    if (isPending && (onAccept || onDecline)) {
      return (
        <div className="flex gap-2 w-full">
          {onAccept && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              {t("common.accept")}
            </button>
          )}
          {onDecline && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDecline();
              }}
              className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
            >
              <UserMinus className="w-4 h-4" />
              {t("common.decline")}
            </button>
          )}
        </div>
      );
    }

    // Remove action for active coaches
    if (isActive && onRemove) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-text-secondary text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-1"
        >
          <UserMinus className="w-4 h-4" />
          {t("coaching.removeCoach")}
        </button>
      );
    }

    // Affiliation status badge
    if (affiliationStatus) {
      return (
        <div
          className={`w-full cursor-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm ${
            affiliationStatus === "active"
              ? "bg-green-500/10 text-green-600 border border-green-500/20"
              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
          }`}
        >
          {affiliationStatus === "active"
            ? t("coaching.alreadyAffiliated")
            : t("coaching.invitePending")}
        </div>
      );
    }

    // Invite button
    if (onInvite) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvite();
          }}
          disabled={isInviting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {isInviting ? t("common.loading") : t("coaching.inviteCoach")}
        </button>
      );
    }

    // Default: View profile
    return (
      <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
        <span>{t("coaches.viewProfile")}</span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group flex flex-col ${
        onViewDetails ? "cursor-pointer" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Header Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-6 pb-4">
        {/* Verified Badge (if applicable) */}
        {coach.isVerified && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30">
              <Award className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600">
                {t("coaches.verified")}
              </span>
            </div>
          </div>
        )}

        {/* Status Badge for Active/Pending */}
        {(isActive || isPending) && (
          <div className="absolute top-4 right-4">
            {isActive && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-semibold text-green-600">
                  {t("coaching.active")}
                </span>
              </div>
            )}
            {isPending && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-500/30">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">
                  {t("coaching.awaitingApproval")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0 shadow-lg">
              <div className="w-full h-full rounded-2xl bg-surface overflow-hidden flex items-center justify-center">
                {coach.profileImageUrl ? (
                  <img
                    src={coach.profileImageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-text-secondary" />
                )}
              </div>
            </div>
            {/* Online/Active Status Indicator (placeholder - can be made dynamic) */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface" />
          </div>

          <div className="flex-1 min-w-0 mt-1">
            <h3 className="text-xl font-bold text-text-primary truncate mb-2 group-hover:text-primary transition-colors">
              {displayName}
            </h3>

            {/* Rating and Experience Row */}
            <div className="flex items-center gap-3 flex-wrap mb-3">
              {coach.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold text-text-primary text-sm">
                    {coach.rating.toFixed(1)}
                  </span>
                  <span className="text-text-secondary text-xs">/5.0</span>
                </div>
              )}

              {coach.yearsOfExperience && (
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {coach.yearsOfExperience} {t("coaches.yearsShort")}
                  </span>
                </div>
              )}
            </div>

            {/* Location and Clients Info */}
            <div className="flex items-center gap-3 flex-wrap">
              {location && (
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium truncate max-w-[200px]">
                    {location}
                  </span>
                </div>
              )}
              {coach.totalClients !== undefined && coach.totalClients > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded-full bg-primary/10">
                    <Users className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">
                    {coach.totalClients}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {t(
                      coach.totalClients === 1
                        ? "coaches.client"
                        : "coaches.clients"
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 pt-4 flex-1 flex flex-col">
        {/* Bio */}
        {coach.bio && (
          <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
            {coach.bio}
          </p>
        )}

        {/* Specializations */}
        {coach.specializations && coach.specializations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                {t("coaches.specializations")}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {coach.specializations.slice(0, 4).map((spec, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold border border-primary/20 hover:border-primary/40 transition-colors"
                >
                  {spec}
                </span>
              ))}
              {coach.specializations.length > 4 && (
                <span className="text-xs px-3 py-1.5 rounded-lg bg-muted text-text-secondary font-medium">
                  +{coach.specializations.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-auto pt-4 border-t border-border/50">
          {renderFooter()}
        </div>
      </div>
    </div>
  );
}
