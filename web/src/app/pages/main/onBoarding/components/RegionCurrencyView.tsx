import {
  CURRENCY_SYMBOLS,
  type AppCurrency,
} from "@ahmedrioueche/gympro-client";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import { getSupportedRegions } from "../../../../../utils/regionDetection";

interface RegionCurrencyViewProps {
  selectedRegion: string;
  selectedCurrency: AppCurrency;
  onRegionChange: (
    region: string,
    regionName: string,
    currency: AppCurrency
  ) => void;
  onNext: () => void;
}

export function RegionCurrencyView({
  selectedRegion,
  selectedCurrency,
  onRegionChange,
  onNext,
}: RegionCurrencyViewProps) {
  const { t } = useTranslation();
  const regions = getSupportedRegions();

  const regionOptions = regions.map((r) => ({
    value: r.code,
    label: r.name,
    name: CURRENCY_SYMBOLS[r.currency],
    currency: r.currency,
  }));

  const handleRegionChange = (code: string) => {
    const region = regions.find((r) => r.code === code);
    if (region) {
      onRegionChange(region.code, region.name, region.currency);
    }
  };

  return (
    <div className="fade-in-up">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Globe className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {t("onboarding.regionCurrency.title")}
        </h2>
      </div>

      {/* Default Currency Display */}
      <div className="mb-6 p-4 bg-surface rounded-xl border border-border">
        <p className="text-sm text-text-secondary mb-1">
          {t("onboarding.regionCurrency.defaultCurrency")}
        </p>
        <p className="text-2xl font-bold text-text-primary">
          {CURRENCY_SYMBOLS[selectedCurrency]} ({selectedCurrency})
        </p>
      </div>

      {/* Region Selector */}
      <CustomSelect
        title={t("onboarding.regionCurrency.region")}
        options={regionOptions}
        selectedOption={selectedRegion}
        onChange={handleRegionChange}
      />

      {/* Confirm Button */}
      <button
        onClick={onNext}
        className="w-full p-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 mt-6"
      >
        {t("onboarding.regionCurrency.confirm")}
      </button>
    </div>
  );
}
