import {
  Calendar,
  Check,
  FileText,
  Instagram,
  Link as LinkIcon,
  MapPin,
  UserCheck,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import BaseModal from "../../../../../components/ui/BaseModal";
import StatusBadge from "../../../../../components/ui/StatusBadge";
import { useModalStore } from "../../../../../store/modal";
import { useManageCoachRequest } from "../hooks/useManageCoachRequest";

export default function ReviewCoachRequestModal() {
  const { t } = useTranslation();
  const { currentModal, closeModal, reviewCoachRequestProps } = useModalStore();
  const isOpen = currentModal === "admin_review_coach_request";
  const { request } = reviewCoachRequestProps || {};
  const { approveRequest, rejectRequest, isApproving, isRejecting } =
    useManageCoachRequest();

  if (!isOpen || !request) return null;

  const { profile, coachVerification } = request;
  const { certificationDetails, socialMediaLinks, documents, status } =
    coachVerification || {};

  const handleApprove = () => {
    approveRequest(request._id, {
      onSuccess: () => closeModal(),
    });
  };

  const handleReject = () => {
    rejectRequest(request._id, {
      onSuccess: () => closeModal(),
    });
  };

  /**
   * Helper to ensure valid file access.
   * Forces `/raw/upload/` for file types that must be served as raw resources,
   * including PDFs which Cloudinary may have stored under `/image/upload/` by mistake.
   */
  const getSafeFileUrl = (url: string) => {
    if (!url) return "";
    let finalUrl = url;
    const lowerUrl = url.toLowerCase();

    // These extensions must always be served via /raw/upload/.
    // PDFs included: Cloudinary sometimes stores them under /image/upload/,
    // which returns 401/404. Forcing /raw/ fixes access.
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
   * Extracts a readable filename from a Cloudinary URL as a fallback
   * when `doc.description` is empty.
   * e.g. "https://res.cloudinary.com/.../v123/my_certificate.pdf" → "my_certificate.pdf"
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
      // fall through to default
    }

    return `${t("admin.coaching.reviewModal.document")} ${index + 1}`;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={closeModal}
      icon={UserCheck}
      title={t("admin.coaching.reviewModal.title")}
      subtitle={t("admin.coaching.reviewModal.subtitle")}
      primaryButton={
        status === "pending"
          ? {
              label: t("admin.coaching.reviewModal.approve"),
              onClick: handleApprove,
              loading: isApproving,
              icon: Check,
            }
          : undefined
      }
      secondaryButton={{
        label: t("admin.coaching.reviewModal.close"),
        onClick: closeModal,
      }}
      tertiaryButton={
        status === "pending"
          ? {
              label: t("admin.coaching.reviewModal.reject"),
              onClick: handleReject,
              variant: "danger",
              loading: isRejecting,
              disabled: isApproving,
              icon: X,
            }
          : undefined
      }
    >
      <div className="space-y-6">
        {/* Header User Info */}
        <div className="flex items-start gap-4 p-4 bg-surface-hover rounded-xl border border-border">
          <img
            src={
              profile.profileImageUrl ||
              `https://ui-avatars.com/api/?name=${profile.fullName}`
            }
            alt={profile.fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-text-primary">
              {profile.fullName}
            </h3>
            <p className="text-sm text-text-secondary">@{profile.username}</p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.city ||
                  t("admin.coaching.reviewModal.unknownLocation")}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {t("admin.coaching.reviewModal.joined")}{" "}
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <StatusBadge status={status || "pending"} />
        </div>
        {/* Certification Details */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {t("admin.coaching.reviewModal.certificationDetails")}
          </h4>
          <div className="p-4 bg-surface rounded-xl border border-border text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
            {certificationDetails ||
              t("admin.coaching.reviewModal.noCertificationDetails")}
          </div>
        </div>
        {/* Documents */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            {t("admin.coaching.reviewModal.documents")}
          </h4>
          {documents && documents.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc, index) => (
                <a
                  key={index}
                  href={getSafeFileUrl(doc.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-surface hover:bg-surface-hover border border-border rounded-xl transition-all group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {getDocumentLabel(doc, index)}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {t("admin.coaching.reviewModal.clickToView")}
                    </p>
                  </div>
                  <LinkIcon className="w-4 h-4 text-text-secondary" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary italic">
              {t("admin.coaching.reviewModal.noDocuments")}
            </p>
          )}
        </div>
        {/* Social Media Links */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Instagram className="w-4 h-4 text-primary" />
            {t("admin.coaching.reviewModal.socialMedia")}
          </h4>
          {socialMediaLinks && socialMediaLinks.length > 0 ? (
            <div className="space-y-2">
              {socialMediaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline truncate"
                >
                  <LinkIcon className="w-3 h-3 flex-shrink-0" />
                  {link}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary italic">
              {t("admin.coaching.reviewModal.noSocialMedia")}
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
