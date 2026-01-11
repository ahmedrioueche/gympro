import { create } from "zustand";
import type {
  ConfirmModalProps,
  EditManagerModalProps,
  ExerciseDetailModalProps,
  RenewSubscriptionModalProps,
  ScanResultModalProps,
  StaffModalProps,
  UpgradePreviewModalProps,
} from "../types/modals";

type ModalType =
  | "confirm"
  | "upgrade_preview"
  | "edit_user_profile"
  | "exercise_detail"
  | "scan_result"
  | "renew_subscription"
  | "staff_modal"
  | null;

interface ModalState {
  currentModal: ModalType;
  confirmModalProps?: ConfirmModalProps;
  upgradePreviewProps?: UpgradePreviewModalProps;
  editManagerProps?: EditManagerModalProps;
  exerciseModalProps?: ExerciseDetailModalProps;
  scanResultProps?: ScanResultModalProps;
  renewSubscriptionProps?: RenewSubscriptionModalProps;
  staffModalProps?: StaffModalProps;
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
      if (modal === "scan_result") {
        return { currentModal: "scan_result", scanResultProps: props };
      }
      if (modal === "renew_subscription") {
        return {
          currentModal: "renew_subscription",
          renewSubscriptionProps: props,
        };
      }
      if (modal === "staff_modal") {
        return {
          currentModal: "staff_modal",
          staffModalProps: props,
        };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
