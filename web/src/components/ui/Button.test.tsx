import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders with children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when 'disabled' prop is true", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows loading state", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("is disabled when 'loading' is true", () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("renders an icon when provided", () => {
    const MockIcon = () => <span data-testid="mock-icon">★</span>;
    render(<Button icon={<MockIcon />}>With Icon</Button>);
    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="outline">Outline</Button>);
    let button = screen.getByRole("button");
    expect(button.className).toContain("border-2");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button");
    expect(button.className).toContain("bg-transparent");
  });

  it("sets type correctly", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });
});
