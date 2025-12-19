import {
  CURRENCY_SYMBOLS,
  type SupportedCurrency,
} from "@ahmedrioueche/gympro-client";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../../../../components/ui/CustomSelect";
import { getSupportedRegions } from "../../../../../lib/api/regionDetection";

interface RegionCurrencyViewProps {
  selectedRegion: string;
  selectedCurrency: SupportedCurrency;
  onRegionChange: (
    region: string,
    regionName: string,
    currency: SupportedCurrency
  ) => void;
  onNext: () => void;
  isDetecting?: boolean;
}

export function RegionCurrencyView({
  selectedRegion,
  selectedCurrency,
  onRegionChange,
  onNext,
  isDetecting,
}: RegionCurrencyViewProps) {
  const { t } = useTranslation();
  const regions = getSupportedRegions();
  console.log({ selectedRegion });
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
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          {t("onboarding.regionCurrency.info")}
        </p>

        {/* Detection Status */}
        {isDetecting && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span>{t("onboarding.regionCurrency.detecting")}</span>
          </div>
        )}
      </div>

      {/* Region Selector */}
      <CustomSelect
        title={t("onboarding.regionCurrency.region")}
        options={regionOptions}
        selectedOption={selectedRegion}
        onChange={handleRegionChange}
      />

      {/* Detect Location Button */}
      {/* Confirm Button */}
      <button
        onClick={onNext}
        disabled={isDetecting}
        className="w-full p-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t("onboarding.regionCurrency.confirm")}
      </button>
    </div>
  );
}
