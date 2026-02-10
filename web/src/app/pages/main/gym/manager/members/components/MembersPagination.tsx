import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ITEMS_PER_PAGE } from "../hooks/useMembersPage";

interface MembersPaginationProps {
  currentPage: number;
  totalPages: number;
  totalMembers: number;
  onPageChange: (page: number) => void;
}

export function MembersPagination({
  currentPage,
  totalPages,
  totalMembers,
  onPageChange,
}: MembersPaginationProps) {
  const { t } = useTranslation();

  // Calculate display indices for pagination info
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalMembers);

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

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      {/* Results Info */}
      <p className="text-sm text-text-secondary">
        {t("members.pagination.showing", {
          start: startIndex + 1,
          end: endIndex,
          total: totalMembers,
          defaultValue: `Showing ${startIndex + 1}-${endIndex} of ${totalMembers}`,
        })}
      </p>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(page)}
              className={`min-w-[36px] h-9 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-primary text-white shadow-md"
                  : "border border-border bg-surface text-text-primary hover:bg-surface-hover"
              }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
