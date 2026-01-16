/**
 * Format a date to show relative time (e.g., "2 hours ago")
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return diffYears === 1 ? "1 year" : `${diffYears} years`;
  }
  if (diffMonths > 0) {
    return diffMonths === 1 ? "1 month" : `${diffMonths} months`;
  }
  if (diffDays > 0) {
    return diffDays === 1 ? "1 day" : `${diffDays} days`;
  }
  if (diffHours > 0) {
    return diffHours === 1 ? "1 hour" : `${diffHours} hours`;
  }
  if (diffMins > 0) {
    return diffMins === 1 ? "1 minute" : `${diffMins} minutes`;
  }
  return "just now";
}

/**
 * Format a date to a readable string (e.g., "Jan 15, 2026")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Format a date with time (e.g., "Jan 15, 2026 at 3:45 PM")
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
