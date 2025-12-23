import axios, { AxiosInstance } from "axios";
import { TokenManager } from "./token";

export interface ApiConfig {
  baseURL?: string;
  isDev?: boolean;
  timeout?: number;
}

let configuredBaseURL: string | null = null;
export let IS_DEV = false;
export const DEFAULT_BASE_URL = "http://localhost:3000/api";

export const BASE_URL = (): string => {
  return configuredBaseURL || DEFAULT_BASE_URL;
};

let apiClientInstance: AxiosInstance | null = null;

export const configureApi = (config: ApiConfig): void => {
  if (config.baseURL) {
    configuredBaseURL = config.baseURL;
  }
  if (config.isDev) {
    IS_DEV = config.isDev;
  }
  // Reset the instance so it gets recreated with new config
  apiClientInstance = null;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiClientInstance) {
    apiClientInstance = axios.create({
      baseURL: BASE_URL(),
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // Add interceptor to include token from localStorage if available
    apiClientInstance.interceptors.request.use((config) => {
      const token = TokenManager.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  return apiClientInstance;
};
