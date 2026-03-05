import { describe, expect, it } from "vitest";
import { formatDate, formatRelativeDate } from "./date";

describe("formatDate", () => {
  it('should return "-" for null/undefined', () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
  });

  it('should return "-" for invalid date strings', () => {
    expect(formatDate("not-a-date")).toBe("-");
    expect(formatDate("")).toBe("-");
  });

  it("should format a valid Date object", () => {
    const date = new Date("2026-03-04T12:00:00Z");
    const result = formatDate(date);
    // Should contain year and some formatted output
    expect(result).toContain("2026");
    expect(result).not.toBe("-");
  });

  it("should format a valid date string", () => {
    const result = formatDate("2026-01-15T10:00:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });

  it("should respect custom locale", () => {
    const date = new Date("2026-06-15T12:00:00Z");
    const result = formatDate(date, "fr-FR");
    // French locale should produce a different format
    expect(result).not.toBe("-");
  });
});

describe("formatRelativeDate", () => {
  it('should return "-" for null/undefined', () => {
    expect(formatRelativeDate(null)).toBe("-");
    expect(formatRelativeDate(undefined)).toBe("-");
  });

  it('should return "-" for invalid dates', () => {
    expect(formatRelativeDate("invalid")).toBe("-");
  });

  it('should return "Today" for today\'s date', () => {
    const now = new Date();
    expect(formatRelativeDate(now)).toBe("Today");
  });

  it('should return "Yesterday" for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatRelativeDate(yesterday)).toBe("Yesterday");
  });

  it('should return "X days ago" for recent dates', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    expect(formatRelativeDate(threeDaysAgo)).toBe("3 days ago");
  });

  it("should return weeks for dates 7-29 days ago", () => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    expect(formatRelativeDate(twoWeeksAgo)).toBe("2 weeks ago");
  });

  it("should return months for dates 30-364 days ago", () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
    expect(formatRelativeDate(threeMonthsAgo)).toBe("3 months ago");
  });

  it("should return years for dates 365+ days ago", () => {
    const twoYearsAgo = new Date();
    twoYearsAgo.setDate(twoYearsAgo.getDate() - 730);
    expect(formatRelativeDate(twoYearsAgo)).toBe("2 years ago");
  });
});
