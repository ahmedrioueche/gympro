import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

describe("Card Components", () => {
  it("renders card with custom className", () => {
    render(<Card className="custom-card">Card Content</Card>);
    const card = screen.getByText("Card Content");
    expect(card).toHaveClass("custom-card");
    expect(card).toHaveClass("rounded-lg");
  });

  it("renders card header, title and content", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Content Body</CardContent>
      </Card>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Content Body")).toBeInTheDocument();
    expect(screen.getByText("Title").tagName).toBe("H3");
  });

  it("passes extra props to card elements", () => {
    render(<Card data-testid="test-card">Test</Card>);
    expect(screen.getByTestId("test-card")).toBeInTheDocument();
  });
});
