import {
  type EquipmentCategory,
  type EquipmentItem,
} from "@ahmedrioueche/gympro-client";
import { Package, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import Pagination from "../../../../../../components/ui/Pagination";
import {
  useDeleteInventoryItem,
  useInventory,
} from "../../../../../../hooks/queries/useInventory";
import { useGymStore } from "../../../../../../store/gym";
import { useModalStore } from "../../../../../../store/modal";
import { useUserStore } from "../../../../../../store/user";
import PageHeader from "../../../../../components/PageHeader";
import {
  InventoryCard,
  InventoryControls,
  InventoryTable,
  type SortBy,
  type ViewMode,
} from "./components";

const ITEMS_PER_PAGE = 12;

function InventoryPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();

  const [viewMode, setViewMode] = useState<ViewMode>(
    (user?.appSettings?.viewPreference as ViewMode) || "cards",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | "all"
  >("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch inventory using the API
  const {
    data: inventoryResult,
    isLoading,
    isError,
    error,
    refetch,
  } = useInventory({
    gymId: currentGym?._id,
    search: searchQuery,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const deleteMutation = useDeleteInventoryItem();

  const items = inventoryResult?.data || [];
  const totalItems = inventoryResult?.total || 0;
  const totalPages = inventoryResult?.totalPages || 1;

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: EquipmentCategory | "all") => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddEquipment = () => {
    if (!currentGym?._id) return;
    openModal("inventory_item", {
      gymId: currentGym._id,
      onSuccess: () => refetch(),
    });
  };

  const handleEditItem = (item: EquipmentItem) => {
    if (!currentGym?._id) return;
    openModal("inventory_item", {
      gymId: currentGym._id,
      item,
      onSuccess: () => refetch(),
    });
  };

  const handleDeleteItem = (item: EquipmentItem) => {
    openModal("confirm", {
      title: t("inventory.delete.title", { defaultValue: "Delete Equipment" }),
      text: t("inventory.delete.confirmMessage", {
        name: item.name,
        defaultValue: `Are you sure you want to delete ${item.name}? This action cannot be undone.`,
      }),
      confirmText: t("common.delete", { defaultValue: "Delete" }),
      confirmVariant: "danger",
      onConfirm: async () => {
        try {
          if (!currentGym?._id) return;
          await deleteMutation.mutateAsync({
            gymId: currentGym._id,
            itemId: item._id,
          });
          toast.success(
            t("inventory.delete.success", {
              defaultValue: "Equipment deleted successfully",
            }),
          );
        } catch (err: any) {
          toast.error(
            err.message ||
              t("common.error", { defaultValue: "Failed to delete equipment" }),
          );
        }
      },
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        icon={Package}
        title={t("inventory.title", { defaultValue: "Gym Inventory" })}
        subtitle={t("inventory.subtitle", {
          defaultValue:
            "Manage your gym equipment, stock, and maintenance schedules.",
        })}
        actionButton={{
          label: t("inventory.addEquipment", { defaultValue: "Add Equipment" }),
          onClick: handleAddEquipment,
          icon: Plus,
        }}
      />

      <InventoryControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorComponent
          error={
            error?.message ||
            t("inventory.fetchError", {
              defaultValue: "Failed to fetch inventory items",
            })
          }
        />
      ) : items.length === 0 ? (
        <NoData
          icon={Package}
          title={
            searchQuery || selectedCategory !== "all"
              ? t("inventory.noResults.title", {
                  defaultValue: "No matches found",
                })
              : t("inventory.empty.title", {
                  defaultValue: "Your inventory is empty",
                })
          }
          description={
            searchQuery || selectedCategory !== "all"
              ? t("inventory.noResults.message", {
                  defaultValue:
                    "Try adjusting your search or filters to find what you're looking for.",
                })
              : t("inventory.empty.message", {
                  defaultValue:
                    "Start adding equipment items to track your gym assets and maintenance.",
                })
          }
          actionButton={
            !searchQuery && selectedCategory === "all"
              ? {
                  label: t("inventory.addFirstItem", {
                    defaultValue: "Add Your First Item",
                  }),
                  icon: Plus,
                  onClick: handleAddEquipment,
                }
              : undefined
          }
          iconBg="bg-primary/10"
        />
      ) : (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map((item) => (
                <InventoryCard
                  key={item._id}
                  item={item}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
          ) : (
            <InventoryTable
              items={items}
              isLoading={isLoading}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}

          {totalPages > 1 && (
            <div className="pt-6 border-t border-border">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalRecords={totalItems}
                startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
                endIndex={Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default InventoryPage;
