import {
  adminApi,
  type AppFeaturePackage,
  type CreateAppPlanDto,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { Check, Eye, EyeOff, Package } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PlanFeaturesProps {
  formData: CreateAppPlanDto;
  togglePackage: (pkgId: string) => void;
  togglePackageVisibility: (pkgId: string) => void;
}

export function PlanFeatures({
  formData,
  togglePackage,
  togglePackageVisibility,
}: PlanFeaturesProps) {
  const { t } = useTranslation();

  const { data: packages = [] } = useQuery({
    queryKey: ["adminFeaturePackages", "active"],
    queryFn: async () => {
      const res = await adminApi.getFeaturePackages(true);
      return Array.isArray(res) ? res : (res as any).data;
    },
  });

  const selectedPackageIds = (formData as any).featurePackages || [];
  const publicPackageIds = (formData as any).publicFeaturePackages || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          {t("admin.pricing.packages", "Marketable Packages")}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg: AppFeaturePackage) => {
          const isSelected = selectedPackageIds.includes(pkg._id);
          const isPublic = publicPackageIds.includes(pkg._id);

          return (
            <div
              key={pkg._id}
              className={`rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-surface hover:border-text-secondary/20"
              }`}
            >
              <div className="flex items-center gap-2 p-4">
                <button
                  onClick={() => togglePackage(pkg._id)}
                  className="flex-1 flex items-center gap-4 text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-border"
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-bold ${
                        isSelected ? "text-primary" : "text-text-primary"
                      }`}
                    >
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5 opacity-70">
                      {pkg.features.length}{" "}
                      {t("admin.pricing.features", "Features")}
                    </p>
                  </div>
                </button>

                {isSelected && (
                  <button
                    onClick={() => togglePackageVisibility(pkg._id)}
                    title={
                      isPublic
                        ? t("admin.pricing.makeHidden", "Make Hidden")
                        : t("admin.pricing.makePublic", "Make Public")
                    }
                    className={`p-2 rounded-xl transition-all ${
                      isPublic
                        ? "text-primary bg-primary/10"
                        : "text-text-secondary/30 hover:text-text-secondary hover:bg-surface-hover"
                    }`}
                  >
                    {isPublic ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {packages.length === 0 && (
          <div className="p-8 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
            <Package className="w-8 h-8 text-text-secondary/20 mb-3" />
            <p className="text-sm text-text-secondary font-medium">
              {t(
                "admin.pricing.noPackagesFound",
                "No marketable packages found",
              )}
            </p>
            <p className="text-xs text-text-secondary/60 mt-1">
              {t(
                "admin.pricing.createPackagesFirst",
                "Create packages in the 'Packages' tab first.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
