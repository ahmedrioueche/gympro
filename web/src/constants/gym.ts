import type { FilterOption } from "../components/ui/SearchFilterBar";

export const COACH_SPECIALIZATIONS: FilterOption[] = [
  { value: "all", label: "extra.specializations.all" },
  {
    value: "Strength Training",
    label: "extra.specializations.strengthTraining",
  },
  { value: "Weight Loss", label: "extra.specializations.weightLoss" },
  { value: "Muscle Building", label: "extra.specializations.muscleBuilding" },
  { value: "CrossFit", label: "extra.specializations.crossFit" },
  { value: "Yoga", label: "extra.specializations.yoga" },
  { value: "Pilates", label: "extra.specializations.pilates" },
  { value: "Nutrition", label: "extra.specializations.nutrition" },
  {
    value: "Sports Performance",
    label: "extra.specializations.sportsPerformance",
  },
  { value: "Rehabilitation", label: "extra.specializations.rehabilitation" },
  { value: "Senior Fitness", label: "extra.specializations.seniorFitness" },
];
