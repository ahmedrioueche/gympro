import { create } from "zustand";
import type {
  ConfirmModalProps,
  EditManagerModalProps,
  ExerciseDetailModalProps,
  UpgradePreviewModalProps,
} from "../types/modals";

type ModalType =
  | "confirm"
  | "upgrade_preview"
  | "edit_user_profile"
  | "exercise_detail"
  | null;

interface ModalState {
  currentModal: ModalType;
  confirmModalProps?: ConfirmModalProps;
  upgradePreviewProps?: UpgradePreviewModalProps;
  editManagerProps?: EditManagerModalProps;
  exerciseModalProps?: ExerciseDetailModalProps;
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
      if (modal === "upgrade_preview") {
        return { currentModal: "upgrade_preview", upgradePreviewProps: props };
      }
      if (modal === "edit_user_profile") {
        return {
          currentModal: "edit_user_profile",
          editManagerProps: props,
        };
      }
      if (modal === "exercise_detail") {
        return { currentModal: "exercise_detail", exerciseModalProps: props };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
