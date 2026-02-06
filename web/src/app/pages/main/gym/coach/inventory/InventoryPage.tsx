import { type EquipmentCategory } from "@ahmedrioueche/gympro-client";
import { Package } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../../../../../../components/ui/Error";
import Loading from "../../../../../../components/ui/Loading";
import NoData from "../../../../../../components/ui/NoData";
import Pagination from "../../../../../../components/ui/Pagination";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import { CoachEquipmentCard } from "./components/CoachEquipmentCard";
import { CoachInventoryControls } from "./components/CoachInventoryControls";
import { useCoachInventory } from "./hooks/useCoachInventory";

const ITEMS_PER_PAGE = 12;

function InventoryPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const gymId = currentGym?._id;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: inventoryResult,
    isLoading,
    isError,
    error,
  } = useCoachInventory({
    gymId,
    search: searchQuery,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

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

  const isEmpty =
    items.length === 0 && !searchQuery && selectedCategory === "all";
  const isNoResults =
    items.length === 0 && (searchQuery || selectedCategory !== "all");

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        icon={Package}
        title={t("inventory.title", { defaultValue: "Gym Equipment" })}
        subtitle={t("inventory.coachSubtitle", {
          defaultValue:
            "View and manage gym equipment available for your clients",
        })}
      />

      <CoachInventoryControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <ErrorComponent
          error={
            (error as Error)?.message ||
            t("inventory.fetchError", {
              defaultValue: "Failed to fetch equipment",
            })
          }
        />
      ) : isEmpty ? (
        <NoData
          icon={Package}
          title={t("inventory.empty.title", {
            defaultValue: "No Equipment Yet",
          })}
          description={t("inventory.empty.coachMessage", {
            defaultValue: "The gym hasn't added any equipment yet.",
          })}
        />
      ) : isNoResults ? (
        <NoData
          icon={Package}
          title={t("inventory.noResults.title", {
            defaultValue: "No Matches Found",
          })}
          description={t("inventory.noResults.message", {
            defaultValue: "Try adjusting your search or filters.",
          })}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <CoachEquipmentCard key={item._id} item={item} />
            ))}
          </div>

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
