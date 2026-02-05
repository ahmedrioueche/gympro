import { ApiResponse } from "../types/api";
import {
  formatFileSize,
  getMaxSizeForMime,
  type UploadProgress,
  type UploadResult,
  validateFile,
} from "../types/upload";
import { getApiBaseUrl, getApiClient, getAuthToken } from "./config";

export const uploadApi = {
  /**
   * Upload a file without progress tracking (uses axios)
   */
  uploadFile: async (
    file: File,
    resourceType: "auto" | "raw" | "image" = "auto",
  ): Promise<ApiResponse<UploadResult>> => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error || "Invalid file",
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", resourceType);

    try {
      const client = getApiClient();

      const response = await client.post<UploadResult>(
        "/upload/public",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 180000, // 3 minutes for large files
        },
      );

      return {
        success: true,
        data: response.data,
        message: "Upload successful",
      };
    } catch (error: any) {
      console.error("Upload API Error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Upload failed",
      };
    }
  },

  /**
   * Upload a file with progress tracking (uses XMLHttpRequest)
   */
  uploadWithProgress: (
    file: File,
    resourceType: "auto" | "raw" | "image" = "auto",
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<ApiResponse<UploadResult>> => {
    return new Promise((resolve) => {
      // Validate file first
      const validation = validateFile(file);
      if (!validation.valid) {
        resolve({
          success: false,
          message: validation.error || "Invalid file",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", resourceType);

      const xhr = new XMLHttpRequest();
      const baseUrl = getApiBaseUrl();
      const token = getAuthToken();

      xhr.open("POST", `${baseUrl}/upload/public`, true);

      // Set auth header
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress({
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          });
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              data,
              message: "Upload successful",
            });
          } catch {
            resolve({
              success: false,
              message: "Failed to parse response",
            });
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            resolve({
              success: false,
              message: error.message || `Upload failed (${xhr.status})`,
            });
          } catch {
            resolve({
              success: false,
              message: `Upload failed with status ${xhr.status}`,
            });
          }
        }
      };

      xhr.onerror = () => {
        resolve({
          success: false,
          message: "Network error during upload",
        });
      };

      xhr.ontimeout = () => {
        resolve({
          success: false,
          message: "Upload timed out",
        });
      };

      // 3 minute timeout for large files
      xhr.timeout = 180000;

      xhr.send(formData);
    });
  },

  /**
   * Validate a file before upload
   */
  validateFile,

  /**
   * Get max size for a file type
   */
  getMaxSizeForMime,

  /**
   * Format file size to human readable
   */
  formatFileSize,
};
