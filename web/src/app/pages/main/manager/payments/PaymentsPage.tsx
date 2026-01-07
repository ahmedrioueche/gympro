import {
  type AppPaymentFilterDto,
  type AppPaymentStatus,
} from "@ahmedrioueche/gympro-client";
import { ErrorComponent } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../components/ui/Loading";
import { useMyPayments } from "../../../../../hooks/queries/usePayments";
import PageHeader from "../../../../components/PageHeader";
import { PaymentsControls, PaymentsTable } from "./components";

const ITEMS_PER_PAGE = 20;

function PaymentsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppPaymentStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Build filters
  const filters: AppPaymentFilterDto = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    sortBy: "date",
    sortOrder: "desc",
  };

  // Fetch payments
  const { data: paymentsResponse, isLoading, error } = useMyPayments(filters);

  const payments = paymentsResponse?.data ?? [];
  const totalPayments = paymentsResponse?.total ?? 0;
  const totalPages = paymentsResponse?.totalPages ?? 1;

  // Reset page when search/filter changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (status: AppPaymentStatus | "all") => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
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
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalPayments);

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        icon={CreditCard}
        title={t("payments.title")}
        subtitle={t("payments.subtitle")}
      />

      {/* Controls Section */}
      <PaymentsControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterStatusChange={handleFilterStatusChange}
      />

      {/* Payments Display */}
      {isLoading ? (
        <Loading className="py-22" />
      ) : error ? (
        <ErrorComponent error={error.message} />
      ) : payments.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {totalPayments === 0
              ? t("payments.empty.noPayments")
              : t("payments.empty.noResults")}
          </h3>
          <p className="text-text-secondary">
            {totalPayments === 0
              ? t("payments.empty.noPaymentsDesc")
              : t("payments.empty.noResultsDesc")}
          </p>
        </div>
      ) : (
        <PaymentsTable payments={payments} />
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          {/* Results Info */}
          <p className="text-sm text-text-secondary">
            {t("payments.pagination.showing", {
              start: startIndex + 1,
              end: endIndex,
              total: totalPayments,
              defaultValue: `Showing ${
                startIndex + 1
              }-${endIndex} of ${totalPayments}`,
            })}
          </p>

          {/* Page Navigation */}
          <div className="flex items-center gap-1">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
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

            {/* Next Button */}
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
  );
}

export default PaymentsPage;
