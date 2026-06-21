import { create } from "zustand";
import {
  buildLegacyModalState,
  createModalId,
  getModalStackIndex,
  isModalTypeOpen,
  type ActiveModalType,
  type ModalLegacyProps,
  type ModalStackEntry,
  type ModalType,
} from "./modalStackUtils";

export type { ActiveModalType, ModalStackEntry, ModalType } from "./modalStackUtils";

interface ModalState extends ModalLegacyProps {
  stack: ModalStackEntry[];
  currentModal: ActiveModalType;
  openModal: (modal: ModalType, props?: unknown) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  isModalOpen: (type: ModalType) => boolean;
  getStackIndex: (type: ModalType) => number;
}

const applyStack = (stack: ModalStackEntry[]) => ({
  stack,
  ...buildLegacyModalState(stack),
});

export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],
  currentModal: null,
  confirmModalProps: undefined,
  upgradePreviewProps: undefined,
  editManagerProps: undefined,
  exerciseModalProps: undefined,
  scanResultProps: undefined,
  renewSubscriptionProps: undefined,
  cancelSubscriptionProps: undefined,
  staffModalProps: undefined,
  requestCoachProps: undefined,
  programDetailsProps: undefined,
  createExerciseProps: undefined,
  createSessionProps: undefined,
  sessionDetailsProps: undefined,
  inviteCoachProps: undefined,
  requestGymProps: undefined,
  assignProgramProps: undefined,
  memberProfileProps: undefined,
  clientProfileProps: undefined,
  coachProfileProps: undefined,
  coachPricingProps: undefined,
  gymInvitationProps: undefined,
  createAnnouncementProps: undefined,
  logSessionProps: undefined,
  reviewCoachRequestProps: undefined,
  editAppPlanProps: undefined,
  adminManagePermissionsProps: undefined,
  adminCreateEditorProps: undefined,
  reportDetailsProps: undefined,
  alertProps: undefined,
  inventoryItemProps: undefined,
  competitionProps: undefined,
  productProps: undefined,
  gymMediaProps: undefined,
  userProfileProps: undefined,
  productDetailsProps: undefined,
  competitionDetailsProps: undefined,
  competitionParticipantsProps: undefined,
  setWinnersProps: undefined,
  gymClassProps: undefined,
  serviceProps: undefined,
  pricingProps: undefined,
  createMemberProps: undefined,
  classDetailsProps: undefined,
  coachingOfferProps: undefined,
  featurePackageProps: undefined,
  bannerFormProps: undefined,
  welcomeTourProps: undefined,
  subscriptionWarningProps: undefined,
  accessManagementProps: undefined,
  gymDetailsProps: undefined,
  deleteAccountProps: undefined,

  openModal: (modal, props) => {
    const id = createModalId();
    set((state) =>
      applyStack([...state.stack, { id, type: modal, props }]),
    );
    return id;
  },

  closeModal: (id) =>
    set((state) => {
      const stack = id
        ? state.stack.filter((entry) => entry.id !== id)
        : state.stack.slice(0, -1);
      return applyStack(stack);
    }),

  closeAllModals: () => set(applyStack([])),

  isModalOpen: (type) => isModalTypeOpen(get().stack, type),

  getStackIndex: (type) => getModalStackIndex(get().stack, type),
}));
