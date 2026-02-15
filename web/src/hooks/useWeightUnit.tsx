import { useUserStore } from "../store/user";

const useWeightUnit = () => {
  const { user } = useUserStore();

  // Try to get from user settings (global)
  const weightUnit = user?.appSettings?.locale?.weightUnit || "kg";

  const toBaseUnit = (val: number) => {
    if (weightUnit === "lbs") {
      return val / 2.20462;
    }
    return val;
  };

  const fromBaseUnit = (val: number) => {
    if (weightUnit === "lbs") {
      return val * 2.20462;
    }
    return val;
  };

  const formatWeight = (val: number, decimals = 1) => {
    const converted = fromBaseUnit(val);
    return `${converted.toFixed(decimals)} ${weightUnit}`;
  };

  return {
    unit: weightUnit,
    toBaseUnit,
    fromBaseUnit,
    formatWeight,
    // For backward compatibility
    toString: () => weightUnit,
  };
};

export default useWeightUnit;
