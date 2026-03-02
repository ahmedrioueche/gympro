/**
 * Resets the scroll position for all major application containers to the top.
 * This covers:
 * 1. Global window scroll (fallback).
 * 2. Root application scroller (for landing pages).
 * 3. Dashboard content scroller (for dashboard/app pages).
 */
export const resetAllScrollers = () => {
  // 1. Reset standard browser window
  window.scrollTo(0, 0);

  // 2. Identify the core app/dashboard scroll containers by their unique IDs
  const containers = [
    document.getElementById("app-scroller"),
    document.getElementById("dashboard-content-scroller"),
  ];

  containers.forEach((container) => {
    if (container) {
      container.scrollTo(0, 0);
    }
  });

  // 3. Fallback: Identify any other overflow containers that may have scrolling responsibility
  // (e.g., if IDs aren't present yet or multiple containers are visible)
  const allScrollers = document.querySelectorAll(
    ".overflow-auto, .overflow-y-auto",
  );
  allScrollers.forEach((scroller) => {
    scroller.scrollTo(0, 0);
  });
};
