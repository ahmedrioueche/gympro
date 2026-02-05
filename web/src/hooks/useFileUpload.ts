import {
  ACCEPT_TYPES,
  formatFileSize,
  uploadApi,
  type UploadProgress,
  type UploadResult,
  validateFile,
} from "@ahmedrioueche/gympro-client";
import { useCallback, useState } from "react";

export interface FileUploadState {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  publicId?: string;
  error?: string;
}

interface UseFileUploadOptions {
  /** Called when all files have been uploaded */
  onComplete?: (results: UploadResult[]) => void;
  /** Called on error */
  onError?: (error: string) => void;
}

/**
 * Reusable hook for file uploads with progress tracking
 */
export const useFileUpload = (options?: UseFileUploadOptions) => {
  const [uploads, setUploads] = useState<FileUploadState[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Validate files before upload
   */
  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; errors: string[] } => {
      const valid: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const validation = validateFile(file);
        if (validation.valid) {
          valid.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      return { valid, errors };
    },
    [],
  );

  /**
   * Upload a single file with progress tracking
   */
  const uploadSingleFile = useCallback(
    async (
      file: File,
      index: number,
      resourceType: "auto" | "raw" | "image" | "video" = "auto",
    ): Promise<UploadResult | null> => {
      // Set initial uploading state
      setUploads((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          status: "uploading",
          progress: 0,
        };
        return updated;
      });

      const result = await uploadApi.uploadWithProgress(
        file,
        resourceType,
        (progress: UploadProgress) => {
          setUploads((prev) => {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              progress: progress.percentage,
            };
            return updated;
          });
        },
      );

      if (result.success && result.data) {
        setUploads((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: "success",
            progress: 100,
            url: result.data!.url,
            publicId: result.data!.publicId,
          };
          return updated;
        });
        return result.data;
      } else {
        setUploads((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            status: "error",
            error: result.message || "Upload failed",
          };
          return updated;
        });
        return null;
      }
    },
    [],
  );

  /**
   * Upload multiple files with progress tracking
   */
  const uploadFiles = useCallback(
    async (
      files: FileList | File[],
      resourceType: "auto" | "raw" | "image" | "video" = "auto",
    ): Promise<UploadResult[]> => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return [];

      // Validate files
      const { valid, errors } = validateFiles(fileArray);

      if (errors.length > 0) {
        errors.forEach((error) => options?.onError?.(error));
      }

      if (valid.length === 0) {
        return [];
      }

      setIsUploading(true);

      // Initialize upload states
      const initialStates: FileUploadState[] = valid.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));
      setUploads(initialStates);

      // Upload all files in parallel
      const uploadPromises = valid.map((file, index) =>
        uploadSingleFile(file, index, resourceType),
      );

      const results = await Promise.all(uploadPromises);
      const successfulResults = results.filter(
        (res): res is UploadResult => res !== null,
      );

      setIsUploading(false);

      if (successfulResults.length > 0) {
        options?.onComplete?.(successfulResults);
      }

      return successfulResults;
    },
    [validateFiles, uploadSingleFile, options],
  );

  /**
   * Clear all upload states
   */
  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  /**
   * Remove a specific upload by index
   */
  const removeUpload = useCallback((index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    uploads,
    isUploading,
    uploadFiles,
    clearUploads,
    removeUpload,
    validateFiles,
    // Re-export utilities
    formatFileSize,
    ACCEPT_TYPES,
  };
};
