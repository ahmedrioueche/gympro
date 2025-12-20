import type { AppPlan } from "@ahmedrioueche/gympro-client";
import { create } from "zustand";

type ModalType = "confirm" | "upgradePreview" | null;

interface ConfirmModalProps {
  text?: string;
  title?: string;
  confirmVariant?: "danger" | "success" | "primary";
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UpgradePreviewModalProps {
  currentPlan: AppPlan;
  targetPlan: AppPlan;
  previewData: any;
  onConfirm: () => void;
}

interface ModalState {
  currentModal: ModalType;
  confirmModalProps?: ConfirmModalProps;
  upgradePreviewProps?: UpgradePreviewModalProps;
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
      if (modal === "upgradePreview") {
        return { currentModal: "upgradePreview", upgradePreviewProps: props };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
