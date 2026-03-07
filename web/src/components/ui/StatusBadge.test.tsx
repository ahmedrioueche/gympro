import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatusBadge from "./StatusBadge";

describe("StatusBadge Component", () => {
  it("renders with correct label for pending status", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pending");
    expect(badge).toHaveClass("bg-yellow-500/10");
  });

  it("renders with correct label for approved status", () => {
    render(<StatusBadge status="approved" />);
    const badge = screen.getByText("Approved");
    expect(badge).toHaveClass("bg-green-500/10");
  });

  it("renders with correct label for rejected status", () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText("Rejected");
    expect(badge).toHaveClass("bg-red-500/10");
  });

  it("handles case-insensitivity in status", () => {
    render(<StatusBadge status="ACTIVE" />);
    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("text-green-500");
  });

  it("defaults to grey for unknown status", () => {
    render(<StatusBadge status="unknown" />);
    const badge = screen.getByText("unknown");
    expect(badge).toHaveClass("text-gray-500");
  });
});
