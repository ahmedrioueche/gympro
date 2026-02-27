import { ChevronRight, MapPin } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BaseView } from "./BaseView";

interface LocationData {
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export const LocationView = ({
  data,
  onChange,
  onNext,
}: {
  data: LocationData;
  onChange: (d: Partial<LocationData>) => void;
  onNext: () => void;
}) => {
  const { t } = useTranslation();
  const [detecting, setDetecting] = useState(false);

  const handleDetect = () => {
    setDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let newAddress = "";
          let newCity = "";
          let newCountry = "";

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            );
            const apiData = await response.json();
            const addr = apiData.address || {};

            newAddress =
              `${addr.road || ""} ${addr.house_number || ""}`.trim() ||
              apiData.display_name.split(",")[0];
            newCity =
              addr.city || addr.town || addr.village || addr.state || "";
            newCountry = addr.country || "";
          } catch (error) {
            console.error("Geocoding error:", error);
          }

          onChange({
            latitude: lat,
            longitude: lng,
            ...(newAddress && { address: newAddress }),
            ...(newCity && { city: newCity }),
            ...(newCountry && { country: newCountry }),
          });
          setDetecting(false);
        },
        () => {
          setDetecting(false);
        },
      );
    } else {
      setDetecting(false);
    }
  };

  const isComplete = data.address && data.city && data.country;

  return (
    <BaseView
      title={t("onboarding.location.title", "Where are you located?")}
      subtitle={t(
        "onboarding.location.subtitle",
        "We use this to connect you with nearby gyms.",
      )}
    >
      <div className="space-y-4">
        <button
          onClick={handleDetect}
          disabled={detecting}
          className="group relative overflow-hidden w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary/10 text-primary font-bold transition-all duration-300 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <MapPin
            size={20}
            className={
              detecting
                ? "animate-bounce"
                : "transition-transform group-hover:scale-110"
            }
          />
          <span className="relative z-10">
            {detecting
              ? t("onboarding.location.detecting", "Detecting...")
              : t("onboarding.actions.detectLocation", "Detect My Location")}
          </span>
        </button>
        <div className="flex items-center gap-3 opacity-60">
          <hr className="flex-1 border-border" />
          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            {t("common.orManually", "Or manually")}
          </span>
          <hr className="flex-1 border-border" />
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={data.address}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder={t(
              "onboarding.location.addressPlaceholder",
              "Street Address",
            )}
            className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder={t("onboarding.location.cityPlaceholder", "City")}
              className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
            />
            <input
              type="text"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder={t(
                "onboarding.location.countryPlaceholder",
                "Country",
              )}
              className="w-full p-4 font-medium text-text-primary rounded-xl bg-surface/50 border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-text-secondary/50 hover:bg-surface"
            />
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="relative overflow-hidden w-full mt-6 p-5 rounded-2xl bg-gradient-to-r from-primary to-primary-focus text-white font-bold transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2 hover:-translate-y-1"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t("onboarding.actions.next", "Next")}
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        </button>
      </div>
    </BaseView>
  );
};
