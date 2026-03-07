import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProgressPage from "./ProgressPage";

// Mock dependencies
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: any) => (values ? `${key}_${values.count}` : key),
  }),
}));

const mockUseProgressStats = vi.fn();
const mockUseProgressHistory = vi.fn();

vi.mock("./hooks/useProgress", () => ({
  useProgressStats: () => mockUseProgressStats(),
  useProgressHistory: () => mockUseProgressHistory(),
}));

// Mock child components
vi.mock("./components/StatsOverview", () => ({
  StatsOverview: ({ stats }: any) => (
    <div data-testid="stats-overview">{stats?.totalWorkouts || 0} workouts</div>
  ),
}));

vi.mock("./components/ActivityCalendar", () => ({
  ActivityCalendar: ({ history }: any) => (
    <div data-testid="activity-calendar">{history?.length || 0} events</div>
  ),
}));

vi.mock("./components/RecentWorkouts", () => ({
  RecentWorkouts: ({ history }: any) => (
    <div data-testid="recent-workouts">{history?.length || 0} workouts</div>
  ),
}));

describe("ProgressPage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders page title and subtitle", () => {
    mockUseProgressStats.mockReturnValue({ data: null, isLoading: false });
    mockUseProgressHistory.mockReturnValue({ data: [], isLoading: false });

    render(<ProgressPage />);
    expect(screen.getByText("progress.title")).toBeInTheDocument();
  });

  it("displays streak and total workouts from stats", () => {
    mockUseProgressStats.mockReturnValue({
      data: { currentStreak: 5, totalWorkouts: 12 },
      isLoading: false,
    });
    mockUseProgressHistory.mockReturnValue({ data: [], isLoading: false });

    render(<ProgressPage />);

    // Check streak badge (using mock translation)
    expect(screen.getByText("progress.streakBadge_5")).toBeInTheDocument();

    // Check stats overview
    expect(screen.getByTestId("stats-overview")).toHaveTextContent(
      "12 workouts",
    );

    // Check motivation subtitle
    expect(
      screen.getByText("progress.motivation.subtitle_12"),
    ).toBeInTheDocument();
  });

  it("passes history data to calendar and recent workouts", () => {
    mockUseProgressStats.mockReturnValue({ data: null, isLoading: false });
    mockUseProgressHistory.mockReturnValue({
      data: [{ _id: "1" }, { _id: "2" }],
      isLoading: false,
    });

    render(<ProgressPage />);

    expect(screen.getByTestId("activity-calendar")).toHaveTextContent(
      "2 events",
    );
    expect(screen.getByTestId("recent-workouts")).toHaveTextContent(
      "2 workouts",
    );
  });
});
