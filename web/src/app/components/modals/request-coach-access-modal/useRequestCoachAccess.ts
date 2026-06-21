import { dashboardApi, uploadApi } from "@ahmedrioueche/gympro-client";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../../store/modal";
import { useModalLayer } from "../../../../hooks/useModalLayer";
import { useUserStore } from "../../../../store/user";
import { getMessage } from "../../../../utils/statusMessage";

export interface DocumentItem {
  url: string;
  description: string;
  type: string;
  file?: File;
}

export function useRequestCoachAccess() {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();
  const { isOpen, zIndex, closeModal: closeLayerModal } = useModalLayer("request_coach_access");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [certificationDetails, setCertificationDetails] = useState("");
  const [socialMediaLinks, setSocialMediaLinks] = useState<string[]>([""]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const { fetchUser } = useUserStore();
  const { isPending, mutate: requestAccess } = useMutation({
    mutationFn: dashboardApi.requestCoachAccess,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          t("dashboard.requestTimeout", "Request submitted successfully"),
        );
        fetchUser(true);
        closeModal();
        setCertificationDetails("");
        setSocialMediaLinks([""]);
        setDocuments([]);
      } else {
        const statusMessage = getMessage(data, t);
        toast.error(statusMessage.message);
      }
    },
    onError: (error: any) => {
      const statusMessage = getMessage(error.response?.data || error, t);
      toast.error(statusMessage.message);
    },
  });

  const handleAddLink = () => {
    setSocialMediaLinks([...socialMediaLinks, ""]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = socialMediaLinks.filter((_, i) => i !== index);
    setSocialMediaLinks(newLinks);
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...socialMediaLinks];
    newLinks[index] = value;
    setSocialMediaLinks(newLinks);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("common.fileTooLarge", "File size must be less than 5MB"));
      return;
    }

    try {
      setUploading(true);

      const isDocument =
        /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|csv)$/i.test(file.name);
      const resourceType = isDocument ? "raw" : "auto";

      const response = await uploadApi.uploadFile(file, resourceType);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Upload failed");
      }

      const url = response.data.url;

      setDocuments([
        ...documents,
        {
          url,
          description: file.name,
          type: "certificate",
          file,
        },
      ]);
      toast.success(t("common.uploadSuccess", "File uploaded successfully"));
    } catch (error: any) {
      console.error("Upload failed", error);
      toast.error(
        error.message || t("common.uploadError", "Failed to upload file"),
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDocs = [...documents];
    newDocs[index].description = value;
    setDocuments(newDocs);
  };

  const handleSubmit = () => {
    const validLinks = socialMediaLinks.filter((link) => link.trim());

    if (!certificationDetails.trim()) {
      toast.error(
        t(
          "dashboard.errors.certificationRequired",
          "Certification details are required",
        ),
      );
      return;
    }

    if (documents.length === 0) {
      toast.error(
        t(
          "dashboard.errors.documentsRequired",
          "Please upload at least one certification file",
        ),
      );
      return;
    }

    requestAccess({
      certificationDetails,
      socialMediaLinks: validLinks.length > 0 ? validLinks : undefined,
      documents: documents.map((d) => ({
        url: d.url,
        description: d.description,
        type: d.type,
      })),
    });
  };

  return {
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
    zIndex,
  };
}
