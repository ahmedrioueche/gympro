import { type User } from "@ahmedrioueche/gympro-client";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../../../../components/ui/Loading";
import { useMembers } from "../../../../../../hooks/queries/useMembers";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import SubscriptionsControls from "./components/SubscriptionsControls";
import SubscriptionsTable from "./components/SubscriptionsTable";

const ITEMS_PER_PAGE = 20;

export default function SubscriptionsPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<
    "all" | "active" | "expired" | "expiring"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useMembers({
    gymId: currentGym?._id,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery,
  });

  // Filter members based on subscription status
  const filteredMembers = useMemo(() => {
    if (!data?.data) return [];

    const members = data.data;

    if (filter === "all") return members;

    return members.filter((member: User) => {
      const membership = member.memberships?.[0];
      const subscription = membership?.subscription;

      if (!subscription || !subscription.endDate) {
        return filter === "expired"; // Members without subscription shown in expired
      }

      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (filter) {
        case "active":
          return (
            subscription.status === "active" &&
            endDate > now &&
            daysRemaining > 7
          );
        case "expired":
          return subscription.status === "expired" || endDate < now;
        case "expiring":
          return (
            subscription.status === "active" &&
            daysRemaining <= 7 &&
            daysRemaining > 0
          );
        default:
          return true;
      }
    });
  }, [data?.data, filter]);

  const totalFiltered = filteredMembers.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);

  // Paginate filtered results
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, currentPage]);

  // Handle Search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterStatusChange = (
    status: "all" | "active" | "expired" | "expiring"
  ) => {
    setFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers
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
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalFiltered);

  if (!currentGym) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">
            {t("gym.no_gym_selected", "Please select a gym")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title={t("subscriptions.pageTitle", "Subscriptions")}
        subtitle={t(
          "subscriptions.pageSubtitle",
          "Manage member subscriptions and renewals"
        )}
        icon={CreditCard}
      />

      {/* Controls */}
      <SubscriptionsControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filter}
        onFilterStatusChange={handleFilterStatusChange}
      />

      {/* Content */}
      {isLoading ? (
        <Loading className="py-22" />
      ) : paginatedMembers.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {t("subscriptions.empty", "No subscriptions found")}
          </h3>
          <p className="text-text-secondary">
            {searchQuery || filter !== "all"
              ? t("subscriptions.emptyFiltered", "Try adjusting your filters")
              : t(
                  "subscriptions.emptyDesc",
                  "Add members to see their subscriptions"
                )}
          </p>
        </div>
      ) : (
        <SubscriptionsTable members={paginatedMembers} />
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-sm text-text-secondary">
            {t("common.pagination.showing", {
              start: startIndex + 1,
              end: endIndex,
              total: totalFiltered,
              defaultValue: `Showing ${
                startIndex + 1
              }-${endIndex} of ${totalFiltered}`,
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
  );
}
