import { fireEvent, render, screen } from "@testing-library/react";
import { Dumbbell, Plus } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import PageHeader from "./PageHeader";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Dropdown and DropdownItem
vi.mock("../../components/ui/Dropdown", () => {
  const Dropdown = ({ children, trigger }: any) => (
    <div>
      <div data-testid="dropdown-trigger">{trigger}</div>
      <div data-testid="dropdown-content">
        {typeof children === "function" ? children(vi.fn()) : children}
      </div>
    </div>
  );
  const DropdownItem = ({ label, onClick }: any) => (
    <button onClick={onClick} data-testid={`item-${label}`}>
      {label}
    </button>
  );
  return {
    default: Dropdown,
    DropdownItem: DropdownItem,
  };
});

describe("PageHeader Component", () => {
  const defaultProps = {
    title: "Test Title",
    subtitle: "Test Subtitle",
  };

  it("renders title and subtitle", () => {
    render(<PageHeader {...defaultProps} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    const { container } = render(
      <PageHeader {...defaultProps} icon={Dumbbell} />,
    );
    // Icon is wrapped in a specific div in sm+ screens
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders single action button and handles click", () => {
    const handleClick = vi.fn();
    render(
      <PageHeader
        {...defaultProps}
        actionButton={{
          label: "Create",
          icon: Plus,
          onClick: handleClick,
        }}
      />,
    );

    const button = screen.getByText("Create");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders multiple actions as a dropdown", () => {
    const handleOne = vi.fn();
    const handleTwo = vi.fn();
    render(
      <PageHeader
        {...defaultProps}
        actions={[
          { label: "Action 1", icon: Plus, onClick: handleOne },
          { label: "Action 2", icon: Plus, onClick: handleTwo },
        ]}
      />,
    );

    // Should show "Actions" trigger (from translation)
    const trigger = screen.getByText("common.actions");
    expect(trigger).toBeInTheDocument();

    // Check actions in dropdown
    expect(screen.getByText("Action 1")).toBeInTheDocument();
    expect(screen.getByText("Action 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Action 1"));
    expect(handleOne).toHaveBeenCalledTimes(1);
  });
});
