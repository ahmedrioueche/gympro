import {
  type Product,
  type ProductCategory,
} from "@ahmedrioueche/gympro-client";
import { Plus, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import PageHeader from "../../../../../components/PageHeader";
import { ProductCard } from "./components/ProductCard";
import { ProductTable } from "./components/ProductTable";
import {
  StoreControls,
  type SortBy,
  type ViewMode,
} from "./components/StoreControls";
import { useDeleteProduct, useStore } from "./hooks/useStore";

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
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [page, setPage] = useState(1);

  const {
    data: storeData,
    isLoading,
    isError,
    refetch,
  } = useStore(gymId, {
    search: searchQuery,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    page,
    limit: 12,
  });

  const deleteProduct = useDeleteProduct();

  const handleAddProduct = () => {
    openModal("create-product", { gymId });
  };

  const handleEditProduct = (product: Product) => {
    openModal("edit-product", { product, gymId });
  };

  const handleDeleteProduct = (product: Product) => {
    openModal("confirm", {
      title: t("store.delete.title"),
      text: t("store.delete.confirmMessage", { name: product.name }),
      confirmText: t("common.delete"),
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          await deleteProduct.mutateAsync({ gymId: gymId!, id: product._id });
          toast.success(t("store.delete.success"));
        } catch (error) {
          toast.error(t("common.error.generic"));
        }
      },
    });
  };

  if (isLoading)
    return (
      <>
        <PageHeader
          title={t("store.title")}
          subtitle={t("store.subtitle")}
          icon={Store}
        />
        <Loading />;
      </>
    );
  if (isError) return <ErrorComponent error={t("store.fetchError")} />;

  const products = storeData?.data?.data || [];
  const isEmpty =
    products.length === 0 && !searchQuery && selectedCategory === "all";
  const isNoResults =
    products.length === 0 && (searchQuery || selectedCategory !== "all");

  return (
    <div>
      <PageHeader
        title={t("store.title")}
        subtitle={t("store.subtitle")}
        icon={Store}
        actionButton={{
          label: t("store.addProduct"),
          icon: Plus,
          onClick: handleAddProduct,
        }}
      />

      <StoreControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isEmpty ? (
        <NoData
          icon={ShoppingBag}
          title={t("store.empty.title")}
          description={t("store.empty.message")}
          actionButton={{
            icon: Plus,
            label: t("store.empty.action"),
            onClick: handleAddProduct,
          }}
        />
      ) : isNoResults ? (
        <NoData
          icon={ShoppingBag}
          title={t("store.noResults.title")}
          description={t("store.noResults.message")}
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          isLoading={isLoading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </div>
  );
}
