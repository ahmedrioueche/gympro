import type { Gym } from "@ahmedrioueche/gympro-client";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Check,
  ChevronDown,
  Dumbbell,
  MapPin,
  Plus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../constants/navigation";
import { useGymStore } from "../../store/gym";

interface GymSelectorProps {
  gyms?: Gym[];
  showAllGymsOption?: boolean;
  className?: string;
}

export default function GymSelector({
  gyms = [],
  showAllGymsOption = true,
  className = "",
}: GymSelectorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const { currentGym, setGym } = useGymStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle gym selection
  const handleGymChange = (gymId: string | null) => {
    setIsOpen(false);
    const selected = gyms.find((g) => g._id === gymId) || null;
    setGym(selected);

    if (gymId) {
      navigate({ to: `/gym` });
    }
  };

  // Safe selection
  const selectedGym = Array.isArray(gyms)
    ? gyms.find((gym) => gym._id === currentGym?._id)
    : undefined;

  return (
    <div className={`relative w-full ${className}`} ref={selectRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border transition-all duration-200 w-full md:min-w-[280px] ${
          selectedGym
            ? "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 hover:border-primary/40"
            : "bg-background/50 border-border hover:border-primary/30 hover:bg-primary/5"
        }`}
      >
        {/* Icon/Logo */}
        <div
          className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md sm:rounded-lg flex-shrink-0 transition-all ${
            selectedGym
              ? "bg-gradient-to-br from-primary to-secondary text-white shadow-md sm:shadow-lg shadow-primary/20"
              : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          {selectedGym?.logoUrl ? (
            <img
              src={selectedGym.logoUrl}
              alt={selectedGym.name}
              className="w-full h-full object-cover rounded-md sm:rounded-lg"
            />
          ) : (
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 text-left min-w-0">
          {selectedGym ? (
            <>
              <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                {selectedGym.name}
              </div>
              {selectedGym.city && (
                <div className="hidden sm:flex items-center gap-1 text-xs text-text-secondary mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{selectedGym.city}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-xs sm:text-sm font-medium text-text-secondary">
                {t("gym.no_gym_selected", "Select a gym")}
              </div>
              <div className="hidden sm:block text-xs text-text-secondary/70 mt-0.5">
                {gyms.length} {gyms.length === 1 ? "gym" : "gyms"} available
              </div>
            </>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-secondary transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 sm:mt-2 bg-background/95 backdrop-blur-xl border border-border rounded-lg sm:rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
            {Array.isArray(gyms) && gyms.length > 0 ? (
              <div className="p-1.5 sm:p-2 space-y-0.5 sm:space-y-1">
                {gyms.map((gym) => {
                  const isSelected = selectedGym
                    ? gym._id === selectedGym._id
                    : false;
                  return (
                    <button
                      key={gym._id}
                      onClick={() => handleGymChange(gym._id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-md sm:rounded-lg transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 sm:ring-2 ring-primary/20"
                          : "hover:bg-surface-hover"
                      }`}
                    >
                      {/* Gym Logo/Icon */}
                      <div
                        className={`relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-md sm:rounded-lg flex-shrink-0 ${
                          isSelected
                            ? "bg-gradient-to-br from-primary to-secondary"
                            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
                        }`}
                      >
                        {gym.logoUrl ? (
                          <img
                            src={gym.logoUrl}
                            alt={gym.name}
                            className="w-full h-full object-cover rounded-md sm:rounded-lg"
                          />
                        ) : (
                          <Dumbbell
                            className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${
                              isSelected
                                ? "text-white"
                                : "text-gray-400 dark:text-gray-500"
                            }`}
                          />
                        )}
                      </div>

                      {/* Gym Info */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isSelected ? "text-primary" : "text-text-primary"
                            }`}
                          >
                            {gym.name}
                          </span>
                          {gym.isActive === false && (
                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-warning/20 text-warning font-medium flex-shrink-0">
                              Inactive
                            </span>
                          )}
                        </div>
                        {(gym.city || gym.slogan) && (
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-text-secondary mt-0.5 sm:mt-1">
                            {gym.city && (
                              <>
                                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                <span className="truncate">{gym.city}</span>
                              </>
                            )}
                            {!gym.city && gym.slogan && (
                              <span className="truncate italic">
                                {gym.slogan}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 sm:px-6 py-8 sm:py-10 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-medium text-text-primary mb-1">
                  {t("gym.noGyms", "No gyms yet")}
                </p>
                <p className="text-[10px] sm:text-xs text-text-secondary">
                  {t("gym.createFirst", "Create your first gym to get started")}
                </p>
              </div>
            )}
          </div>

          {/* Create New Gym Button */}
          {showAllGymsOption && (
            <div className="border-t border-border p-1.5 sm:p-2 bg-background/50">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate({ to: APP_PAGES.manager.createGym.link });
                }}
                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg bg-gradient-to-r from-success/10 to-success/5 hover:from-success/20 hover:to-success/10 border border-success/20 hover:border-success/30 text-success font-medium transition-all duration-200 group"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110 group-hover:rotate-90 duration-200" />
                <span className="text-xs sm:text-sm font-semibold">
                  {t("gym.createNew", "Create New Gym")}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
