import { type ProgramHistory } from "@ahmedrioueche/gympro-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProgramHistoryList } from "./ProgramHistoryList";

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === "training.history.sessions") {
        return `${options?.count || 0} Sessions`;
      }
      return key;
    },
  }),
}));

const mockHistory: ProgramHistory[] = [
  {
    _id: "h1",
    userId: "u1",
    program: {
      _id: "p1",
      name: "Strength Training",
      category: "strength",
      difficulty: "intermediate",
      durationWeeks: 4,
      daysPerWeek: 3,
      equipment: ["Dumbbells"],
      source: "system",
      description: "Test description",
      days: [],
    },
    status: "abandoned",
    progress: {
      programId: "p1",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-01-15"),
      daysCompleted: 5,
      totalDays: 12,
      dayLogs: [],
    },
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-15"),
  } as any,
];

describe("ProgramHistoryList", () => {
  it("should render history items correctly", () => {
    render(<ProgramHistoryList history={mockHistory} onRestart={() => {}} />);

    expect(screen.getByText("Strength Training")).toBeInTheDocument();
    expect(
      screen.getByText("training.history.status.abandoned"),
    ).toBeInTheDocument();
    expect(screen.getByText("5 Sessions")).toBeInTheDocument();
  });

  it("should call onRestart when Restart button is clicked", () => {
    const onRestartMock = vi.fn();
    render(
      <ProgramHistoryList history={mockHistory} onRestart={onRestartMock} />,
    );

    const restartButton = screen.getByTitle("common.restart");
    fireEvent.click(restartButton);

    expect(onRestartMock).toHaveBeenCalledWith("h1");
  });

  it("should disable Restart button when isRestarting is true", () => {
    render(
      <ProgramHistoryList
        history={mockHistory}
        onRestart={() => {}}
        isRestarting={true}
      />,
    );

    const restartButton = screen.getByTitle("common.restart");
    expect(restartButton).toBeDisabled();
  });
});
