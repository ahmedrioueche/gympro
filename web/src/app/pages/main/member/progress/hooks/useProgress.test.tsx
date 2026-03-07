import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProgressHistory, useProgressStats } from "./useProgress";

// Mock progressApi BEFORE importing hooks or using them
vi.mock("@ahmedrioueche/gympro-client", () => ({
  progressApi: {
    getStats: vi.fn(),
    getHistory: vi.fn(),
  },
}));

import { progressApi } from "@ahmedrioueche/gympro-client";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProgress hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useProgressStats fetches stats successfully", async () => {
    const mockStats = { currentStreak: 5, totalWorkouts: 20 };
    (progressApi.getStats as any).mockResolvedValue({ data: mockStats });

    const { result } = renderHook(() => useProgressStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockStats);
    expect(progressApi.getStats).toHaveBeenCalled();
  });

  it("useProgressHistory fetches history successfully", async () => {
    const mockHistory = [{ _id: "h1", date: "2024-03-07" }];
    (progressApi.getHistory as any).mockResolvedValue({ data: mockHistory });

    const { result } = renderHook(() => useProgressHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockHistory);
    expect(progressApi.getHistory).toHaveBeenCalled();
  });
});
