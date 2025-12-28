import { type Gym } from "@ahmedrioueche/gympro-client";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

interface GymInfoCardProps {
  gym: Gym;
}

export default function GymInfoCard({ gym }: GymInfoCardProps) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
      {/* Logo */}
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden flex-shrink-0">
        {gym.logoUrl ? (
          <img
            src={gym.logoUrl}
            alt={gym.name}
            className="w-full h-full object-cover"
          />
        ) : (
          gym.name.charAt(0)
        )}
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0 space-y-2">
        <h2 className="text-3xl font-bold text-text-primary tracking-tight">
          {gym.name}
        </h2>
        {gym.slogan && (
          <p className="text-text-secondary text-lg italic opacity-80">
            "{gym.slogan}"
          </p>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
          {gym.address && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{gym.address}</span>
            </div>
          )}
          {gym.phone && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Phone className="w-4 h-4 text-primary" />
              <span>{gym.phone}</span>
            </div>
          )}
          {gym.email && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span>{gym.email}</span>
            </div>
          )}
          {gym.website && (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Globe className="w-4 h-4 text-primary" />
              <span>{gym.website}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
