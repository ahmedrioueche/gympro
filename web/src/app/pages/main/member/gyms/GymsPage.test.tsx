import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GymsPage from "./GymsPage";

// Mock dependencies
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockSetActiveTab = vi.fn();
const mockUseMemberGymsPage = vi.fn();

vi.mock("./hooks/useMemberGymsPage", () => ({
  useMemberGymsPage: () => mockUseMemberGymsPage(),
}));

// Mock child components to keep integration focused
vi.mock("../../../../components/gym/GymList", () => ({
  default: ({ gyms, isLoading }: any) => (
    <div data-testid="gym-list">
      {isLoading ? "Loading..." : `${gyms.length} gyms`}
    </div>
  ),
}));

vi.mock("../../../../components/gyms/GymDiscovery", () => ({
  default: ({ title }: any) => <div data-testid="gym-discovery">{title}</div>,
}));

describe("GymsPage integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders my gyms tab by default", () => {
    mockUseMemberGymsPage.mockReturnValue({
      activeTab: "my_gyms",
      setActiveTab: mockSetActiveTab,
      myGyms: [{ _id: "1" }],
      isMyGymsLoading: false,
      exploreCount: 10,
    });

    render(<GymsPage />);
    expect(screen.getByTestId("gym-list")).toHaveTextContent("1 gyms");
  });

  it("renders gym discovery when active tab is explore", () => {
    mockUseMemberGymsPage.mockReturnValue({
      activeTab: "explore",
      setActiveTab: mockSetActiveTab,
      myGyms: [],
      isMyGymsLoading: false,
      exploreCount: 10,
    });

    render(<GymsPage />);
    expect(screen.getByTestId("gym-discovery")).toHaveTextContent(
      "gyms.discover_title",
    );
  });

  it("calls setActiveTab when clicking tabs", () => {
    mockUseMemberGymsPage.mockReturnValue({
      activeTab: "my_gyms",
      setActiveTab: mockSetActiveTab,
      myGyms: [],
      isMyGymsLoading: false,
      exploreCount: 10,
    });

    render(<GymsPage />);
    const exploreTab = screen.getByText("gyms.discover_title");
    fireEvent.click(exploreTab);
    expect(mockSetActiveTab).toHaveBeenCalledWith("explore");
  });
});
