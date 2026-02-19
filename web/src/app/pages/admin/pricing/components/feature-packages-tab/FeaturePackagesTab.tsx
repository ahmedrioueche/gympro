import {
  adminApi,
  getFeatureLabelKey,
  type AppFeaturePackage,
} from "@ahmedrioueche/gympro-client";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoData from "../../../../../../components/ui/NoData";
import { Table, type TableColumn } from "../../../../../../components/ui/Table";
import { useModalStore } from "../../../../../../store/modal";

export default function FeaturePackagesTab() {
  const { t } = useTranslation();
  const { openModal } = useModalStore();

  const { data: packages, isLoading } = useQuery({
    queryKey: ["adminFeaturePackages"],
    queryFn: async () => {
      const res = await adminApi.getFeaturePackages();
      return Array.isArray(res) ? res : (res as any).data;
    },
  });

  const handleCreate = () => {
    openModal("feature_package", { pkg: null });
  };

  const handleEdit = (pkg: AppFeaturePackage) => {
    openModal("feature_package", { pkg });
  };

  const columns: TableColumn<AppFeaturePackage>[] = [
    {
      key: "name",
      header: t("common.name"),
      render: (pkg) => (
        <div>
          <div className="font-bold text-text-primary flex items-center gap-2">
            <span className="truncate max-w-md">{pkg.name}</span>
            {!pkg.isActive && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-surface-secondary text-text-secondary border border-border uppercase tracking-widest">
                {t("common.inactive")}
              </span>
            )}
          </div>
          <div className="text-[10px] text-text-secondary font-medium flex gap-3 mt-1 opacity-70">
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 shrink-0">EN</span>{" "}
              <span className="truncate max-w-[100px]">
                {pkg.localizedName?.en || "—"}
              </span>
            </span>
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 shrink-0">FR</span>{" "}
              <span className="truncate max-w-[100px]">
                {pkg.localizedName?.fr || "—"}
              </span>
            </span>
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 shrink-0">AR</span>{" "}
              <span className="truncate max-w-[100px]">
                {pkg.localizedName?.ar || "—"}
              </span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "features",
      header: t("admin.pricing.features", "Features"),
      render: (pkg) => (
        <div className="flex flex-wrap gap-1.5">
          {pkg.features.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary tracking-wide"
            >
              {t(getFeatureLabelKey(f), f)}
            </span>
          ))}
          {pkg.features.length === 0 && (
            <span className="text-xs text-text-secondary italic opacity-50">
              {t("admin.pricing.noFeaturesSelected", "No features selected")}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "order",
      header: t("common.order", "Order"),
      render: (pkg) => (
        <span className="font-black text-text-primary px-3 py-1 bg-surface-secondary border border-border rounded-lg text-xs">
          {pkg.order}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      align: "right",
      render: (pkg) => (
        <button
          onClick={() => handleEdit(pkg)}
          className="p-2.5 text-text-secondary hover:text-primary transition-all hover:bg-primary/10 rounded-xl group"
        >
          <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      ),
    },
  ];

  const renderMobileCard = (pkg: AppFeaturePackage) => (
    <div className="p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-bold text-text-primary flex items-center gap-2">
            <span className="truncate">{pkg.name}</span>
            {!pkg.isActive && (
              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-black bg-surface-secondary text-text-secondary border border-border uppercase tracking-widest">
                {t("common.inactive")}
              </span>
            )}
          </div>
          <div className="text-[10px] text-text-secondary font-medium flex flex-wrap gap-x-3 gap-y-1 mt-1 opacity-70">
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 text-[8px] shrink-0">
                EN
              </span>{" "}
              <span className="truncate max-w-[80px]">
                {pkg.localizedName?.en || "—"}
              </span>
            </span>
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 text-[8px] shrink-0">
                FR
              </span>{" "}
              <span className="truncate max-w-[80px]">
                {pkg.localizedName?.fr || "—"}
              </span>
            </span>
            <span className="flex items-center gap-1 uppercase min-w-0">
              <span className="font-black text-primary/40 text-[8px] shrink-0">
                AR
              </span>{" "}
              <span className="truncate max-w-[80px]">
                {pkg.localizedName?.ar || "—"}
              </span>
            </span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(pkg);
          }}
          className="p-2.5 bg-surface-secondary text-text-secondary hover:text-primary transition-all rounded-xl"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {pkg.features.map((f) => (
          <span
            key={f}
            className="px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary tracking-wide"
          >
            {t(getFeatureLabelKey(f), f)}
          </span>
        ))}
        {pkg.features.length === 0 && (
          <span className="text-xs text-text-secondary italic opacity-50">
            {t("admin.pricing.noFeaturesSelected", "No features selected")}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-text-secondary">
          <Package className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {t("common.order", "Order")}
          </span>
        </div>
        <span className="font-black text-text-primary px-3 py-1 bg-surface-secondary border border-border rounded-lg text-xs">
          #{pkg.order}
        </span>
      </div>
    </div>
  );

  const renderMobileLoadingSkeleton = () => (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-4 bg-border rounded w-32" />
          <div className="h-3 bg-border rounded w-48" />
        </div>
        <div className="w-9 h-9 bg-border rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-border rounded-lg w-16" />
        <div className="h-6 bg-border rounded-lg w-20" />
        <div className="h-6 bg-border rounded-lg w-24" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Table<AppFeaturePackage>
        columns={columns}
        data={packages || []}
        isLoading={isLoading}
        keyExtractor={(item) => item._id}
        onRowClick={handleEdit}
        renderMobileCard={renderMobileCard}
        renderMobileLoadingSkeleton={renderMobileLoadingSkeleton}
        emptyState={
          <NoData
            title={t("admin.pricing.noPackages", "No feature packages found")}
            description={t(
              "admin.pricing.noPackagesDesc",
              "Create your first marketable feature package to start grouping features for pricing cards.",
            )}
            icon={Package}
            className=""
          />
        }
      />
    </div>
  );
}
