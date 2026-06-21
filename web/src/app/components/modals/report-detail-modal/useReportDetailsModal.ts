import {
  type Report,
  type ReportResponse,
  ReportStatus,
  uploadApi,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  useAddAttachments,
  useAddResponse,
  useReport,
  useUpdateReportStatus,
} from "../../../../hooks/queries/useReports";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../store/user";

export function useReportDetailsModal() {
  const { t } = useTranslation();
  const { closeModal, reportDetailsProps } = useModalStore();
  const { isOpen, zIndex } = useModalLayer("report_details");
  const { user } = useUserStore();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateReportStatus();
  const { mutate: addResponse, isPending: isSendingResponse } =
    useAddResponse();
  const { mutate: addAttachments, isPending: isAddingAttachments } =
    useAddAttachments();

  const [message, setMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | null>(
    null,
  );
  const [localResponses, setLocalResponses] = useState<ReportResponse[]>([]);
  const [localAttachments, setLocalAttachments] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const isOpen =
    isOpen &&
    (!!reportDetailsProps?.report || !!reportDetailsProps?.reportId);

  const { data: fetchedReport, isLoading: isFetchingReport } = useReport(
    reportDetailsProps?.reportId,
  );

  const baseReport =
    (reportDetailsProps?.report as Report | undefined) || fetchedReport;

  // Initialize local responses and attachments when report changes
  useEffect(() => {
    if (baseReport?.responses) {
      setLocalResponses(baseReport.responses);
    }
    if (baseReport?.attachments) {
      setLocalAttachments(baseReport.attachments);
    }
  }, [
    baseReport?._id,
    baseReport?.responses?.length,
    baseReport?.attachments?.length,
  ]);

  // Create report with local data
  const report = baseReport
    ? {
        ...baseReport,
        responses: localResponses,
        attachments: localAttachments,
      }
    : undefined;

  // Sync selected status with report status
  useEffect(() => {
    if (baseReport?.status && !selectedStatus) {
      setSelectedStatus(baseReport.status);
    }
  }, [baseReport?.status, selectedStatus]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setSelectedStatus(null);
      setLocalResponses([]);
      setLocalAttachments([]);
    }
  }, [isOpen]);

  // Derived values
  const currentUserId = user?._id;
  const reporterId = report?.reporter
    ? typeof report.reporter === "string"
      ? report.reporter
      : report.reporter._id
    : undefined;
  const isReporter = currentUserId === reporterId;
  const hasResponses = localResponses.length > 0;

  // Handlers
  const handleSaveStatus = () => {
    if (!report || !selectedStatus || selectedStatus === report.status) return;
    updateStatus({ id: report._id, status: selectedStatus });
  };

  const handleSendMessage = useCallback(() => {
    if (!report || !message.trim() || !user) return;

    const messageText = message.trim();

    // Create new response with user data
    const newResponse: ReportResponse = {
      message: messageText,
      sender: {
        _id: user._id,
        profile: {
          fullName: user.profile?.fullName || "You",
          email: user.profile?.email || "",
        },
      } as any,
      createdAt: new Date().toISOString(),
    } as ReportResponse;

    // Add to local state immediately
    setLocalResponses((prev) => [...prev, newResponse]);
    setMessage("");

    // Send to server
    addResponse(
      { reportId: report._id, data: { message: messageText } },
      {
        onError: () => {
          // Remove on error
          setLocalResponses((prev) => prev.filter((r) => r !== newResponse));
          setMessage(messageText);
        },
      },
    );
  }, [report, message, user, addResponse]);

  const handleUploadAttachments = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0 || !report) return;

      setIsUploading(true);
      try {
        const uploadPromises = Array.from(files).map((file) =>
          uploadApi.uploadFile(file),
        );
        const responses = await Promise.all(uploadPromises);
        const newAttachments = responses
          .map((res) => (res.success && res.data ? res.data.url : null))
          .filter((url): url is string => url !== null);

        if (newAttachments.length < files.length) {
          toast.error(t("support.upload_failed"));
        }

        if (newAttachments.length > 0) {
          // Add to local state immediately
          setLocalAttachments((prev) => [...prev, ...newAttachments]);

          // Save to server
          addAttachments(
            { reportId: report._id, attachments: newAttachments },
            {
              onError: () => {
                // Remove on error
                setLocalAttachments((prev) =>
                  prev.filter((a) => !newAttachments.includes(a)),
                );
              },
            },
          );
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(t("support.upload_failed"));
      } finally {
        setIsUploading(false);
      }
    },
    [report, addAttachments, t],
  );

  // Status options
  const statusOptions = Object.values(ReportStatus).map((status) => ({
    value: status,
    label: t(`admin.reports.status.${status}`),
  }));

  // Color helpers
  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      [ReportStatus.OPEN]: "bg-blue-500/10 text-blue-500",
      [ReportStatus.IN_PROGRESS]: "bg-yellow-500/10 text-yellow-500",
      [ReportStatus.RESOLVED]: "bg-green-500/10 text-green-500",
      [ReportStatus.CLOSED]: "bg-surface-secondary text-text-secondary",
    };
    return colors[status] || colors[ReportStatus.OPEN];
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500/10 text-red-500",
      medium: "bg-yellow-500/10 text-yellow-500",
      low: "bg-green-500/10 text-green-500",
    };
    return colors[priority] || "bg-surface-secondary text-text-secondary";
  };

  // Get sender info for conversation
  const getSenderInfo = useCallback(
    (response: ReportResponse) => {
      const sender = response.sender;
      const senderId = typeof sender === "string" ? sender : sender?._id || "";
      const senderName =
        typeof sender !== "string" ? sender?.profile?.fullName : undefined;
      const isCurrentUser = senderId === currentUserId;
      const isSenderReporter = senderId === reporterId;

      let label: string;
      if (isCurrentUser) {
        label = t("support.you");
      } else if (isSenderReporter) {
        label = senderName || t("support.user");
      } else {
        label = t("support.admin");
      }

      const initial =
        senderName?.[0]?.toUpperCase() ||
        (isCurrentUser ? "Y" : isSenderReporter ? "U" : "A");

      return {
        senderId,
        senderName,
        isCurrentUser,
        isSenderReporter,
        label,
        initial,
    zIndex,
  };
    },
    [currentUserId, reporterId, t],
  );

  return {
    // State
    isOpen,
    report,
    message,
    setMessage,
    selectedStatus,
    setSelectedStatus,

    // Loading states
    isUpdatingStatus,
    isSendingResponse,
    isUploading,
    isAddingAttachments,

    // Derived
    isReporter,
    hasResponses,
    currentUserId,
    reporterId,
    statusOptions,

    // Handlers
    closeModal,
    handleSaveStatus,
    handleSendMessage,
    handleUploadAttachments,

    // Helpers
    getStatusColor,
    getPriorityColor,
    getSenderInfo,
  };
}
