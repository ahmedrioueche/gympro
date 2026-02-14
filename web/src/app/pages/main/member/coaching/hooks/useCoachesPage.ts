import {
  type CoachProfile,
  type CoachQueryDto,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNearbyCoaches } from "../../../../../../hooks/queries/useCoaches";
import { useUpdateProfile } from "../../../../../../hooks/queries/useProfile";
import { useModalStore } from "../../../../../../store/modal";
import { useUserStore } from "../../../../../../store/user";

export function useCoachesPage() {
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
  const [gender, setGender] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Initialize location and gender from user's profile
  useEffect(() => {
    if (user?.profile) {
      if (user.profile.city) setCity(user.profile.city);
      if (user.profile.state) setState(user.profile.state);
      if (user.profile.country) setCountry(user.profile.country);
      if (user.profile.gender) setGender(user.profile.gender);

      // Show filters by default if user has location or gender set
      if (
        user.profile.city ||
        user.profile.state ||
        user.profile.country ||
        user.profile.gender
      ) {
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
    ...(gender !== "all" && { gender }),
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
        },
      );

      const { latitude, longitude } = position.coords;

      // Use reverse geocoding API (Nominatim - free and open source)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
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
        },
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
    setGender(user?.profile?.gender || "all");
    setSearchQuery("");
  };

  const activeFilterCount =
    (city ? 1 : 0) +
    (state ? 1 : 0) +
    (country ? 1 : 0) +
    (specialization !== "all" ? 1 : 0) +
    (gender !== "all" && gender !== user?.profile?.gender ? 1 : 0);

  return {
    t,
    searchQuery,
    setSearchQuery,
    specialization,
    setSpecialization,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    gender,
    setGender,
    showFilters,
    setShowFilters,
    detectingLocation,
    isLoading,
    filteredCoaches,
    activeFilterCount,
    handleSelectCoach,
    handleDetectLocation,
    handleClearFilters,
  };
}
