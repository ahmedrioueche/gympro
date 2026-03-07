import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAllMyGyms, useGyms } from "../../../../../../hooks/queries/useGyms";
import { useUserStore } from "../../../../../../store/user";
import { useMemberGymsPage } from "./useMemberGymsPage";

// Mock the dependencies
vi.mock("../../../../../../store/user", () => ({
  useUserStore: vi.fn(),
}));

vi.mock("../../../../../../hooks/queries/useGyms", () => ({
  useAllMyGyms: vi.fn(),
  useGyms: vi.fn(),
}));

describe("useMemberGymsPage hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default active tab and fetch data", () => {
    (useUserStore as any).mockReturnValue({ user: { _id: "u1" } });
    (useAllMyGyms as any).mockReturnValue({
      data: [{ _id: "g1" }],
      isLoading: false,
    });
    (useGyms as any).mockReturnValue({ data: { total: 5 } });

    const { result } = renderHook(() => useMemberGymsPage());

    expect(result.current.activeTab).toBe("my_gyms");
    expect(result.current.myGyms).toEqual([{ _id: "g1" }]);
    expect(result.current.exploreCount).toBe(5);
  });

  it("should toggle active tab", () => {
    (useUserStore as any).mockReturnValue({ user: { _id: "u1" } });
    (useAllMyGyms as any).mockReturnValue({ data: [], isLoading: false });
    (useGyms as any).mockReturnValue({ data: { total: 0 } });

    const { result } = renderHook(() => useMemberGymsPage());

    act(() => {
      result.current.setActiveTab("explore");
    });

    expect(result.current.activeTab).toBe("explore");
  });
});
