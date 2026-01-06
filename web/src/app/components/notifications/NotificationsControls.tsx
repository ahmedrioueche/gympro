import { useTranslation } from "react-i18next";
import { SearchFilterBar } from "../../../components/ui/SearchFilterBar";

interface NotificationsControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "unread";
  onFilterStatusChange: (status: "all" | "unread") => void;
}

function NotificationsControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
}: NotificationsControlsProps) {
  const { t } = useTranslation();

  const filterOptions = [
    { value: "all" as const, label: t("common.all", "All") },
    {
      value: "unread" as const,
      label: t("notifications.unreadOnly", "Unread"),
    },
  ];

  return (
    <SearchFilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={t("notifications.search", "Search notifications...")}
      filterValue={filterStatus}
      onFilterChange={onFilterStatusChange}
      filterOptions={filterOptions}
    />
  );
}

export default NotificationsControls;
