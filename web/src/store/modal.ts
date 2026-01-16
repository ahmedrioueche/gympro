import { create } from "zustand";
import type {
  ConfirmModalProps,
  CreateExerciseModalProps,
  EditManagerModalProps,
  ExerciseDetailModalProps,
  ProgramDetailsModalProps,
  RenewSubscriptionModalProps,
  RequestCoachModalProps,
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
  | "request_coach"
  | "create_program"
  | "program_details"
  | "create_exercise"
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
  requestCoachProps?: RequestCoachModalProps;
  programDetailsProps?: ProgramDetailsModalProps;
  createExerciseProps?: CreateExerciseModalProps;
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
      if (modal === "request_coach") {
        return {
          currentModal: "request_coach",
          requestCoachProps: props,
        };
      }
      if (modal === "create_program") {
        return {
          currentModal: "create_program",
        };
      }
      if (modal === "program_details") {
        return {
          currentModal: "program_details",
          programDetailsProps: props,
        };
      }
      if (modal === "create_exercise") {
        return {
          currentModal: "create_exercise",
          createExerciseProps: props,
        };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
