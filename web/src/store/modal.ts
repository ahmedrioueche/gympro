import { create } from "zustand";

type ModalType = "confirm" | null;

interface ConfirmModalProps {
  text?: string;
  title?: string;
  confirmVariant?: "danger" | "success" | "primary";
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalState {
  currentModal: ModalType;
  confirmModalProps?: ConfirmModalProps;
  openModal: (modal: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentModal: null,
  confirmModalProps: undefined,
  openModal: (modal, props) =>
    set(() => {
      if (modal === "confirm") {
        return { currentModal: "confirm", confirmModalProps: props };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
