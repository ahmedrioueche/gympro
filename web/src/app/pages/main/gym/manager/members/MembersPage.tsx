import { membersApi } from "@ahmedrioueche/gympro-client";
import { ErrorComponent, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import Loading from "../../../../../../components/ui/Loading";
import { APP_PAGES } from "../../../../../../constants/navigation";
import { useMembers } from "../../../../../../hooks/queries/useMembers";
import { useGymStore } from "../../../../../../store/gym";
import PageHeader from "../../../../../components/PageHeader";
import {
  DeleteConfirmationDialog,
  EditMemberModal,
  MemberCard,
  MemberProfileModal,
  MembersControls,
  MembersEmptyState,
  MembersTable,
  getMemberDisplay,
  type FilterStatus,
  type MemberDisplay,
  type SortBy,
  type ViewMode,
} from "./components";

const ITEMS_PER_PAGE = 12;

function MembersPage() {
  const { t } = useTranslation();
  const { currentGym } = useGymStore();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [selectedMember, setSelectedMember] = useState<MemberDisplay | null>(
    null
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch members using the API - paginated from backend
  const {
    data: membersResponse,
    isLoading,
    error,
    refetch,
  } = useMembers({
    search: searchQuery,
    gymId: currentGym?._id,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Extract data from response
  const members = membersResponse?.data ?? [];
  const totalMembers = membersResponse?.total ?? 0;
  const totalPages = membersResponse?.totalPages ?? 1;

  // Transform and filter members
  const filteredMembers = useMemo(() => {
    const displayMembers = members.map((m) =>
      getMemberDisplay(m, currentGym?._id)
    );

    let filtered = displayMembers;

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((member) => member.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "joinDate":
          return (
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
          );
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, currentGym?._id, filterStatus, sortBy]);

  // Reset page when search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Calculate display indices for pagination info
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalMembers);

  // Calculate stats
  const stats = useMemo(() => {
    const displayMembers = members.map((m) =>
      getMemberDisplay(m, currentGym?._id)
    );
    return {
      total: totalMembers, // Use server total
      active: displayMembers.filter((m) => m.status === "active").length,
      expired: displayMembers.filter((m) => m.status === "expired").length || 0,
      thisMonth: displayMembers.filter((m) => {
        if (!m.joinDate) return false;
        const joinDate = new Date(m.joinDate);
        const now = new Date();
        return (
          joinDate.getMonth() === now.getMonth() &&
          joinDate.getFullYear() === now.getFullYear()
        );
      }).length,
    };
  }, [members, currentGym?._id, totalMembers]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of list
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Member action handlers
  const handleViewProfile = (memberId: string) => {
    const member = filteredMembers.find((m) => m._id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsProfileModalOpen(true);
    }
  };

  const handleEdit = (memberId: string) => {
    const member = filteredMembers.find((m) => m._id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsEditModalOpen(true);
      setIsProfileModalOpen(false);
    }
  };

  const handleDeleteClick = (memberId: string) => {
    const member = filteredMembers.find((m) => m._id === memberId);
    if (member) {
      setSelectedMember(member);
      setIsDeleteDialogOpen(true);
      setIsProfileModalOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember || !currentGym?._id) return;

    setIsDeleting(true);
    try {
      // Find the membership ID for this member
      const memberData = members.find((m) => m._id === selectedMember._id);
      const membershipId = memberData?.memberships?.find(
        (m) => m.gym?._id === currentGym._id
      )?._id;

      if (!membershipId) {
        throw new Error(
          t("members.delete.errors.membershipNotFound", "Membership not found")
        );
      }

      await membersApi.deleteMember(currentGym._id, membershipId);
      toast.success(t("members.delete.success", "Member removed successfully"));
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
      refetch(); // Refresh the members list
    } catch (error: any) {
      toast.error(
        error?.message || t("members.delete.error", "Failed to remove member")
      );
    } finally {
      setIsDeleting(false);
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

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        icon={Users}
        title={t("members.title")}
        subtitle={t("members.subtitle")}
        actionButton={{
          label: t("members.addMember"),
          onClick: () => {
            navigate({ to: APP_PAGES.gym.manager.createMember.link });
          },
          icon: Plus,
        }}
      />

      {/* Controls Section */}
      <MembersControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Members Display */}
      {isLoading ? (
        <Loading className="py-22" />
      ) : error ? (
        <ErrorComponent error={error.message} />
      ) : filteredMembers.length === 0 ? (
        <MembersEmptyState
          type={
            members.length === 0 && !searchQuery ? "no-members" : "no-results"
          }
        />
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member._id}
              member={member}
              onViewProfile={handleViewProfile}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <MembersTable
          members={filteredMembers}
          onViewProfile={handleViewProfile}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          {/* Results Info */}
          <p className="text-sm text-text-secondary">
            {t("members.pagination.showing", {
              start: startIndex + 1,
              end: endIndex,
              total: totalMembers,
              defaultValue: `Showing ${
                startIndex + 1
              }-${endIndex} of ${totalMembers}`,
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

      {/* Member Profile Modal */}
      {selectedMember && (
        <MemberProfileModal
          member={selectedMember}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedMember(null);
          }}
          onEdit={() => handleEdit(selectedMember._id)}
          onDelete={() => handleDeleteClick(selectedMember._id)}
        />
      )}

      {/* Edit Member Modal */}
      {selectedMember && (
        <EditMemberModal
          member={selectedMember}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMember(null);
          }}
          onSave={() => {
            setIsEditModalOpen(false);
            setSelectedMember(null);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedMember && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          memberName={selectedMember.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteDialogOpen(false);
            setSelectedMember(null);
          }}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

export default MembersPage;
