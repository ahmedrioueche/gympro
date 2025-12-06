import type { MembershipStatus } from "@ahmedrioueche/gympro-client";

/**
 * Get status color classes based on membership status
 */
export const getStatusColor = (status: MembershipStatus | string): string => {
  switch (status) {
    case "active":
      return "bg-success/10 text-success border-success/20";
    case "banned":
      return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    case "expired":
      return "bg-danger/10 text-danger border-danger/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "canceled":
      return "bg-text-secondary/10 text-text-secondary border-text-secondary/20";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
};

/**
 * Get avatar background color gradient
 */
export const getAvatarColor = (): string => {
  return "bg-gradient-to-r from-primary to-secondary";
};

/**
 * Get member initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
