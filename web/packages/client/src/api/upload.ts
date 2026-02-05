import { ApiResponse } from "../types/api";
import { getApiClient } from "./config";

export const uploadApi = {
  uploadFile: async (
    file: File,
    resourceType: "auto" | "raw" | "image" = "auto",
  ): Promise<ApiResponse<{ url: string; publicId: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceType", resourceType);

    try {
      const client = getApiClient();

      const response = await client.post<{ url: string; publicId: string }>(
        "/upload/public",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 180000,
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
};
