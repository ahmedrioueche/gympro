import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import PageHeader from "../../../../components/PageHeader";
import { SubscriptionsControls } from "./components/SubscriptionsControls";
import { SubscriptionsTable } from "./components/SubscriptionsTable";
import { useMySubscriptions } from "./hooks/useMySubscriptions";

const ITEMS_PER_PAGE = 10;

function SubscriptionsPage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "expired"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMySubscriptions();

  const allSubscriptions = data?.data || [];

  // Filter subscriptions
  const filteredSubscriptions = useMemo(() => {
    let subs = [...allSubscriptions];

    // Filter by membership status
    if (filterStatus !== "all") {
      subs = subs.filter((s) => s.membershipStatus === filterStatus);
    }

    // Filter by search query (gym name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      subs = subs.filter((s) => s.gym?.name?.toLowerCase().includes(query));
    }

    return subs;
  }, [allSubscriptions, filterStatus, searchQuery]);

  // Pagination
  const totalSubscriptions = filteredSubscriptions.length;
  const totalPages = Math.ceil(totalSubscriptions / ITEMS_PER_PAGE) || 1;
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (status: "all" | "active" | "expired") => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalSubscriptions);

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <PageHeader
          title={t("mySubscriptions.title", "My Subscriptions")}
          subtitle={t(
            "mySubscriptions.subtitle",
            "Manage your gym memberships and subscriptions"
          )}
          icon={CreditCard}
        />

        {/* Controls */}
        <SubscriptionsControls
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterStatus={filterStatus}
          onFilterStatusChange={handleFilterStatusChange}
        />

        {/* Content */}
        {isLoading ? (
          <Loading className="py-22" />
        ) : allSubscriptions.length === 0 ? (
          // No subscriptions at all
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t("mySubscriptions.empty", "No subscriptions yet")}
            </h3>
            <p className="text-text-secondary">
              {t(
                "mySubscriptions.emptyDesc",
                "Join a gym to see your subscriptions here."
              )}
            </p>
          </div>
        ) : paginatedSubscriptions.length === 0 ? (
          // Has subscriptions but filter/search returns nothing
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t("mySubscriptions.noResults", "No matching subscriptions")}
            </h3>
            <p className="text-text-secondary">
              {t(
                "mySubscriptions.noResultsDesc",
                "Try adjusting your search or filter criteria."
              )}
            </p>
          </div>
        ) : (
          <SubscriptionsTable subscriptions={paginatedSubscriptions} />
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-sm text-text-secondary">
              {t("common.pagination.showing", {
                start: startIndex + 1,
                end: endIndex,
                total: totalSubscriptions,
                defaultValue: `Showing ${
                  startIndex + 1
                }-${endIndex} of ${totalSubscriptions}`,
              })}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, index) =>
                typeof page === "string" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-text-secondary"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[36px] h-9 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? "bg-primary text-white shadow-md"
                        : "border border-border bg-surface text-text-primary hover:bg-surface-hover"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionsPage;
