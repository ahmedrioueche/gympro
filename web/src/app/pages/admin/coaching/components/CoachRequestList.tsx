import { type User } from "@ahmedrioueche/gympro-client";
import { Eye, User as UserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SearchFilterBar, {
  type FilterOption,
} from "../../../../../components/ui/SearchFilterBar";
import StatusBadge from "../../../../../components/ui/StatusBadge";
import Table, { type TableColumn } from "../../../../../components/ui/Table";
import { useModalStore } from "../../../../../store/modal";

interface CoachRequestListProps {
  requests: User[];
}

export default function CoachRequestList({ requests }: CoachRequestListProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState<string>("all");

  const filterOptions: FilterOption[] = [
    { value: "all", label: t("admin.coaching.list.filters.all") },
    { value: "pending", label: t("admin.coaching.list.filters.pending") },
    { value: "approved", label: t("admin.coaching.list.filters.approved") },
    { value: "rejected", label: t("admin.coaching.list.filters.rejected") },
  ];

  const filteredRequests = useMemo(() => {
    return requests.filter((user) => {
      const matchesSearch =
        user.profile.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.profile.username.toLowerCase().includes(searchQuery.toLowerCase());

      const status = user.coachVerification?.status || "pending";
      const matchesFilter =
        filterValue === "all" || status.toLowerCase() === filterValue;

      return matchesSearch && matchesFilter;
    });
  }, [requests, searchQuery, filterValue]);

  const columns: TableColumn<User>[] = [
    {
      key: "candidate",
      header: t("admin.coaching.list.candidate"),
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center flex-shrink-0">
            {user.profile.profileImageUrl ? (
              <img
                src={user.profile.profileImageUrl}
                alt={user.profile.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primary">
                {user.profile.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium text-text-primary">
              {user.profile.fullName}
            </div>
            <div className="text-xs text-text-secondary">
              @{user.profile.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location",
      header: t("admin.coaching.list.location"),
      render: (user) => (
        <div className="text-sm text-text-secondary">
          {user.profile.city || "N/A"}
          {user.profile.country ? `, ${user.profile.country}` : ""}
        </div>
      ),
    },
    {
      key: "submitted",
      header: t("admin.coaching.list.submitted"),
      render: (user) => (
        <div className="text-sm text-text-secondary">
          {new Date(
            user.coachVerification?.submittedAt || user.createdAt!,
          ).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "status",
      header: t("admin.coaching.list.status"),
      render: (user) => (
        <StatusBadge status={user.coachVerification?.status || "pending"} />
      ),
    },
    {
      key: "actions",
      header: t("admin.coaching.list.actions"),
      align: "right",
      render: (user) => (
        <button
          onClick={() =>
            openModal("admin_review_coach_request", { request: user })
          }
          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <Eye className="w-3.5 h-3.5" />
          {t("admin.coaching.list.review")}
        </button>
      ),
    },
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 bg-surface-hover rounded-full mb-4">
        <UserIcon className="w-8 h-8 text-text-secondary" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-1">
        {t("admin.coaching.list.noRequests")}
      </h3>
      <p className="text-text-secondary max-w-sm">
        {t("admin.coaching.list.noRequestsDesc")}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t("admin.coaching.list.searchPlaceholder")}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={filterOptions}
      />
      <Table
        columns={columns}
        data={filteredRequests}
        keyExtractor={(user) => user._id}
        emptyState={emptyState}
        onRowClick={(user) =>
          openModal("admin_review_coach_request", { request: user })
        }
      />
    </div>
  );
}
