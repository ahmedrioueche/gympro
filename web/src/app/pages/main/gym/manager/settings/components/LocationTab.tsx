import { MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../../../../../../../components/ui/Button";
import { Card } from "../../../../../../../components/ui/Card";
import InputField from "../../../../../../../components/ui/InputField";

declare global {
  interface Window {
    L: any;
  }
}

interface LocationTabProps {
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  country: string;
  setCountry: (country: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
  website: string;
  setWebsite: (website: string) => void;
}

export default function LocationTab({
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  phone,
  setPhone,
  email,
  setEmail,
  website,
  setWebsite,
}: LocationTabProps) {
  const { t } = useTranslation();
  const [useMap, setUseMap] = useState(false);
  const [mapCenter] = useState([36.7538, 3.0588]); // Default: Algiers
  const [marker, setMarker] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!useMap) return;

    // Add Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.async = true;

    script.onload = () => {
      initMap();
    };

    document.body.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMap]);

  const initMap = () => {
    setTimeout(() => {
      const mapElement = document.getElementById("settings-location-map");
      if (!mapElement || !window.L) return;

      const newMap = window.L.map("settings-location-map").setView(
        mapCenter,
        13,
      );

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(newMap);

      newMap.on("click", async (e: any) => {
        handleMapClick(e.latlng, newMap);
      });

      setMap(newMap);

      // If we have existing address, try to geocode it
      if (address && city) {
        geocodeAddress(`${address}, ${city}, ${country}`);
      }
    }, 100);
  };

  const geocodeAddress = async (searchAddress: string) => {
    if (!map || !window.L) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress)}&format=json&limit=1`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.setView([parseFloat(lat), parseFloat(lon)], 15);

        if (marker) marker.remove();
        const newMarker = window.L.marker([
          parseFloat(lat),
          parseFloat(lon),
        ]).addTo(map);
        setMarker(newMarker);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleMapClick = async (latlng: any, mapInstance: any) => {
    if (!window.L) return;

    if (marker) marker.remove();

    const newMarker = window.L.marker([latlng.lat, latlng.lng]).addTo(
      mapInstance,
    );
    setMarker(newMarker);

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`,
      );
      const data = await response.json();

      const addr = data.address || {};
      setAddress(
        `${addr.road || ""} ${addr.house_number || ""}`.trim() ||
          data.display_name,
      );
      setCity(addr.city || addr.town || addr.village || "");
      setState(addr.state || "");
      setCountry(addr.country || "");
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (map) {
          map.setView([latitude, longitude], 15);
          handleMapClick({ lat: latitude, lng: longitude }, map);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location");
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {t("gym.settings.location.title", "Location & Contact")}
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            {t(
              "gym.settings.location.description",
              "Update your gym's address and contact information.",
            )}
          </p>
        </div>
      </div>

      {/* Map Toggle */}
      <div
        onClick={() => setUseMap(!useMap)}
        className="flex cursor-pointer items-center justify-between p-4 bg-surface-hover rounded-xl border border-border"
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${useMap ? "" : "grayscale opacity-50"}`}>
            🗺️
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {t("gym.settings.location.useMap", "Use Interactive Map")}
            </p>
            <p className="text-xs text-text-secondary">
              {t(
                "gym.settings.location.mapHint",
                "Click on the map to set location",
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            useMap ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useMap ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Map Section */}
      {useMap && (
        <Card className="p-4 space-y-4">
          <div className="relative">
            <div
              id="settings-location-map"
              className="w-full h-80 rounded-lg border border-border z-0"
            />
            {isGeocoding && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-surface px-4 py-2 rounded-lg text-text-primary text-sm">
                  {t(
                    "gym.settings.location.loadingAddress",
                    "Loading address...",
                  )}
                </div>
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleUseCurrentLocation}
            className="w-full"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {t(
              "gym.settings.location.useCurrentLocation",
              "Use My Current Location",
            )}
          </Button>

          {(address || city || country) && (
            <div className="p-4 bg-surface-hover rounded-lg border border-border space-y-1">
              <p className="text-xs text-text-secondary mb-2">
                {t(
                  "gym.settings.location.autoPopulated",
                  "Auto-populated from map:",
                )}
              </p>
              {address && (
                <p className="text-sm text-text-primary">📍 {address}</p>
              )}
              {(city || state || country) && (
                <p className="text-sm text-text-secondary">
                  {[city, state, country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Address Section (Manual) */}
      {!useMap && (
        <Card className="p-6 space-y-5">
          <h4 className="font-semibold text-text-primary">
            {t("gym.settings.location.addressSection", "Address")}
          </h4>

          <div className="space-y-4">
            <InputField
              label={t("gym.settings.location.address", "Street Address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t(
                "gym.settings.location.addressPlaceholder",
                "123 Fitness Street",
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label={t("gym.settings.location.city", "City")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t(
                  "gym.settings.location.cityPlaceholder",
                  "New York",
                )}
              />
              <InputField
                label={t("gym.settings.location.state", "State/Province")}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={t("gym.settings.location.statePlaceholder", "NY")}
              />
            </div>

            <InputField
              label={t("gym.settings.location.country", "Country")}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder={t(
                "gym.settings.location.countryPlaceholder",
                "United States",
              )}
            />
          </div>
        </Card>
      )}

      {/* Contact Section (Always visible) */}
      <Card className="p-6 space-y-5">
        <h4 className="font-semibold text-text-primary">
          {t("gym.settings.location.contactSection", "Contact Information")}
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label={t("gym.settings.location.phone", "Phone Number")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t(
                "gym.settings.location.phonePlaceholder",
                "+1 (555) 123-4567",
              )}
            />
            <InputField
              label={t("gym.settings.location.email", "Email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t(
                "gym.settings.location.emailPlaceholder",
                "contact@yourgym.com",
              )}
              type="email"
            />
          </div>

          <InputField
            label={t("gym.settings.location.website", "Website")}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder={t(
              "gym.settings.location.websitePlaceholder",
              "https://yourgym.com",
            )}
          />
        </div>
      </Card>
    </div>
  );
}
