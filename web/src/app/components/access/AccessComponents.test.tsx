import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PinView } from "./PinView";
import { QRView } from "./QRView";
import { RFIDView } from "./RFIDView";

// Mock useTranslation
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock qrcode.react
vi.mock("qrcode.react", () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <div data-testid="qr-code">{value}</div>
  ),
}));

describe("Access Components", () => {
  describe("QRView", () => {
    it("renders loading state", () => {
      render(
        <QRView
          token={null}
          isLoading={true}
          isFullscreen={false}
          setIsFullscreen={vi.fn()}
        />,
      );
      expect(screen.getByRole("status")).toBeDefined(); // Loading standard role
    });

    it("renders QR code when token is present", () => {
      const mockToken = "test-token";
      render(
        <QRView
          token={mockToken}
          isLoading={false}
          isFullscreen={false}
          setIsFullscreen={vi.fn()}
        />,
      );
      expect(screen.getByTestId("qr-code")).toBeDefined();
      expect(screen.getByTestId("qr-code").textContent).toBe(mockToken);
    });

    it("calls setIsFullscreen when clicked", () => {
      const setIsFullscreen = vi.fn();
      render(
        <QRView
          token="token"
          isLoading={false}
          isFullscreen={false}
          setIsFullscreen={setIsFullscreen}
        />,
      );
      fireEvent.click(
        screen.getByTestId("qr-code").parentElement
          ?.parentElement as HTMLElement,
      );
      expect(setIsFullscreen).toHaveBeenCalledWith(true);
    });
  });

  describe("PinView", () => {
    it("renders 'not set' state when pinCode is missing", () => {
      render(<PinView pinCode={undefined} />);
      expect(screen.getByText("access.management.not_set")).toBeDefined();
    });

    it("renders masked PIN by default", () => {
      render(<PinView pinCode="123456" />);
      // It should show dots (represented by bg-primary rounded-full divs in the code)
      // We can check if digits are NOT present initially
      expect(screen.queryByText("1")).toBeNull();
    });

    it("toggles PIN visibility when eye icon is clicked", () => {
      render(<PinView pinCode="123456" />);
      const toggle = screen.getByRole("button");
      fireEvent.click(toggle);
      expect(screen.getByText("1")).toBeDefined();
      expect(screen.getByText("6")).toBeDefined();
    });
  });

  describe("RFIDView", () => {
    it("renders 'not set' state when rfidId is missing", () => {
      render(<RFIDView rfidId={undefined} />);
      expect(screen.getByText("access.management.rfid_not_set")).toBeDefined();
    });

    it("renders RFID card info when available", () => {
      render(<RFIDView rfidId="abcd1234efgh" />);
      // The component formats it: ABCD 1234 EFGH
      expect(screen.getByText("ABCD 1234 EFGH")).toBeDefined();
      expect(screen.getByText("GYMPRO")).toBeDefined();
    });
  });
});
