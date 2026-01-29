import { coachApi, trainingApi } from "@ahmedrioueche/gympro-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../store/modal";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";

export function useAssignProgram() {
  const { t } = useTranslation();
  const { currentModal, closeModal, openModal, assignProgramProps } =
    useModalStore();
  const queryClient = useQueryClient();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );

  // Initialize selectedProgramId when modal opens
  if (
    currentModal === "assign_program" &&
    assignProgramProps?.currentProgramId &&
    selectedProgramId === null
  ) {
    setSelectedProgramId(assignProgramProps.currentProgramId);
  }

  const { data: programs = [], isLoading: isProgramsLoading } = useQuery({
    queryKey: ["coach", "programs"],
    queryFn: async () => {
      const response = await trainingApi.getPrograms();
      return response.data;
    },
    enabled: currentModal === "assign_program",
  });

  const assignProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      if (!assignProgramProps?.clientId) return;
      return coachApi.assignProgram(assignProgramProps.clientId, programId);
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["coach", "clients"] });
        closeModal();
        assignProgramProps?.onSuccess?.();
      }
    },
  });

  const executeAssignment = async () => {
    if (!selectedProgramId) return;
    try {
      const response =
        await assignProgramMutation.mutateAsync(selectedProgramId);
      if (response) {
        const msg = getMessage(response, t);
        showStatusToast(msg, toast);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssign = () => {
    if (!selectedProgramId) return;

    // If changing program (and user has one), show confirm modal
    if (
      assignProgramProps?.currentProgramId &&
      assignProgramProps.currentProgramId !== selectedProgramId
    ) {
      openModal("confirm", {
        title: t("coach.clients.assignProgram.confirmChangeTitle"),
        text: t("coach.clients.assignProgram.confirmChangeDesc"),
        confirmText: t("common.confirm"),
        cancelText: t("common.cancel"),
        onConfirm: () => {
          executeAssignment();
        },
        onCancel: () => {
          // Re-open assignment modal
          openModal("assign_program", { ...assignProgramProps });
        },
      });
      return;
    }

    executeAssignment();
  };

  return {
    programs,
    isProgramsLoading,
    selectedProgramId,
    setSelectedProgramId,
    handleAssign,
    isAssigning: assignProgramMutation.isPending,
    closeModal,
    isOpen: currentModal === "assign_program",
    // showConfirm,
    // setShowConfirm,
    executeAssignment,
    currentProgramId: assignProgramProps?.currentProgramId,
  };
}
