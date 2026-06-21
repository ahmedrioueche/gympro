import { useModalStore } from "../store/modal";
import type { ModalType } from "../store/modalStackUtils";
import { getModalStackIndex } from "../store/modalStackUtils";

const BASE_MODAL_Z_INDEX = 50;

export const getModalZIndex = (stackIndex: number) =>
  BASE_MODAL_Z_INDEX + Math.max(stackIndex, 0) * 10;

/** Visibility + stacking layer for a modal type (supports stacked modals). */
export const useModalLayer = (type: ModalType) => {
  const stack = useModalStore((state) => state.stack);
  const closeModal = useModalStore((state) => state.closeModal);
  const stackIndex = getModalStackIndex(stack, type);
  const isOpen = stackIndex >= 0;

  return {
    isOpen,
    stackIndex,
    zIndex: getModalZIndex(stackIndex),
    closeModal,
  };
};
