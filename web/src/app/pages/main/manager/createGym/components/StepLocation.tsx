import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputField from "../../../../../../components/ui/InputField";
import StepHeader from "./StepHeader";

declare global {
  interface Window {
    L: any;
  }
}

function StepLocation({ formData, handleChange, steps }) {
  const { t } = useTranslation();
  const [useMap, setUseMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([36.7538, 3.0588]); // Default: Algiers
  const [marker, setMarker] = useState(null);
  const [map, setMap] = useState(null);
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
  }, [useMap]);

  const initMap = () => {
    // Wait for DOM element
    setTimeout(() => {
      const mapElement = document.getElementById("location-map");
      if (!mapElement || !window.L) return;

      const newMap = window.L.map("location-map").setView(mapCenter, 13);

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(newMap);

      // Add click handler
      newMap.on("click", async (e) => {
        handleMapClick(e.latlng, newMap);
      });

      setMap(newMap);

      // If we have existing coordinates, add marker
      if (formData.latitude && formData.longitude) {
        const existingMarker = window.L.marker([
          formData.latitude,
          formData.longitude,
        ]).addTo(newMap);
        setMarker(existingMarker);
        newMap.setView([formData.latitude, formData.longitude], 15);
      }
    }, 100);
  };

  const handleMapClick = async (latlng, mapInstance) => {
    if (!window.L) return;

    // Remove existing marker
    if (marker) {
      marker.remove();
    }

    // Add new marker
    const newMarker = window.L.marker([latlng.lat, latlng.lng]).addTo(
      mapInstance
    );
    setMarker(newMarker);

    // Reverse geocode to get address
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await response.json();

      // Update form data with coordinates and address
      const address = data.address || {};
      const syntheticEvent = {
        target: { name: "latitude", value: latlng.lat },
      };
      handleChange(syntheticEvent);

      handleChange({
        target: { name: "longitude", value: latlng.lng },
      });

      handleChange({
        target: {
          name: "address",
          value:
            `${address.road || ""} ${address.house_number || ""}`.trim() ||
            data.display_name,
        },
      });

      handleChange({
        target: {
          name: "city",
          value: address.city || address.town || address.village || "",
        },
      });

      handleChange({
        target: { name: "state", value: address.state || "" },
      });

      handleChange({
        target: { name: "country", value: address.country || "" },
      });
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
        const newCenter = [latitude, longitude];
        setMapCenter(newCenter);

        if (map) {
          map.setView(newCenter, 15);
          handleMapClick({ lat: latitude, lng: longitude }, map);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location");
      }
    );
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <StepHeader
        icon="📍"
        title={steps[1].title}
        desc={steps[1].description}
      />

      {/* Toggle Button */}
      <div
        onClick={() => setUseMap(!useMap)}
        className="flex cursor-pointer items-center justify-between p-4 bg-surface rounded-lg border border-border-secondary"
      >
        <div className="flex items-center gap-3">
          <span className={`text-2xl ${useMap ? "" : "grayscale opacity-50"}`}>
            🗺️
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {t("create_gym.form.using_map")}
            </p>
            <p className="text-xs text-gray-400">
              {t("create_gym.form.click_map_hint")}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setUseMap(!useMap)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            useMap ? "bg-blue-500" : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              useMap ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {useMap ? (
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative">
            <div
              id="location-map"
              className="w-full h-96 rounded-lg border border-gray-700 z-0"
            />
            {isGeocoding && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="bg-gray-800 px-4 py-2 rounded-lg text-white text-sm">
                  {t("create_gym.form.loading_address") || "Loading address..."}
                </div>
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-500/30"
          >
            <span>📍</span>
            <span className="text-sm font-medium">
              {t("create_gym.form.use_current_location") ||
                "Use My Current Location"}
            </span>
          </button>

          {/* Display populated fields (read-only in map mode) */}
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 space-y-2">
            <p className="text-xs text-gray-400 mb-2">
              {t("create_gym.form.auto_populated") ||
                "Auto-populated from map:"}
            </p>
            {formData.address && (
              <p className="text-sm text-white">📍 {formData.address}</p>
            )}
            {(formData.city || formData.state || formData.country) && (
              <p className="text-sm text-gray-300">
                {[formData.city, formData.state, formData.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {formData.latitude && formData.longitude && (
              <p className="text-xs text-gray-500">
                Coordinates: {formData.latitude.toFixed(6)},{" "}
                {formData.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <InputField
            label={t("create_gym.form.address_label")}
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t("create_gym.form.address_placeholder")}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t("create_gym.form.city_label")}
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={t("create_gym.form.city_placeholder")}
            />
            <InputField
              label={t("create_gym.form.state_label")}
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={t("create_gym.form.state_placeholder")}
            />
          </div>

          <InputField
            label={t("create_gym.form.country_label")}
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder={t("create_gym.form.country_placeholder")}
          />
        </>
      )}
    </div>
  );
}

export default StepLocation;
