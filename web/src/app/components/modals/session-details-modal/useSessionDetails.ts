import { SessionStatus } from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useDeleteSession,
  useUpdateSession,
} from "../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../store/user";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";

export const useSessionDetails = () => {
  const { t } = useTranslation();
  const { sessionDetailsProps, closeModal, openModal } = useModalStore();
  const { activeDashboard } = useUserStore();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("session_details");
  const session = sessionDetailsProps?.session;
  const isMemberView = activeDashboard === "member";

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
    if (!session) return;
    const performUpdate = async (updateSeries = false) => {
      setCurrentStatus(status);
      try {
        const response = await updateSession.mutateAsync({
          id: session._id,
          data: { status },
          updateSeries,
        });
        const message = getMessage({ success: !!response, data: response }, t);
        showStatusToast(message, toast);
      } catch (error) {
        setCurrentStatus(session.status);
      }
    };

    if (session.seriesId && status === SessionStatus.CANCELLED) {
      openModal("confirm", {
        title: t("schedule.cancelSession"),
        text: t("schedule.cancelSeriesConfirm"),
        confirmText: t("schedule.cancelThisOnly"),
        onConfirm: () => performUpdate(false),
        secondaryAction: {
          label: t("schedule.cancelEntireSeries"),
          onClick: () => performUpdate(true),
        },
      });
    } else {
      performUpdate(false);
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

    const performDelete = async (deleteSeries = false) => {
      await deleteSession.mutateAsync({ id: session._id, deleteSeries });
      closeModal();
      toast.success(
        deleteSeries
          ? t("schedule.seriesDeleted")
          : t("schedule.sessionDeleted"),
      );
    };

    if (session.seriesId) {
      openModal("confirm", {
        title: t("schedule.deleteSession"),
        text: t("schedule.deleteSeriesConfirm"),
        confirmText: t("schedule.deleteThisOnly"),
        onConfirm: () => performDelete(false),
        secondaryAction: {
          label: t("schedule.deleteEntireSeries"),
          onClick: () => performDelete(true),
        },
      });
    } else {
      openModal("confirm", {
        title: t("schedule.deleteSession"),
        text: t("schedule.deleteSessionConfirm"),
        confirmText: t("common.delete"),
        onConfirm: () => performDelete(false),
      });
    }
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
    isMemberView,
    zIndex,
  };
};
