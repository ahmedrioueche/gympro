import type { Gym } from "@ahmedrioueche/gympro-client";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatAddress, getGoogleMapsUrl } from "../hooks/useGymMemberHome";

interface LocationCardProps {
  gym: Gym;
}

export default function LocationCard({ gym }: LocationCardProps) {
  const { t } = useTranslation();
  const address = formatAddress(gym);
  const hasAddress = !![gym.address, gym.city, gym.country].filter(Boolean)
    .length;

  if (!hasAddress) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-xl text-primary">
          <MapPin className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-text-primary">
          {t("home.gymMember.location.title", "Location")}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="text-text-secondary leading-relaxed">
          {gym.address && <div className="font-medium">{gym.address}</div>}
          <div>
            {[gym.city, gym.state].filter(Boolean).join(", ")}
            {gym.country && <div>{gym.country}</div>}
          </div>
        </div>

        <a
          href={getGoogleMapsUrl(gym)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <ExternalLink className="w-4 h-4" />
          {t("home.gymMember.location.getDirections", "Get Directions")}
        </a>
      </div>
    </div>
  );
}
