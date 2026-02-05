import { ReportPriority, ReportType } from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCreateReport } from "../../../../hooks/queries/useReports";
import { useFileUpload } from "../../../../hooks/useFileUpload";
import { useModalStore } from "../../../../store/modal";

export const useCreateReportForm = () => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();
  const createReport = useCreateReport();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ReportType>(ReportType.ISSUE);
  const [priority, setPriority] = useState<ReportPriority>(
    ReportPriority.MEDIUM,
  );
  const [attachments, setAttachments] = useState<string[]>([]);

  const { uploads, isUploading, uploadFiles, clearUploads, ACCEPT_TYPES } =
    useFileUpload({
      onComplete: (urls) => {
        setAttachments((prev) => [...prev, ...urls]);
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const isValid = subject.trim().length > 0 && description.trim().length > 0;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await uploadFiles(files);
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      await createReport.mutateAsync({
        subject,
        description,
        type,
        priority,
        attachments,
      });
      clearUploads();
      closeModal();
    } catch {
      // Error toast handled by hook
    }
  };

  return {
    subject,
    setSubject,
    description,
    setDescription,
    type,
    setType,
    priority,
    setPriority,
    attachments,
    setAttachments,
    handleUpload,
    handleRemoveAttachment,
    isUploading,
    uploads,
    handleSubmit,
    isValid,
    isPending: createReport.isPending,
    ACCEPT_TYPES,
  };
};
