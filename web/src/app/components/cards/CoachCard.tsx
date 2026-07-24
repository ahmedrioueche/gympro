import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import {
  Award,
  Briefcase,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Star,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../store/modal";
import { getNameInitials } from "../../../utils/helper";

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
  // Selection props
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onReview?: () => void;
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
  selectable,
  isSelected,
  onSelect,
  onReview,
}: CoachCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const displayName = coach.fullName || coach.username;
  const location = [
    coach.location?.city,
    coach.location?.state,
    coach.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const handleViewProfile = () => {
    if (onViewDetails) {
      onViewDetails(coach);
    } else {
      openModal("coach_profile", {
        coach,
        onRemove: isActive && onRemove ? onRemove : undefined,
      });
    }
  };

  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect();
    } else {
      handleViewProfile();
    }
  };

  // Determine footer content based on props
  const renderFooter = () => {
    // If selectable, show selection state or verified badge if no specific footer action
    if (selectable) {
      return (
        <div
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            isSelected
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-surface-secondary text-text-secondary group-hover:bg-surface-secondary/80"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4" />
              {t("common.selected", "Selected")}
            </>
          ) : (
            t("common.select", "Select")
          )}
        </div>
      );
    }

    // Accept/Decline or Review actions for pending
    if (isPending && (onAccept || onDecline || onReview)) {
      if (onReview) {
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReview();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all shadow-sm"
          >
            <UserCheck className="w-4 h-4" />
            {t("admin.coaching.reviewModal.title", "Review Request")}
          </button>
        );
      }

      return (
        <div className="flex gap-3 w-full">
          {onAccept && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAccept();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transition-all flex items-center justify-center gap-2"
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
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2 border border-red-200"
            >
              <UserMinus className="w-4 h-4" />
              {t("common.decline")}
            </button>
          )}
        </div>
      );
    }

    // View Profile action for active coaches (remove has moved to profile)

    // Affiliation status badge (only for active/pending)
    if (
      affiliationStatus &&
      (affiliationStatus === "active" || affiliationStatus === "pending")
    ) {
      return (
        <div
          className={`w-full cursor-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm ${
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          {isInviting ? t("common.loading") : t("coaching.inviteCoach")}
        </button>
      );
    }

    // Default: View profile
    return (
      <div className="flex items-center justify-between w-full text-primary font-bold text-sm group-hover:text-primary/80 transition-all px-1">
        <span>{t("coaches.viewProfile")}</span>
        <div className="p-1.5 rounded-full bg-primary/5 group-hover:bg-primary/20 group-hover:translate-x-1 transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-surface border rounded-[2rem] overflow-hidden transition-all duration-300 group flex flex-col h-full relative ${
        selectable
          ? isSelected
            ? "border-primary ring-4 ring-primary/20 shadow-xl shadow-primary/10"
            : "border-border hover:border-primary/50 hover:shadow-lg opacity-70 hover:opacity-100 cursor-pointer"
          : "border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 duration-500"
      } ${onViewDetails && !selectable ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      {/* Selection Overlay */}
      {selectable && isSelected && (
        <div className="absolute top-4 right-4 z-10 bg-primary text-white rounded-full p-1.5 shadow-lg shadow-primary/30 animate-in zoom-in duration-300">
          <Check className="w-5 h-5" />
        </div>
      )}

      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100%] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header Section */}
      <div className="relative p-6 pb-0">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-primary/20 p-[1px] shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-3xl bg-surface overflow-hidden flex items-center justify-center">
                {coach.profileImageUrl ? (
                  <img
                    src={coach.profileImageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <span className="text-3xl font-black text-white">
                      {getNameInitials(displayName)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Status dot */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface rounded-2xl flex items-center justify-center shadow-lg border border-border">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Verified Badge */}
            {coach.isVerified && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 backdrop-blur-md">
                <Award className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                  {t("coaches.verified")}
                </span>
              </div>
            )}

            {/* Gender Badge */}
            {coach.gender && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-accent/5 border border-accent/10 backdrop-blur-md">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black text-accent uppercase tracking-wider">
                  {t(`common.${coach.gender}`)}
                </span>
              </div>
            )}

            {/* Availability Badge (if isActive/isPending) */}
            {(isActive || isPending) && (
              <>
                {isActive && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-success/5 border border-success/10 backdrop-blur-md">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-[10px] font-black text-success uppercase tracking-wider">
                      {t("coaching.active")}
                    </span>
                  </div>
                )}
                {isPending && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 backdrop-blur-md">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                      {t("coaching.awaitingApproval")}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors">
            {displayName}
          </h3>
          {location && (
            <div className="flex items-center gap-1.5 text-text-primary">
              <MapPin className="w-3.5 h-3.5 text-primary/60" />
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                {location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/30 rounded-2xl p-3 border border-border/50 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">
                {t("coaches.rating")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-text-primary">
                {coach.rating !== undefined ? coach.rating.toFixed(1) : "N/A"}
              </span>
              {coach.rating !== undefined && (
                <span className="text-xs font-bold text-text-primary italic opacity-60">
                  /5.0
                </span>
              )}
            </div>
          </div>

          <div className="bg-primary/30 rounded-2xl p-3 border border-border/50 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">
                {t("coaches.experience")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-text-primary">
                {coach.yearsOfExperience || "0"}
              </span>
              <span className="text-xs font-bold text-text-primary italic opacity-60">
                {t("coaches.yearsShort")}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {coach.bio && (
          <div className="relative">
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed font-medium italic opacity-80">
              "{coach.bio}"
            </p>
          </div>
        )}

        {/* Specializations */}
        {coach.specializations && coach.specializations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
              <Sparkles className="w-4 h-4 text-primary opacity-60" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {coach.specializations.slice(0, 3).map((spec, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-3 py-1.5 rounded-full bg-surface border border-border text-text-primary font-black uppercase tracking-wider hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
                >
                  {spec}
                </span>
              ))}
              {coach.specializations.length > 3 && (
                <span className="text-[10px] px-3 py-1.5 rounded-full bg-primary text-text-primary font-black uppercase tracking-wider">
                  +{coach.specializations.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-auto pt-4 flex flex-col gap-4">
          {coach.totalClients !== undefined && coach.totalClients > 0 && (
            <div className="flex items-center justify-center gap-2 text-text-primary">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold">
                {coach.totalClients}{" "}
                {t(
                  coach.totalClients === 1
                    ? "coaches.client"
                    : "coaches.clients",
                ).toLowerCase()}
              </span>
              <div className="w-1 h-1 rounded-full bg-text-primary/30" />
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-full border-2 border-surface bg-primary flex items-center justify-center overflow-hidden"
                  >
                    <User className="w-3 h-3 text-text-primary" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2">{renderFooter()}</div>
        </div>
      </div>
    </div>
  );
}
