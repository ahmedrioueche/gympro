import { membersApi } from "@ahmedrioueche/gympro-client";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useMembers } from "../../../../../../../hooks/queries/useMembers";
import { useGymStore } from "../../../../../../../store/gym";
import { useModalStore } from "../../../../../../../store/modal";
import { useUserStore } from "../../../../../../../store/user";
import {
  getMemberDisplay,
  type FilterStatus,
  type SortBy,
  type ViewMode,
} from "../components";

export const ITEMS_PER_PAGE = 12;

export function useMembersPage() {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { currentGym } = useGymStore();
  const { openModal } = useModalStore();

  const [viewMode, setViewMode] = useState<ViewMode>(
    user?.appSettings?.viewPreference || "cards",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [currentPage, setCurrentPage] = useState(1);

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
      getMemberDisplay(m, currentGym?._id),
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewProfile = (memberId: string) => {
    const member = filteredMembers.find((m) => m._id === memberId);
    if (member) {
      openModal("member_profile", {
        memberId: member._id,
        membershipId: member.membershipId,
      });
    }
  };

  const handleDeleteConfirm = async (memberId: string) => {
    if (!currentGym?._id) return;

    try {
      const memberData = members.find((m) => m._id === memberId);
      const membershipId = memberData?.memberships?.find(
        (m) => m.gym?._id === currentGym._id,
      )?._id;

      if (!membershipId) {
        throw new Error(
          t("members.delete.errors.membershipNotFound", "Membership not found"),
        );
      }

      await membersApi.deleteMember(currentGym._id, membershipId);
      toast.success(t("members.delete.success", "Member removed successfully"));
      refetch();
    } catch (error: any) {
      toast.error(
        error?.message || t("members.delete.error", "Failed to remove member"),
      );
    }
  };

  const handleDeleteClick = (memberId: string) => {
    const member = filteredMembers.find((m) => m._id === memberId);
    if (member) {
      openModal("confirm", {
        title: t("members.delete.title"),
        text: t("members.delete.message", { name: member.name }),
        verificationText: member.name,
        onConfirm: () => handleDeleteConfirm(memberId),
        confirmVariant: "danger",
      });
    }
  };

  const handleAddMember = () => {
    openModal("create_member", {
      onSuccess: () => refetch(),
    });
  };

  return {
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
    membersRaw: members,
    currentGym,
    handleSearchChange,
    handlePageChange,
    handleViewProfile,
    handleDeleteClick,
    handleAddMember,
    refetch,
  };
}
