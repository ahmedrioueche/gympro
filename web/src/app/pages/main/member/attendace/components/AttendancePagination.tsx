import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttendancePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  getPageNumbers: () => (number | string)[];
}

export function AttendancePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalRecords,
  onPageChange,
  getPageNumbers,
}: AttendancePaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
      <p className="text-sm text-text-secondary">
        {
          t("common.pagination.showing", {
            start: startIndex + 1,
            end: endIndex,
            total: totalRecords,
            defaultValue: `Showing ${startIndex + 1}-${endIndex} of ${totalRecords}`,
          }) as string
        }
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
