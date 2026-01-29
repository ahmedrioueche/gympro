import { SessionStatus } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useDeleteSession,
  useUpdateSession,
} from "../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../store/modal";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";

export const useSessionDetails = () => {
  const { t } = useTranslation();
  const { currentModal, sessionDetailsProps, closeModal, openModal } =
    useModalStore();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const isOpen = currentModal === "session_details";
  const session = sessionDetailsProps?.session;

  const [notes, setNotes] = useState("");
  // Local status state for immediate UI feedback (optimistic in modal)
  const [currentStatus, setCurrentStatus] = useState<SessionStatus | undefined>(
    undefined,
  );

  useEffect(() => {
    if (session) {
      setNotes(session.notes || "");
      setCurrentStatus(session.status);
    }
  }, [session]);

  const handleStatusChange = async (status: SessionStatus) => {
    // Optimistic update locally
    setCurrentStatus(status);

    try {
      const response = await updateSession.mutateAsync({
        id: session!._id,
        data: { status },
      });
      const message = getMessage({ success: !!response, data: response }, t);
      showStatusToast(message, toast);
    } catch (error) {
      // Revert on error
      setCurrentStatus(session?.status);
    }
  };

  const handleSaveNotes = async () => {
    if (!session) return;
    const response = await updateSession.mutateAsync({
      id: session._id,
      data: { notes },
    });
    const message = getMessage({ success: !!response, data: response }, t);
    showStatusToast(message, toast);
  };

  const handleDelete = () => {
    if (!session) return;
    openModal("confirm", {
      title: t("schedule.deleteSession"),
      text: t("schedule.deleteSessionConfirm"),
      confirmText: t("common.delete"),
      onConfirm: async () => {
        await deleteSession.mutateAsync(session._id);
        closeModal();
        toast.success(t("schedule.sessionDeleted"));
      },
    });
  };

  return {
    isOpen,
    session,
    notes,
    setNotes,
    currentStatus,
    handleStatusChange,
    handleSaveNotes,
    handleDelete,
    closeModal,
    isUpdating: updateSession.isPending,
  };
};
