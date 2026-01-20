import { create } from "zustand";
import type {
  AssignProgramModalProps,
  CancelSubscriptionModalProps,
  ClientProfileModalProps,
  CoachProfileModalProps,
  ConfirmModalProps,
  CreateExerciseModalProps,
  CreateSessionModalProps,
  EditManagerModalProps,
  ExerciseDetailModalProps,
  InviteCoachModalProps,
  MemberProfileModalProps,
  ProgramDetailsModalProps,
  RenewSubscriptionModalProps,
  RequestCoachModalProps,
  RequestGymModalProps,
  ScanResultModalProps,
  SessionDetailsModalProps,
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
  | "cancel_subscription"
  | "staff_modal"
  | "request_coach"
  | "create_program"
  | "program_details"
  | "create_exercise"
  | "create_session"
  | "session_details"
  | "invite_coach"
  | "request_gym_affiliation"
  | "assign_program"
  | "member_profile"
  | "client_profile"
  | "coach_profile"
  | null;

interface ModalState {
  currentModal: ModalType;
  confirmModalProps?: ConfirmModalProps;
  upgradePreviewProps?: UpgradePreviewModalProps;
  editManagerProps?: EditManagerModalProps;
  exerciseModalProps?: ExerciseDetailModalProps;
  scanResultProps?: ScanResultModalProps;
  renewSubscriptionProps?: RenewSubscriptionModalProps;
  cancelSubscriptionProps?: CancelSubscriptionModalProps;
  staffModalProps?: StaffModalProps;
  requestCoachProps?: RequestCoachModalProps;
  programDetailsProps?: ProgramDetailsModalProps;
  createExerciseProps?: CreateExerciseModalProps;
  createSessionProps?: CreateSessionModalProps;
  sessionDetailsProps?: SessionDetailsModalProps;
  inviteCoachProps?: InviteCoachModalProps;
  requestGymProps?: RequestGymModalProps;
  assignProgramProps?: AssignProgramModalProps;
  memberProfileProps?: MemberProfileModalProps;
  clientProfileProps?: ClientProfileModalProps;
  coachProfileProps?: CoachProfileModalProps;
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
      if (modal === "cancel_subscription") {
        return {
          currentModal: "cancel_subscription",
          cancelSubscriptionProps: props,
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
      if (modal === "create_session") {
        return {
          currentModal: "create_session",
          createSessionProps: props,
        };
      }
      if (modal === "session_details") {
        return {
          currentModal: "session_details",
          sessionDetailsProps: props,
        };
      }
      if (modal === "invite_coach") {
        return {
          currentModal: "invite_coach",
          inviteCoachProps: props,
        };
      }
      if (modal === "request_gym_affiliation") {
        return {
          currentModal: "request_gym_affiliation",
          requestGymProps: props,
        };
      }
      if (modal === "assign_program") {
        return {
          currentModal: "assign_program",
          assignProgramProps: props,
        };
      }
      if (modal === "member_profile") {
        return {
          currentModal: "member_profile",
          memberProfileProps: props,
        };
      }
      if (modal === "client_profile") {
        return {
          currentModal: "client_profile",
          clientProfileProps: props,
        };
      }
      if (modal === "coach_profile") {
        return {
          currentModal: "coach_profile",
          coachProfileProps: props,
        };
      }
      return { currentModal: null };
    }),

  closeModal: () =>
    set({
      currentModal: null,
    }),
}));
