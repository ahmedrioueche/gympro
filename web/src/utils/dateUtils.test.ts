import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatDistanceToNow } from "./dateUtils";

describe("formatDistanceToNow", () => {
  it('should return "just now" for current time', () => {
    expect(formatDistanceToNow(new Date())).toBe("just now");
  });

  it('should return "1 minute" for 1 minute ago', () => {
    const date = new Date(Date.now() - 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("1 minute");
  });

  it("should return plural minutes", () => {
    const date = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("5 minutes");
  });

  it('should return "1 hour" for 1 hour ago', () => {
    const date = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("1 hour");
  });

  it("should return plural hours", () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("3 hours");
  });

  it('should return "1 day" for 1 day ago', () => {
    const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("1 day");
  });

  it("should return plural days", () => {
    const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("5 days");
  });

  it("should return months for 30+ days", () => {
    const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("2 months");
  });

  it("should return years for 365+ days", () => {
    const date = new Date(Date.now() - 400 * 24 * 60 * 60 * 1000);
    expect(formatDistanceToNow(date)).toBe("1 year");
  });
});

describe("formatDate", () => {
  it('should format a date to "MMM D, YYYY" format', () => {
    const date = new Date("2026-01-15T12:00:00Z");
    const result = formatDate(date);
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

describe("formatDateTime", () => {
  it("should include date and time", () => {
    const date = new Date("2026-06-15T15:45:00Z");
    const result = formatDateTime(date);
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2026");
    // Should contain time portion
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
