import { fireEvent, render, screen } from "@testing-library/react";
import { Plus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import NoData from "./NoData";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("NoData Component", () => {
  it("renders default state with generic icon and translated text", () => {
    render(<NoData />);
    expect(screen.getByText("general.no_data")).toBeInTheDocument();
    expect(screen.getByText("general.no_data_desc")).toBeInTheDocument();
  });

  it("renders custom title and description", () => {
    render(<NoData title="Custom Title" description="Custom Description" />);
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
  });

  it("renders emoji instead of icon", () => {
    render(<NoData emoji="🤔" />);
    expect(screen.getByText("🤔")).toBeInTheDocument();
  });

  it("renders action button and handles click", () => {
    const handleClick = vi.fn();
    render(
      <NoData
        actionButton={{
          label: "Click Me",
          onClick: handleClick,
          icon: Plus,
        }}
      />,
    );

    const button = screen.getByText("Click Me");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
