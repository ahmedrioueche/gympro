import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InputField from "./InputField";

describe("InputField", () => {
  it("renders with label correctly", () => {
    render(<InputField label="Username" placeholder="Enter username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(
      <InputField label="Username" id="username" onChange={handleChange} />,
    );
    const input = screen.getByLabelText("Username");
    fireEvent.change(input, { target: { value: "testuser" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows error message correctly", () => {
    render(<InputField label="Email" id="email" error="Invalid email" />);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    const input = screen.getByLabelText("Email");
    expect(input.className).toContain("border-danger");
  });

  it("is disabled when 'disabled' prop is true", () => {
    render(<InputField label="Age" id="age" disabled />);
    const input = screen.getByLabelText("Age");
    expect(input).toBeDisabled();
  });

  it("toggles password visibility", () => {
    render(<InputField label="Password" id="password" type="password" />);
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("renders left and right icons", () => {
    render(
      <InputField
        label="Search"
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      />,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies custom width", () => {
    const { container } = render(<InputField label="Test" width="200px" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("200px");
  });
});
