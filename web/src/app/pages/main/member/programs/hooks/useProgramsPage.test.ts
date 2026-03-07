import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useProgramsPage } from "./useProgramsPage";

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("react-hot-toast");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockOpenModal = vi.fn();
vi.mock("../../../../../../store/modal", () => ({
  useModalStore: () => ({
    openModal: mockOpenModal,
  }),
}));

const mockActiveProgram = vi.fn();
const mockMutate = vi.fn();
vi.mock("../../../../../../hooks/queries/useTraining", () => ({
  useActiveProgram: () => ({ data: mockActiveProgram() }),
  useStartProgram: () => ({
    mutate: mockMutate,
  }),
}));

vi.mock("../../../../../hooks/usePrograms", () => ({
  usePrograms: () => ({
    data: [],
    isLoading: false,
  }),
}));

describe("useProgramsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should start program directly if no active program exists", () => {
    mockActiveProgram.mockReturnValue(null);
    const { result } = renderHook(() => useProgramsPage());

    act(() => {
      result.current.handleUseProgram("p1");
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { id: "p1", force: false },
      expect.any(Object),
    );
  });

  it("should prompt to archive if a different program is active", () => {
    mockActiveProgram.mockReturnValue({
      status: "active",
      program: { _id: "p2" },
    });
    const { result } = renderHook(() => useProgramsPage());

    act(() => {
      result.current.handleUseProgram("p1");
    });

    expect(mockOpenModal).toHaveBeenCalledWith(
      "confirm",
      expect.objectContaining({
        title: "training.page.start.activeTitle",
      }),
    );
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should navigate to training if same program is already active", () => {
    mockActiveProgram.mockReturnValue({
      status: "active",
      program: { _id: "p1" },
    });
    const { result } = renderHook(() => useProgramsPage());

    act(() => {
      result.current.handleUseProgram("p1");
    });

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/member/training" });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("should start program with force=true when confirmed", () => {
    mockActiveProgram.mockReturnValue({
      status: "active",
      program: { _id: "p2" },
    });
    const { result } = renderHook(() => useProgramsPage());

    act(() => {
      // Simulate confirmation by passing force=true (which is what onConfirm does)
      result.current.handleUseProgram("p1", true);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { id: "p1", force: true },
      expect.any(Object),
    );
  });
});
