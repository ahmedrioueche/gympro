import { useTranslation } from "react-i18next";
import { useRespondToAffiliation } from "../../../../../hooks/queries/useGymCoach";
import { useModalStore } from "../../../../../store/modal";
import { useManageCoachRequest } from "../../../../pages/admin/coaching/hooks/useManageCoachRequest";

export function useReviewCoachRequestModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, reviewCoachRequestProps } = useModalStore();
  const isOpen = currentModal === "admin_review_coach_request";
  const { request, affiliationId, gymId } = reviewCoachRequestProps || {};

  // Admin flow hooks
  const {
    approveRequest: adminApprove,
    rejectRequest: adminReject,
    isApproving: isAdminApproving,
    isRejecting: isAdminRejecting,
  } = useManageCoachRequest();

  // Manager flow hooks
  const respondToAffiliation = useRespondToAffiliation();

  const isManagerFlow = !!affiliationId;
  const isPending = isManagerFlow
    ? true
    : request?.coachVerification?.status === "pending";

  const handleApprove = () => {
    if (!request) return;

    if (isManagerFlow && affiliationId) {
      respondToAffiliation.mutate(
        { affiliationId, accept: true },
        { onSuccess: () => closeModal() },
      );
    } else {
      adminApprove(request._id, {
        onSuccess: () => closeModal(),
      });
    }
  };

  const handleReject = () => {
    if (!request) return;

    if (isManagerFlow && affiliationId) {
      respondToAffiliation.mutate(
        { affiliationId, accept: false },
        { onSuccess: () => closeModal() },
      );
    } else {
      adminReject(request._id, {
        onSuccess: () => closeModal(),
      });
    }
  };

  /**
   * Helper to ensure valid file access.
   */
  const getSafeFileUrl = (url: string) => {
    if (!url) return "";
    let finalUrl = url;
    const lowerUrl = url.toLowerCase();

    const strictRawExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".zip",
      ".rar",
    ];
    const hasRawExtension = strictRawExtensions.some((ext) =>
      lowerUrl.endsWith(ext),
    );

    if (hasRawExtension && finalUrl.includes("/image/upload/")) {
      finalUrl = finalUrl.replace("/image/upload/", "/raw/upload/");
    }

    return finalUrl;
  };

  /**
   * Extracts a readable filename from a Cloudinary URL.
   */
  const getDocumentLabel = (
    doc: { description?: string; url: string },
    index: number,
  ): string => {
    if (doc.description) return doc.description;

    try {
      const pathname = new URL(doc.url).pathname;
      const filename = pathname.split("/").pop();
      if (filename) return decodeURIComponent(filename);
    } catch {
      // fall through
    }

    return `${t("admin.coaching.reviewModal.document")} ${index + 1}`;
  };

  return {
    isOpen,
    request,
    closeModal,
    handleApprove,
    handleReject,
    isLoading:
      isAdminApproving || isAdminRejecting || respondToAffiliation.isPending,
    getSafeFileUrl,
    getDocumentLabel,
    isManagerFlow,
    isPending,
  };
}
