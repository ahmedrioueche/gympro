import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Tab from "./Tab";

// Mock resetAllScrollers
vi.mock("../../utils/scroll", () => ({
  resetAllScrollers: vi.fn(),
}));

describe("Tab", () => {
  it("renders with label correctly", () => {
    render(<Tab label="Current Program" />);
    expect(screen.getByText("Current Program")).toBeInTheDocument();
  });

  it("renders with count correctly", () => {
    render(<Tab label="Users" count={10} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("(10)")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Tab label="History" onClick={handleClick} />);
    fireEvent.click(screen.getByText("History"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies active styles correctly", () => {
    const { rerender } = render(<Tab label="Tab" isActive={true} />);
    let button = screen.getByRole("button");
    expect(button.className).toContain("border-primary");
    expect(button.className).toContain("text-primary");

    rerender(<Tab label="Tab" isActive={false} />);
    button = screen.getByRole("button");
    expect(button.className).toContain("border-transparent");
    expect(button.className).toContain("text-text-secondary");
  });

  it("applies custom className", () => {
    render(<Tab label="Tab" className="custom-class" />);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });
});
