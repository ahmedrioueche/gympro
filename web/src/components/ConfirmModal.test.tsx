import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfirmModal from "./ConfirmModal";

const mockCloseModal = vi.fn();
const mockOnConfirm = vi.fn();
const mockSecondaryOnClick = vi.fn();

vi.mock("../store/modal", () => ({
  useModalStore: () => ({
    confirmModalProps: {
      title: "Confirm",
      text: "Are you sure?",
      confirmText: "Start new workout",
      onConfirm: mockOnConfirm,
      secondaryAction: {
        label: "Resume workout",
        onClick: mockSecondaryOnClick,
      },
    },
    closeModal: mockCloseModal,
  }),
}));

vi.mock("../hooks/useModalLayer", () => ({
  useModalLayer: () => ({ isOpen: true, zIndex: 100 }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ConfirmModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("closes confirm before running onConfirm", () => {
    const callOrder: string[] = [];
    mockCloseModal.mockImplementation(() => callOrder.push("close"));
    mockOnConfirm.mockImplementation(() => callOrder.push("confirm"));

    render(<ConfirmModal />);
    fireEvent.click(screen.getByText("Start new workout"));

    expect(callOrder).toEqual(["close", "confirm"]);
  });

  it("closes confirm before running secondaryAction onClick", () => {
    const callOrder: string[] = [];
    mockCloseModal.mockImplementation(() => callOrder.push("close"));
    mockSecondaryOnClick.mockImplementation(() => callOrder.push("secondary"));

    render(<ConfirmModal />);
    fireEvent.click(screen.getByText("Resume workout"));

    expect(callOrder).toEqual(["close", "secondary"]);
  });
});
