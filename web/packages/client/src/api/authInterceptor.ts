import axios, { AxiosError, AxiosInstance } from "axios";
import { BASE_URL } from "./config";
import { TokenManager } from "./token";

const AUTH_SKIP_PATHS = ["/auth/refresh", "/auth/login", "/auth/signup"];

let refreshPromise: Promise<string | null> | null = null;
const INTERCEPTOR_MARKER = Symbol("authInterceptorInstalled");

const isAuthSkipPath = (url?: string) =>
  !!url && AUTH_SKIP_PATHS.some((path) => url.includes(path));

const decodeTokenExpiry = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

/** Refresh access token using raw axios (bypasses response interceptors). */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) return null;

      const res = await axios.post(
        `${BASE_URL()}/auth/refresh`,
        { refreshToken },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const accessToken = res.data?.data?.accessToken;
      if (res.data?.success && accessToken) {
        TokenManager.setAccessToken(accessToken);
        return accessToken;
      }

      return null;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/** Proactively refresh when token is missing, expired, or close to expiring. */
export const ensureValidAccessToken = async (
  refreshBufferMs = 60_000,
): Promise<boolean> => {
  const token = TokenManager.getAccessToken();
  if (!token) {
    return !!(await refreshAccessToken());
  }

  const expiresAt = decodeTokenExpiry(token);
  if (!expiresAt || expiresAt - Date.now() < refreshBufferMs) {
    return !!(await refreshAccessToken());
  }

  return true;
};

export const setupAuthInterceptor = (client: AxiosInstance): void => {
  if (
    (client as AxiosInstance & { [INTERCEPTOR_MARKER]?: boolean })[
      INTERCEPTOR_MARKER
    ]
  ) {
    return;
  }

  (client as AxiosInstance & { [INTERCEPTOR_MARKER]?: boolean })[
    INTERCEPTOR_MARKER
  ] = true;

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const original = error.config as
        | (typeof error.config & { _retry?: boolean })
        | undefined;
      const url = original?.url ?? "";

      if (isAuthSkipPath(url)) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && original && !original._retry) {
        original._retry = true;

        const newToken = await refreshAccessToken();
        if (newToken) {
          original.headers = original.headers ?? {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return client(original);
        }

        TokenManager.clearTokens();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/auth/")
        ) {
          window.location.href = "/auth/login";
        }
      }

      return Promise.reject(error);
    },
  );
};
