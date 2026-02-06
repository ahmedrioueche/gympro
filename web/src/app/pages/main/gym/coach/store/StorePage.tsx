import {
  type Product,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { ShoppingBag, Store } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { CoachProductCard } from "./components/CoachProductCard";
import { CoachStoreControls } from "./components/CoachStoreControls";
import { useCoachStore } from "./hooks/useCoachStore";

export default function StorePage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;
  const openModal = useModalStore((state) => state.openModal);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "all"
  >("all");

  const {
    data: storeData,
    isLoading,
    isError,
  } = useCoachStore(gymId, {
    search: searchQuery,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 50,
  });

  const handleViewDetails = (product: Product) => {
    openModal("product-details", { product });
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title={t("store.title")}
          subtitle={t("store.coachSubtitle", {
            defaultValue: "Browse gym products available for your clients",
          })}
          icon={Store}
        />
        <Loading />
      </>
    );
  }

  if (isError) {
    return <ErrorComponent error={t("store.fetchError")} />;
  }

  // Only show active products
  const products = (storeData?.data?.data || []).filter(
    (p) => p.status === "active",
  );
  const isEmpty =
    products.length === 0 && !searchQuery && selectedCategory === "all";
  const isNoResults =
    products.length === 0 && (searchQuery || selectedCategory !== "all");

  return (
    <div>
      <PageHeader
        title={t("store.title")}
        subtitle={t("store.coachSubtitle", {
          defaultValue: "Browse gym products available for your clients",
        })}
        icon={Store}
      />

      <CoachStoreControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isEmpty ? (
        <NoData
          icon={ShoppingBag}
          title={t("store.empty.title")}
          description={t("store.empty.message")}
        />
      ) : isNoResults ? (
        <NoData
          icon={ShoppingBag}
          title={t("store.noResults.title")}
          description={t("store.noResults.message")}
        />
      ) : (
        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <CoachProductCard
              key={product._id}
              product={product}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
