import {
  type CoachProfile,
  type CoachQueryDto,
} from "@ahmedrioueche/gympro-client";
import { MapPin, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import Button from "../../../../../components/ui/Button";
import InputField from "../../../../../components/ui/InputField";
import SearchFilterBar from "../../../../../components/ui/SearchFilterBar";
import { COACH_SPECIALIZATIONS } from "../../../../../constants/gym";
import { useNearbyCoaches } from "../../../../../hooks/queries/useCoaches";
import { useUpdateProfile } from "../../../../../hooks/queries/useProfile";
import { useModalStore } from "../../../../../store/modal";
import { useUserStore } from "../../../../../store/user";
import PageHeader from "../../../../components/PageHeader";
import CoachesList from "./components/CoachesList";

export default function CoachesPage() {
  const { t } = useTranslation();
  const { user, updateUser } = useUserStore();
  const { openModal } = useModalStore();
  const updateProfile = useUpdateProfile(user?._id || "");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Initialize location from user's profile
  useEffect(() => {
    if (user?.profile) {
      if (user.profile.city) setCity(user.profile.city);
      if (user.profile.state) setState(user.profile.state);
      if (user.profile.country) setCountry(user.profile.country);
      // Show filters by default if user has location set
      if (user.profile.city || user.profile.state || user.profile.country) {
        setShowFilters(true);
      }
    }
  }, [user?.profile]);

  // Build query for API
  const query: CoachQueryDto = {
    ...(city && { city }),
    ...(state && { state }),
    ...(country && { country }),
    ...(specialization !== "all" && { specialization }),
  };

  // Fetch nearby coaches based on filters
  const { data: coaches = [], isLoading } = useNearbyCoaches(query);

  // Filter by search query on client side
  const filteredCoaches = coaches.filter((coach) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      coach.fullName?.toLowerCase().includes(query) ||
      coach.username?.toLowerCase().includes(query)
    );
  });

  const handleSelectCoach = (coach: CoachProfile) => {
    openModal("coach_profile", { coachId: coach.userId });
  };

  // Detect user location
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error(t("coaches.filters.locationError"));
      return;
    }

    setDetectingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;

      // Use reverse geocoding API (Nominatim - free and open source)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );

      if (!response.ok) throw new Error("Geocoding failed");

      const data = await response.json();
      const address = data.address;

      // Extract location details
      const detectedCity =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "";
      const detectedState =
        address.state || address.province || address.region || "";
      const detectedCountry = address.country || "";

      // Update local state
      setCity(detectedCity);
      setState(detectedState);
      setCountry(detectedCountry);
      setShowFilters(true);

      // Save to user profile for future use
      updateProfile.mutate(
        {
          city: detectedCity,
          state: detectedState,
          country: detectedCountry,
        },
        {
          onSuccess: (updatedUser) => {
            // Update Zustand store with new profile
            if (user) {
              updateUser({
                ...user,
                profile: updatedUser.profile,
              });
            }
          },
          onError: (error) => {
            console.error("Failed to save location to profile:", error);
            // Don't show error to user - location is still set locally
          },
        }
      );

      toast.success(t("coaches.filters.locationDetected"));
    } catch (error) {
      console.error("Location detection error:", error);
      toast.error(t("coaches.filters.locationError"));
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleClearFilters = () => {
    setCity("");
    setState("");
    setCountry("");
    setSpecialization("all");
    setSearchQuery("");
  };

  const activeFilterCount =
    (city ? 1 : 0) +
    (state ? 1 : 0) +
    (country ? 1 : 0) +
    (specialization !== "all" ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("coaches.title")}
        subtitle={t("coaches.subtitle")}
        icon={UserCheck}
      />

      {/* Search and Specialization Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("coaches.filters.search")}
        filterValue={specialization}
        onFilterChange={setSpecialization}
        filterOptions={COACH_SPECIALIZATIONS}
      />

      {/* Location Filters */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-text-secondary" />
            <h3 className="font-semibold text-text-primary">
              {t("common.locationFilters")}
            </h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <div className="flex items-center md:flex-row flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDetectLocation}
              loading={detectingLocation}
            >
              {detectingLocation
                ? t("coaches.filters.detecting")
                : t("coaches.filters.detectLocation")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? t("common.hide") : t("common.show")}{" "}
              {t("common.filters")}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label={t("coaches.filters.city")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={t("coaches.filters.cityPlaceholder")}
              />
              <InputField
                label={t("coaches.filters.state")}
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder={t("coaches.filters.statePlaceholder")}
              />
              <InputField
                label={t("coaches.filters.country")}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder={t("coaches.filters.countryPlaceholder")}
              />
            </div>

            {activeFilterCount > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  icon={<X className="w-4 h-4" />}
                  iconPosition="left"
                >
                  {t("coaches.filters.clearFilters")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-secondary">
        {t("coaches.filters.showingResults", { count: filteredCoaches.length })}
      </div>

      {/* Coaches List */}
      <CoachesList
        coaches={filteredCoaches}
        isLoading={isLoading}
        onSelectCoach={handleSelectCoach}
      />
    </div>
  );
}
