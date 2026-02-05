import { ReportPriority, ReportType } from "@ahmedrioueche/gympro-client";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { useCreateReport } from "../../../../hooks/queries/useReports";
import { useFileUpload } from "../../../../hooks/useFileUpload";
import { useModalStore } from "../../../../store/modal";

export const useCreateReportForm = () => {
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
      onComplete: (results) => {
        setAttachments((prev) => [...prev, ...results.map((r) => r.url)]);
      },
      onError: (error) => {
        toast.error(error);
      },
    });

  const isValid = subject.trim().length > 0 && description.trim().length > 0;

  const resetForm = useCallback(() => {
    setSubject("");
    setDescription("");
    setType(ReportType.ISSUE);
    setPriority(ReportPriority.MEDIUM);
    setAttachments([]);
    clearUploads();
  }, [clearUploads]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    await uploadFiles(files);
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setAttachments((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleClose = useCallback(() => {
    resetForm();
    closeModal();
  }, [resetForm, closeModal]);

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
      resetForm();
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
    handleClose,
    isValid,
    isPending: createReport.isPending,
    ACCEPT_TYPES,
  };
};
