import { ErrorComponent } from "@tanstack/react-router";
import Loading from "../../../../../../../components/ui/Loading";
import type { ViewMode } from "../../../../../../../types/common";
import {
  MemberCard,
  MembersEmptyState,
  MembersTable,
  type MemberDisplay,
} from "./index";

interface MembersListProps {
  isLoading: boolean;
  error: any;
  members: MemberDisplay[];
  totalMembersCount: number; // to check if truly empty or just no results
  searchQuery: string;
  viewMode: ViewMode;
  onViewProfile: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MembersList({
  isLoading,
  error,
  members,
  totalMembersCount,
  searchQuery,
  viewMode,
  onViewProfile,
  onDelete,
}: MembersListProps) {
  if (isLoading) {
    return <Loading className="py-22" />;
  }

  if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (members.length === 0) {
    return (
      <MembersEmptyState
        type={
          totalMembersCount === 0 && !searchQuery ? "no-members" : "no-results"
        }
      />
    );
  }

  if (viewMode === "cards") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {members.map((member) => (
          <MemberCard
            key={member._id}
            member={member}
            onViewProfile={handleViewProfile}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <MembersTable
      members={members}
      onViewProfile={onViewProfile}
      onDelete={onDelete}
    />
  );

  // Helper because MemberCard expects onViewProfile but we want to pass the ID
  function handleViewProfile(member: any) {
    onViewProfile(member._id);
  }
}
