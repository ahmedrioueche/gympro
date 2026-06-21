import { Check, UserCheck, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../components/ui/BaseModal";
import { CoachRequestCertifications } from "./components/CoachRequestCertifications";
import { CoachRequestDocuments } from "./components/CoachRequestDocuments";
import { CoachRequestHeader } from "./components/CoachRequestHeader";
import { CoachRequestSocialLinks } from "./components/CoachRequestSocialLinks";
import { useReviewCoachRequestModal } from "./hooks/useReviewCoachRequestModal";

export default function ReviewCoachRequestModal() {
  const { t } = useTranslation();
  const {
    
    isOpen,
    request,
    closeModal,
    handleApprove,
    handleReject,
    isLoading,
    getSafeFileUrl,
    getDocumentLabel,
    isManagerFlow,
    isPending,
  
    zIndex,
  } = useReviewCoachRequestModal();

  if (!isOpen || !request) return null;

  const { profile, coachVerification, createdAt } = request;
  const { certificationDetails, socialMediaLinks, documents, status } =
    coachVerification || {};

  return (
    <BaseModal
      isOpen={isOpen} zIndex={zIndex}
      onClose={closeModal}
      icon={UserCheck}
      title={
        isManagerFlow
          ? t("admin.coaching.reviewModal.title")
          : t("admin.coaching.reviewModal.title")
      }
      subtitle={
        isManagerFlow
          ? t("admin.coaching.reviewModal.subtitle")
          : t("admin.coaching.reviewModal.subtitle")
      }
      primaryButton={
        isPending
          ? {
              label: t("admin.coaching.reviewModal.approve"),
              onClick: handleApprove,
              loading: isLoading,
              icon: Check,
            }
          : undefined
      }
      secondaryButton={{
        label: t("admin.coaching.reviewModal.close"),
        onClick: closeModal,
        icon: X,
      }}
      tertiaryButton={
        isPending
          ? {
              label: t("admin.coaching.reviewModal.reject"),
              onClick: handleReject,
              variant: "danger",
              loading: isLoading,
              disabled: isLoading,
              icon: X,
            }
          : undefined
      }
    >
      <div className="space-y-6">
        <CoachRequestHeader
          profile={profile}
          joinedAt={(request as any).createdAt || createdAt}
          status={isManagerFlow && isPending ? "pending" : status || "pending"}
        />

        <CoachRequestCertifications details={certificationDetails} />

        <CoachRequestDocuments
          documents={documents}
          getSafeFileUrl={getSafeFileUrl}
          getDocumentLabel={getDocumentLabel}
        />

        <CoachRequestSocialLinks links={socialMediaLinks} />
      </div>
    </BaseModal>
  );
}
