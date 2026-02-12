import { Plus, Users } from "lucide-react";
import PageHeader from "../../../../../components/PageHeader";
import { MembersControls, MembersList, MembersPagination } from "./components";
import { useMembersPage } from "./hooks/useMembersPage";

function MembersPage() {
  const {
    t,
    viewMode,
    setViewMode,
    searchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    currentPage,
    isLoading,
    error,
    filteredMembers,
    totalMembers,
    totalPages,
    currentGym,
    handleSearchChange,
    handlePageChange,
    handleViewProfile,
    handleDeleteClick,
    handleAddMember,
  } = useMembersPage();

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        icon={Users}
        title={t("members.title")}
        subtitle={t("members.subtitle")}
        actionButton={{
          label: t("members.addMember"),
          onClick: handleAddMember,
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
      <MembersList
        isLoading={isLoading}
        error={error}
        members={filteredMembers}
        totalMembersCount={totalMembers}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onViewProfile={handleViewProfile}
        onDelete={handleDeleteClick}
      />

      {/* Pagination Controls */}
      <MembersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalMembers={totalMembers}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default MembersPage;
