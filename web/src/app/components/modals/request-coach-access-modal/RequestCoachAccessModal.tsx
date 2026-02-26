import { Key, Send, X } from "lucide-react";
import BaseModal from "../../../../components/ui/BaseModal";
import { CertificationDetailsSection } from "./CertificationDetailsSection";
import { DocumentUploadSection } from "./DocumentUploadSection";
import { SocialMediaLinksSection } from "./SocialMediaLinksSection";
import { useRequestCoachAccess } from "./useRequestCoachAccess";

export default function RequestCoachAccessModal() {
  const {
    isOpen,
    certificationDetails,
    setCertificationDetails,
    socialMediaLinks,
    documents,
    uploading,
    isPending,
    fileInputRef,
    closeModal,
    handleAddLink,
    handleRemoveLink,
    handleLinkChange,
    handleFileUpload,
    handleRemoveDocument,
    handleDescriptionChange,
    handleSubmit,
    t,
  } = useRequestCoachAccess();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={Key}
      title={t("dashboard.requestCoachAccess", "Request Coach Access")}
      subtitle={t(
        "dashboard.coachAccessDescription",
        "To access the coach dashboard, please provide your certification details.",
      )}
      primaryButton={{
        label: t("common.submit", "Submit"),
        onClick: handleSubmit,
        loading: isPending || uploading,
        disabled:
          !certificationDetails.trim() || uploading || documents.length === 0,
        icon: Send,
      }}
      secondaryButton={{
        label: t("common.cancel", "Cancel"),
        onClick: closeModal,
        icon: X,
      }}
    >
      <div className="space-y-6">
        <CertificationDetailsSection
          value={certificationDetails}
          onChange={setCertificationDetails}
        />

        <DocumentUploadSection
          documents={documents}
          uploading={uploading}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
          onRemoveDocument={handleRemoveDocument}
          onDescriptionChange={handleDescriptionChange}
        />

        <SocialMediaLinksSection
          links={socialMediaLinks}
          onAddLink={handleAddLink}
          onRemoveLink={handleRemoveLink}
          onLinkChange={handleLinkChange}
        />
      </div>
    </BaseModal>
  );
}
