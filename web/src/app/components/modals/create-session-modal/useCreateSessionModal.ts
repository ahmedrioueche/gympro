import {
  SessionType,
  type CreateSessionDto,
} from "@ahmedrioueche/gympro-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCoachClients } from "../../../../hooks/queries/useCoaches";
import { useGym } from "../../../../hooks/queries/useGyms";
import { useCreateSession } from "../../../../hooks/queries/useSessions";
import { useModalStore } from "../../../../store/modal";
import { getMessage, showStatusToast } from "../../../../utils/statusMessage";

export const useCreateSessionModal = () => {
  const { t } = useTranslation();
  const { currentModal, createSessionProps, closeModal } = useModalStore();

  const createSession = useCreateSession();

  const isOpen = currentModal === "create_session";
  const { data: clientsData } = useCoachClients(isOpen);
  const clients = clientsData?.data || [];

  const gymId = createSessionProps?.gymId;
  const { data: gymData } = useGym(gymId || "");
  const facilities = (gymData as any)?.facilities || [];

  // Session Form Data
  const [sessionData, setSessionData] = useState<
    CreateSessionDto & { recurrence: { noEndDate?: boolean } }
  >({
    memberId: "",
    startTime: "",
    duration: 60,
    type: SessionType.ONE_ON_ONE,
    notes: "",
    location: "",
    gymId: gymId,
    recurrence: {
      type: "none",
      noEndDate: false,
    },
  });

  useEffect(() => {
    if (gymId) {
      setSessionData((prev) => ({ ...prev, gymId }));
    }
  }, [gymId]);

  const handleClose = () => {
    closeModal();
    setSessionData({
      memberId: "",
      startTime: "",
      duration: 60,
      type: SessionType.ONE_ON_ONE,
      notes: "",
      location: "",
      gymId: gymId,
      recurrence: {
        type: "none",
        noEndDate: false,
      },
    });
  };

  const updateSessionField = <K extends keyof CreateSessionDto>(
    field: K,
    value: any,
  ) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!sessionData.startTime) {
      toast.error(t("schedule.errors.startTimeRequired"));
      return;
    }

    // Transform data for API
    const submissionData = { ...sessionData };
    if (submissionData.recurrence?.type === "none") {
      delete submissionData.recurrence;
    } else if (submissionData.recurrence?.noEndDate) {
      submissionData.recurrence = {
        ...submissionData.recurrence,
        endDate: undefined,
      };
      delete (submissionData.recurrence as any).noEndDate;
    } else {
      delete (submissionData.recurrence as any).noEndDate;
    }

    const response = await createSession.mutateAsync(submissionData as any);
    const message = getMessage(response, t);
    showStatusToast(message, toast);
    if (response?.success) {
      createSessionProps?.onSuccess?.();
      handleClose();
    }
  };

  return {
    t,
    isOpen,
    sessionData,
    updateSessionField,
    handleSubmit,
    handleClose,
    clients,
    facilities,
    isPending: createSession.isPending,
  };
};
