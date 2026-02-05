import {
  ReportPriority,
  ReportType,
  uploadApi,
} from "@ahmedrioueche/gympro-client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateReport } from "../../../../hooks/queries/useReports";
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
  const [isUploading, setIsUploading] = useState(false);

  const isValid = subject.trim().length > 0 && description.trim().length > 0;

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

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
        toast.error("Some files failed to upload");
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
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
    handleSubmit,
    isValid,
    isPending: createReport.isPending,
  };
};
