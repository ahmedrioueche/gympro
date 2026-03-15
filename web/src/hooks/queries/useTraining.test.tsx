import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the client BEFORE importing hooks
vi.mock("@ahmedrioueche/gympro-client", () => {
  return {
    trainingApi: {
      getPrograms: vi.fn(),
      getProgram: vi.fn(),
      getActiveProgram: vi.fn(),
      getHistory: vi.fn(),
      createProgram: vi.fn(),
      updateProgram: vi.fn(),
      startProgram: vi.fn(),
      abandonProgram: vi.fn(),
      resumeHistory: vi.fn(),
      logSession: vi.fn(),
      deleteSession: vi.fn(),
    },
  };
});

// Import hooks after mocking
import { trainingApi } from "@ahmedrioueche/gympro-client";
import { usePrograms, useStartProgram } from "./useTraining";

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

describe("useTraining hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usePrograms fetches programs successfully", async () => {
    const mockPrograms = [{ _id: "1", name: "Program 1" }];
    (trainingApi.getPrograms as any).mockResolvedValue({ data: mockPrograms });

    const { result } = renderHook(() => usePrograms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPrograms);
  });

  it("useStartProgram calls startProgram successfully", async () => {
    (trainingApi.startProgram as any).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useStartProgram(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({ id: "p1", force: true });

    expect(trainingApi.startProgram).toHaveBeenCalledWith("p1", true);
  });
});
