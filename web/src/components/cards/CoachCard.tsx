import { type CoachProfile } from "@ahmedrioueche/gympro-client";
import { Award, MapPin, Star, User, Users } from "lucide-react";

interface CoachCardProps {
  coach: CoachProfile;
  onViewDetails: (coach: CoachProfile) => void;
}

export default function CoachCard({ coach, onViewDetails }: CoachCardProps) {
  const displayName = coach.fullName || coach.username;
  const location = [coach.location?.city, coach.location?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
      onClick={() => onViewDetails(coach)}
    >
      {/* Header with Avatar and Name */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0">
          <div className="w-full h-full rounded-full bg-surface border-2 border-surface overflow-hidden flex items-center justify-center">
            {coach.profileImageUrl ? (
              <img
                src={coach.profileImageUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-text-secondary" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-text-primary truncate">
              {displayName}
            </h3>
            {coach.isVerified && (
              <div className="p-1 rounded-full bg-blue-500/10">
                <Award className="w-4 h-4 text-blue-500" />
              </div>
            )}
          </div>

          {coach.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-text-primary">
                {coach.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {coach.bio && (
        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {coach.bio}
        </p>
      )}

      {/* Specializations */}
      {coach.specializations && coach.specializations.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {coach.specializations.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
            >
              {spec}
            </span>
          ))}
          {coach.specializations.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-surface-hover text-text-secondary font-medium">
              +{coach.specializations.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-text-secondary pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location}</span>
            </div>
          )}
          {coach.totalClients !== undefined && coach.totalClients > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{coach.totalClients} clients</span>
            </div>
          )}
        </div>

        {coach.yearsOfExperience && (
          <span className="font-medium text-primary">
            {coach.yearsOfExperience} yrs exp
          </span>
        )}
      </div>
    </div>
  );
}
