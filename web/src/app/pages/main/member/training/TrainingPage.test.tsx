import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TrainingPage from "./TrainingPage";

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockActiveProgram = vi.fn();
const mockTrainingHistory = vi.fn();
const mockResumeHistory = { mutate: vi.fn() };

vi.mock("../../../../../hooks/queries/useTraining", () => ({
  useActiveProgram: () => ({ data: mockActiveProgram(), isLoading: false }),
  useTrainingHistory: () => ({ data: mockTrainingHistory(), isLoading: false }),
  useDeleteSession: () => ({ mutate: vi.fn() }),
  useStartProgram: () => ({ mutate: vi.fn(), isPending: false }),
  useResumeHistory: () => mockResumeHistory,
}));

vi.mock("../../../../../store/modal", () => ({
  useModalStore: () => ({ openModal: vi.fn() }),
}));

// Mock child components that might be complex
vi.mock("./components/active-program-card/ActiveProgramCard", () => ({
  ActiveProgramCard: ({ history }: any) => (
    <div data-testid="active-card">
      {history?.program?.name || "No Active Program"}
    </div>
  ),
}));

vi.mock("./components/ProgramHistoryList", () => ({
  ProgramHistoryList: ({ history }: any) => (
    <div data-testid="history-list">{history.length} items</div>
  ),
}));

describe("TrainingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active program tab by default", () => {
    mockActiveProgram.mockReturnValue({
      program: { name: "Full Body Build" },
      progress: { dayLogs: [] },
    });
    render(<TrainingPage />);
    expect(screen.getByTestId("active-card")).toHaveTextContent(
      "Full Body Build",
    );
  });

  it("switches to history tab", () => {
    mockTrainingHistory.mockReturnValue([]);
    render(<TrainingPage />);

    const historyTab = screen.getByText("training.page.tabs.history");
    fireEvent.click(historyTab);

    expect(screen.getByText("training.history.empty")).toBeInTheDocument();
  });

  it("shows history items in history tab", () => {
    mockActiveProgram.mockReturnValue({
      _id: "current",
      program: { _id: "current", name: "Current" },
      progress: { dayLogs: [] },
    });
    mockTrainingHistory.mockReturnValue([
      {
        _id: "old1",
        program: { _id: "old1", name: "Old" },
        progress: { dayLogs: [] },
      },
      {
        _id: "current",
        program: { _id: "current", name: "Current" },
        progress: { dayLogs: [] },
      },
    ]);

    render(<TrainingPage />);
    fireEvent.click(screen.getByText("training.page.tabs.history"));

    // Should filter out the current active program
    expect(screen.getByTestId("history-list")).toHaveTextContent("1 items");
  });
});
