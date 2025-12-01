import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { APP_PAGES } from "../../../../../constants/navigation";

// Mock member type - replace with actual type from client package
interface Member {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  membership: "basic" | "premium" | "vip" | "trial";
  status: "active" | "inactive" | "expired" | "pending";
  joinDate: string;
  phone?: string;
}

type ViewMode = "cards" | "table";
type FilterStatus = "all" | "active" | "inactive" | "expired" | "pending";
type SortBy = "name" | "joinDate" | "status" | "membership";

function MembersPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");

  // Mock data - replace with actual API call
  const mockMembers: Member[] = [
    {
      _id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      membership: "premium",
      status: "active",
      joinDate: "2024-01-15",
      phone: "+1234567890",
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      membership: "basic",
      status: "active",
      joinDate: "2024-02-20",
    },
    {
      _id: "3",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      membership: "vip",
      status: "active",
      joinDate: "2024-03-10",
    },
    {
      _id: "4",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      membership: "trial",
      status: "pending",
      joinDate: "2024-11-25",
    },
    {
      _id: "5",
      name: "David Brown",
      email: "david.b@example.com",
      membership: "basic",
      status: "expired",
      joinDate: "2023-06-15",
    },
    {
      _id: "6",
      name: "Emily Davis",
      email: "emily.d@example.com",
      membership: "premium",
      status: "inactive",
      joinDate: "2024-05-01",
    },
  ];

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = mockMembers;

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((member) => member.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
        case "membership":
          return a.membership.localeCompare(b.membership);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockMembers, filterStatus, searchQuery, sortBy]);

  // Get status color
  const getStatusColor = (status: Member["status"]) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "inactive":
        return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
      case "expired":
        return "bg-danger/10 text-danger border-danger/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Get membership color
  const getMembershipColor = (membership: Member["membership"]) => {
    switch (membership) {
      case "vip":
        return "bg-gradient-to-r from-accent to-secondary";
      case "premium":
        return "bg-gradient-to-r from-primary to-accent";
      case "basic":
        return "bg-gradient-to-r from-text-secondary to-primary";
      case "trial":
        return "bg-gradient-to-r from-warning to-primary";
      default:
        return "bg-primary";
    }
  };

  // Get member initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const stats = {
    total: mockMembers.length,
    active: mockMembers.filter((m) => m.status === "active").length,
    inactive: mockMembers.filter((m) => m.status === "inactive").length,
    thisMonth: mockMembers.filter((m) => {
      const joinDate = new Date(m.joinDate);
      const now = new Date();
      return (
        joinDate.getMonth() === now.getMonth() &&
        joinDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-surface via-surface to-primary/5 border border-border rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                {t("members.title")}
              </h1>
              <p className="text-text-secondary">{t("members.subtitle")}</p>
            </div>
            <Link
              to={APP_PAGES.gym.createMember.link}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl shadow-lg shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap justify-center"
            >
              <span>➕</span>
              {t("members.addMember")}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-primary">{stats.total}</p>
              <p className="text-xs text-text-secondary mt-1">
                {t("members.stats.total")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-success">{stats.active}</p>
              <p className="text-xs text-text-secondary mt-1">
                {t("members.stats.active")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-text-secondary/10 to-text-secondary/5 border border-text-secondary/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-text-secondary">
                {stats.inactive}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t("members.stats.inactive")}
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-accent">
                {stats.thisMonth}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t("members.stats.thisMonth")}
              </p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-surface border border-border rounded-2xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("members.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-background border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  🔍
                </span>
              </div>
            </div>

            {/* Filter Status */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {(
                ["all", "active", "inactive", "expired", "pending"] as const
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${
                    filterStatus === status
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "bg-background text-text-secondary hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {t(`members.filters.${status}`)}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-3 bg-background border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              <option value="name">{t("members.sort.name")}</option>
              <option value="joinDate">{t("members.sort.joinDate")}</option>
              <option value="status">{t("members.sort.status")}</option>
              <option value="membership">{t("members.sort.membership")}</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-background border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "cards"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                <span>📇</span>
                <span className="hidden sm:inline">
                  {t("members.viewMode.cards")}
                </span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "table"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-secondary hover:text-primary"
                }`}
              >
                <span>📊</span>
                <span className="hidden sm:inline">
                  {t("members.viewMode.table")}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Members Display */}
        {filteredMembers.length === 0 ? (
          /* Empty State */
          <div className="bg-surface border border-border rounded-2xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-5xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("members.empty.title")}
              </h3>
              <p className="text-text-secondary mb-6">
                {t("members.empty.description")}
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                <span>➕</span>
                {t("members.empty.action")}
              </Link>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member._id}
                className="bg-surface border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 group"
              >
                {/* Avatar and Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-16 h-16 rounded-full ${getMembershipColor(
                      member.membership
                    )} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-text-secondary truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Membership and Status */}
                <div className="flex gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getMembershipColor(
                      member.membership
                    )} text-white`}
                  >
                    {t(`members.membership.${member.membership}`)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      member.status
                    )}`}
                  >
                    {t(`members.status.${member.status}`)}
                  </span>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                  <span>📅</span>
                  <span>
                    {t("members.card.memberSince")}{" "}
                    {formatDate(member.joinDate)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium text-sm">
                    {t("members.card.viewProfile")}
                  </button>
                  <button className="px-4 py-2 bg-background border border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-all duration-300">
                    ✏️
                  </button>
                  <button className="px-4 py-2 bg-background border border-border text-text-secondary rounded-lg hover:border-danger hover:text-danger transition-all duration-300">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.avatar")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.name")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.email")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.membership")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.status")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.joinDate")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                      {t("members.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`w-10 h-10 rounded-full ${getMembershipColor(
                            member.membership
                          )} flex items-center justify-center text-white text-sm font-bold`}
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            getInitials(member.name)
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-text-primary">
                          {member.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-text-secondary">
                          {member.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getMembershipColor(
                            member.membership
                          )} text-white inline-block`}
                        >
                          {t(`members.membership.${member.membership}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            member.status
                          )} inline-block`}
                        >
                          {t(`members.status.${member.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-text-secondary">
                          {formatDate(member.joinDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-sm font-medium">
                            View
                          </button>
                          <button className="px-3 py-1.5 bg-background border border-border text-text-secondary rounded-lg hover:border-primary hover:text-primary transition-all duration-300">
                            ✏️
                          </button>
                          <button className="px-3 py-1.5 bg-background border border-border text-text-secondary rounded-lg hover:border-danger hover:text-danger transition-all duration-300">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MembersPage;
