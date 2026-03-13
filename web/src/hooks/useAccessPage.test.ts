import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAccessPage } from "./useAccessPage";

// Mock the query hooks
vi.mock("./queries/useAttendance", () => ({
  useAccessToken: vi.fn(),
}));

vi.mock("./queries/useMembership", () => ({
  useMyMembershipInGym: vi.fn(),
}));

import { useAccessToken } from "./queries/useAttendance";
import { useMyMembershipInGym } from "./queries/useMembership";

describe("useAccessPage", () => {
  const mockGymId = "gym123";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with loading state", () => {
    (useAccessToken as any).mockReturnValue({
      data: null,
      isLoading: true,
      refetch: vi.fn(),
      isRefetching: false,
    });
    (useMyMembershipInGym as any).mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useAccessPage(mockGymId));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.token).toBeUndefined();
    expect(result.current.membership).toBeUndefined();
  });

  it("should return token and membership data when loaded", () => {
    const mockToken = "mock-token";
    const mockMembership = { _id: "mem1" };
    const expiresAt = Date.now() + 30000;

    (useAccessToken as any).mockReturnValue({
      data: { data: { token: mockToken, expiresAt } },
      isLoading: false,
      refetch: vi.fn(),
      isRefetching: false,
    });
    (useMyMembershipInGym as any).mockReturnValue({
      data: { data: { membership: mockMembership } },
      isLoading: false,
    });

    const { result } = renderHook(() => useAccessPage(mockGymId));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.membership).toEqual(mockMembership);
    expect(result.current.timeLeft).toBe(30);
  });

  it("should handle countdown and refresh token when it expires", () => {
    const mockRefetch = vi.fn();
    const expiresAt = Date.now() + 5000; // 5 seconds from now

    (useAccessToken as any).mockReturnValue({
      data: { data: { token: "token", expiresAt } },
      isLoading: false,
      refetch: mockRefetch,
      isRefetching: false,
    });
    (useMyMembershipInGym as any).mockReturnValue({
      data: { data: { membership: {} } },
      isLoading: false,
    });

    const { result } = renderHook(() => useAccessPage(mockGymId));

    expect(result.current.timeLeft).toBe(5);

    // Advance 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.timeLeft).toBe(2);

    // Advance 2 more seconds (to 0)
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(0);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should call refetch when refresh is called", () => {
    const mockRefetch = vi.fn();
    (useAccessToken as any).mockReturnValue({
      data: { data: { token: "token", expiresAt: Date.now() + 30000 } },
      isLoading: false,
      refetch: mockRefetch,
      isRefetching: false,
    });
    (useMyMembershipInGym as any).mockReturnValue({
      data: { data: { membership: {} } },
      isLoading: false,
    });

    const { result } = renderHook(() => useAccessPage(mockGymId));

    act(() => {
      result.current.refresh();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
